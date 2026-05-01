// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {
    ERC7984
} from "@iexec-nox/nox-confidential-contracts/contracts/token/ERC7984.sol";
import {
    ERC20ToERC7984Wrapper
} from "@iexec-nox/nox-confidential-contracts/contracts/token/extensions/ERC20ToERC7984Wrapper.sol";

/**
 * @notice Concrete iExec Nox ERC-20 to ERC-7984 wrapper for demo deployments.
 * @dev Uses the Nox TEE-backed confidential-token implementation from @iexec-nox.
 */
contract NoxERC20ConfidentialWrapper is ERC20ToERC7984Wrapper {
    constructor(
        IERC20 underlying_,
        string memory name_,
        string memory symbol_,
        string memory contractURI_
    ) ERC7984(name_, symbol_, contractURI_) ERC20ToERC7984Wrapper(underlying_) {}
}
