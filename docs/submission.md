# PrivateGrant Vault Submission

## X Post Draft

Introducing PrivateGrant Vault — confidential grant, bounty and payroll payouts powered by @iEx_ec Nox Confidential Tokens.

Sponsors can fund campaigns, shield ERC-20s, and send private ERC-7984 payouts where amounts and balances stay confidential while settlement remains auditable.

Built with Nox TEE-based Confidential Tokens + ChainGPT AI review assistant.

Demo: [video]  
GitHub: [repo]

@iEx_ec @Chain_GPT

## Short Project Description

PrivateGrant Vault is a confidential payout dApp for Web3 teams. Sponsors create public campaigns, shield ERC-20 funding into an iExec Nox ERC-7984 Confidential Token, and send private rewards to builders without publishing payout amounts or balances.

## 4-Minute Demo Script

0:00-0:25: Open landing page. Explain that public grant payouts leak compensation and reward strategy.

0:25-0:55: Connect wallet on Arbitrum Sepolia. Show the dashboard reading real deployed vault events.

0:55-1:30: Create a campaign with token, Nox confidential wrapper, public budget, category, deadline, and optional auditor.

1:30-2:10: Approve ERC-20 and shield funds through the Nox ERC-20 to ERC-7984 wrapper. Show Arbiscan transaction hash.

2:10-2:55: Authorize the vault as ERC-7984 operator, encrypt a payout amount with the Nox Handle SDK, and send a confidential payout. Emphasize the vault event contains only the returned encrypted handle.

2:55-3:25: Switch to recipient dashboard. Show the confidential balance handle and decrypt flow if viewer access is available.

3:25-3:45: Show auditor mode and explain Nox viewer access for selected payout handles.

3:45-4:00: Show ChainGPT assistant summary and close with the Nox TEE-based implementation note.

## GitHub Checklist

- [x] Complete open-source frontend and contracts
- [x] Uses iExec Nox packages
- [x] Avoids OpenZeppelin/Zama confidential contracts
- [x] README with setup, deployment, usage, demo instructions
- [x] `feedback.md`
- [x] `docs/nox-integration-notes.md`
- [x] `docs/submission.md`
- [x] Tests for contract rules and frontend validation
- [ ] Add deployed Arbitrum Sepolia addresses after running deployment
- [ ] Add final demo video link

## DoraHacks Checklist

- [ ] Repository URL
- [ ] Demo video under 4 minutes
- [ ] Live frontend URL
- [ ] Arbitrum Sepolia vault address
- [ ] Arbitrum Sepolia Nox confidential token wrapper address
- [ ] Short write-up explaining Nox TEE-based ERC-7984 usage
