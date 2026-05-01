// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {
    IERC20ToERC7984Wrapper
} from "@iexec-nox/nox-confidential-contracts/contracts/interfaces/IERC20ToERC7984Wrapper.sol";
import {
    IERC7984
} from "@iexec-nox/nox-confidential-contracts/contracts/interfaces/IERC7984.sol";
import {
    Nox,
    euint256,
    externalEuint256
} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";

/**
 * @title PrivateGrantVault
 * @notice Coordinates public grant campaign metadata with iExec Nox ERC-7984 confidential token payouts.
 * @dev Public: campaign metadata, campaign budget, shield amount, payout recipient, payout occurrence.
 *      Confidential: payout amount and confidential balances, represented only as Nox encrypted handles.
 */
contract PrivateGrantVault is ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Campaign {
        uint256 id;
        address sponsor;
        address token;
        address confidentialToken;
        string name;
        string description;
        string category;
        uint256 publicBudget;
        uint64 deadline;
        uint64 createdAt;
        address auditor;
        bool isActive;
    }

    struct PayoutMetadata {
        address recipient;
        address operator;
        bytes32 confidentialTransferRef;
        string memo;
        uint64 createdAt;
    }

    uint256 public nextCampaignId = 1;

    mapping(uint256 id => Campaign campaign) private _campaigns;
    mapping(uint256 id => PayoutMetadata[] payouts) private _payouts;

    event CampaignCreated(
        uint256 indexed id,
        address indexed sponsor,
        address indexed token,
        address confidentialToken,
        string name,
        string category,
        uint256 publicBudget,
        uint64 deadline,
        address auditor
    );
    event ConfidentialTokenRegistered(
        uint256 indexed id,
        address indexed sponsor,
        address indexed confidentialToken
    );
    event FundsShielded(
        uint256 indexed id,
        address indexed sponsor,
        address indexed token,
        address confidentialToken,
        uint256 publicAmount,
        bytes32 confidentialAmountHandle
    );
    event ConfidentialPayoutSent(
        uint256 indexed id,
        address indexed sponsor,
        address indexed recipient,
        address confidentialToken,
        bytes32 confidentialTransferRef,
        string memo
    );
    event PayoutRecorded(
        uint256 indexed id,
        address indexed sponsor,
        address indexed recipient,
        bytes32 confidentialTransferRef,
        string memo
    );
    event CampaignClosed(uint256 indexed id, address indexed sponsor);
    event AuditorGranted(uint256 indexed id, address indexed auditor, bytes32 indexed handle);
    event AuditorRevoked(uint256 indexed id, address indexed auditor);

    error EmptyString();
    error InvalidAddress();
    error InvalidBudget();
    error InvalidCampaign();
    error InvalidDeadline();
    error InvalidConfidentialToken();
    error InvalidPayoutReference();
    error NotCampaignSponsor();
    error CampaignInactive();

    modifier existingCampaign(uint256 id) {
        if (_campaigns[id].sponsor == address(0)) revert InvalidCampaign();
        _;
    }

    modifier onlySponsor(uint256 id) {
        if (_campaigns[id].sponsor != msg.sender) revert NotCampaignSponsor();
        _;
    }

    modifier activeCampaign(uint256 id) {
        if (!_campaigns[id].isActive) revert CampaignInactive();
        _;
    }

    function createCampaign(
        string calldata name,
        string calldata description,
        address token,
        address confidentialToken,
        string calldata category,
        uint256 publicBudget,
        uint64 deadline,
        address auditor
    ) external returns (uint256 id) {
        _requireNonEmpty(name);
        _requireNonEmpty(description);
        _requireNonEmpty(category);
        if (token == address(0)) revert InvalidAddress();
        if (publicBudget == 0) revert InvalidBudget();
        if (deadline != 0 && deadline <= block.timestamp) revert InvalidDeadline();
        if (confidentialToken != address(0)) {
            _validateWrapper(token, confidentialToken);
        }

        id = nextCampaignId++;
        _campaigns[id] = Campaign({
            id: id,
            sponsor: msg.sender,
            token: token,
            confidentialToken: confidentialToken,
            name: name,
            description: description,
            category: category,
            publicBudget: publicBudget,
            deadline: deadline,
            createdAt: uint64(block.timestamp),
            auditor: auditor,
            isActive: true
        });

        emit CampaignCreated(
            id,
            msg.sender,
            token,
            confidentialToken,
            name,
            category,
            publicBudget,
            deadline,
            auditor
        );
    }

    function registerConfidentialToken(
        uint256 id,
        address confidentialToken
    ) external existingCampaign(id) onlySponsor(id) activeCampaign(id) {
        if (confidentialToken == address(0)) revert InvalidAddress();
        _validateWrapper(_campaigns[id].token, confidentialToken);
        _campaigns[id].confidentialToken = confidentialToken;
        emit ConfidentialTokenRegistered(id, msg.sender, confidentialToken);
    }

    function shieldCampaignFunds(
        uint256 id,
        uint256 amount
    )
        external
        nonReentrant
        existingCampaign(id)
        onlySponsor(id)
        activeCampaign(id)
        returns (bytes32 confidentialAmountHandle)
    {
        if (amount == 0) revert InvalidBudget();
        Campaign storage campaign = _campaigns[id];
        if (campaign.confidentialToken == address(0)) revert InvalidConfidentialToken();

        IERC20(campaign.token).safeTransferFrom(msg.sender, address(this), amount);
        IERC20(campaign.token).forceApprove(campaign.confidentialToken, amount);

        euint256 wrappedAmount = IERC20ToERC7984Wrapper(campaign.confidentialToken).wrap(
            msg.sender,
            amount
        );
        confidentialAmountHandle = euint256.unwrap(wrappedAmount);

        emit FundsShielded(
            id,
            msg.sender,
            campaign.token,
            campaign.confidentialToken,
            amount,
            confidentialAmountHandle
        );
    }

    function sendConfidentialPayout(
        uint256 id,
        address recipient,
        externalEuint256 encryptedAmount,
        bytes calldata inputProof,
        string calldata memo
    )
        external
        nonReentrant
        existingCampaign(id)
        onlySponsor(id)
        activeCampaign(id)
        returns (bytes32 confidentialTransferRef)
    {
        if (recipient == address(0)) revert InvalidAddress();
        Campaign storage campaign = _campaigns[id];
        if (campaign.confidentialToken == address(0)) revert InvalidConfidentialToken();

        euint256 amount = Nox.fromExternal(encryptedAmount, inputProof);
        Nox.allowTransient(amount, campaign.confidentialToken);
        euint256 transferred = IERC7984(campaign.confidentialToken).confidentialTransferFrom(
            msg.sender,
            recipient,
            amount
        );

        Nox.allow(transferred, address(this));
        confidentialTransferRef = euint256.unwrap(transferred);
        _storePayout(id, recipient, msg.sender, confidentialTransferRef, memo);

        if (campaign.auditor != address(0)) {
            Nox.addViewer(transferred, campaign.auditor);
            emit AuditorGranted(id, campaign.auditor, confidentialTransferRef);
        }

        emit ConfidentialPayoutSent(
            id,
            msg.sender,
            recipient,
            campaign.confidentialToken,
            confidentialTransferRef,
            memo
        );
    }

    function recordPayout(
        uint256 id,
        address recipient,
        bytes32 confidentialTransferRef,
        string calldata memo
    ) external existingCampaign(id) onlySponsor(id) activeCampaign(id) {
        if (recipient == address(0)) revert InvalidAddress();
        if (confidentialTransferRef == bytes32(0)) revert InvalidPayoutReference();
        _storePayout(id, recipient, msg.sender, confidentialTransferRef, memo);
        emit PayoutRecorded(id, msg.sender, recipient, confidentialTransferRef, memo);
    }

    function grantAuditorForPayout(
        uint256 id,
        uint256 payoutIndex,
        address auditor
    ) external existingCampaign(id) onlySponsor(id) {
        if (auditor == address(0)) revert InvalidAddress();
        if (payoutIndex >= _payouts[id].length) revert InvalidPayoutReference();

        bytes32 handle = _payouts[id][payoutIndex].confidentialTransferRef;
        Nox.addViewer(euint256.wrap(handle), auditor);
        _campaigns[id].auditor = auditor;
        emit AuditorGranted(id, auditor, handle);
    }

    function revokeCampaignAuditor(
        uint256 id
    ) external existingCampaign(id) onlySponsor(id) {
        address auditor = _campaigns[id].auditor;
        _campaigns[id].auditor = address(0);
        emit AuditorRevoked(id, auditor);
    }

    function closeCampaign(
        uint256 id
    ) external existingCampaign(id) onlySponsor(id) activeCampaign(id) {
        _campaigns[id].isActive = false;
        emit CampaignClosed(id, msg.sender);
    }

    function getCampaign(uint256 id) external view existingCampaign(id) returns (Campaign memory) {
        return _campaigns[id];
    }

    function payoutCount(uint256 id) external view existingCampaign(id) returns (uint256) {
        return _payouts[id].length;
    }

    function getPayout(
        uint256 id,
        uint256 payoutIndex
    ) external view existingCampaign(id) returns (PayoutMetadata memory) {
        if (payoutIndex >= _payouts[id].length) revert InvalidPayoutReference();
        return _payouts[id][payoutIndex];
    }

    function _storePayout(
        uint256 id,
        address recipient,
        address operator,
        bytes32 confidentialTransferRef,
        string calldata memo
    ) private {
        _payouts[id].push(
            PayoutMetadata({
                recipient: recipient,
                operator: operator,
                confidentialTransferRef: confidentialTransferRef,
                memo: memo,
                createdAt: uint64(block.timestamp)
            })
        );
    }

    function _validateWrapper(address token, address confidentialToken) private view {
        try IERC20ToERC7984Wrapper(confidentialToken).underlying() returns (address underlying) {
            if (underlying != token) revert InvalidConfidentialToken();
        } catch {
            revert InvalidConfidentialToken();
        }
    }

    function _requireNonEmpty(string calldata value) private pure {
        if (bytes(value).length == 0) revert EmptyString();
    }
}
