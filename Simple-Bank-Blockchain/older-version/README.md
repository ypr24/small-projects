# Simple Bank With Blockchain

A small browser-based banking application backed by a Solidity smart contract. The frontend uses Web3.js to connect to an injected wallet such as MetaMask and lets users create an account, view account information, update their details, deposit and withdraw balances, and transfer balances to another registered user by email.

## Features

- Register an account with a name and email address.
- View account information and the current balance.
- Deposit and withdraw balance units.
- Transfer balance units to another registered account by email.
- Change the registered name or email address.
- View the deployed contract activity through Etherscan.

## Project Structure

| File | Description |
| --- | --- |
| `index.html` | Frontend UI, Web3.js integration, contract ABI, and contract address. |
| `index.js` | Minimal Node.js HTTP server for serving `index.html`. |
| `Bank.sol` | Solidity smart contract that stores accounts and processes transactions. |
| `package.json` | Project metadata and the local development command. |

## Prerequisites

- Node.js installed on your machine.
- A browser wallet, such as MetaMask, with an account selected.
- Access to the Ethereum network that contains the deployed contract.
- Test funds for transaction gas on that network.

The frontend currently uses the contract address `0xBe836E4f91733531D83229FD9d225d8A68bf26E7`. The page also contains a Rinkeby Etherscan link, but Rinkeby has been deprecated. For reliable use today, deploy the contract to a supported testnet and update the address, ABI, and explorer URL in `index.html`.

## Run Locally

Install dependencies, if any are added later, and start the local server:

```bash
npm install
npm run dev
```

The server listens on port `3000` by default. Open [http://localhost:3000](http://localhost:3000) in a browser. To use a different port:

```bash
PORT=8080 npm run dev
```

Opening `index.html` directly may prevent the application from working correctly because the browser wallet provider and local file origins can behave differently. Use the Node server instead.

## Using the Application

1. Install and unlock MetaMask, then select the network where the contract is deployed.
2. Open the application at `http://localhost:3000` and allow the site to connect to the selected account.
3. Register once with a name and a unique email address.
4. Use **Get Balance** or **Get User Information** to query the account.
5. Enter an amount and choose **Deposit** or **Withdraw**.
6. To transfer funds, enter the recipient's registered email and the amount, then choose **Send Money**.
7. Confirm each transaction in MetaMask. The interface displays a success or failure message after the transaction is mined.

All transaction amounts are stored as integer values by the contract. The application labels them with `$`, but it does not implement a real currency conversion or token balance.

## Smart Contract

`Bank.sol` stores account data in mappings keyed by wallet address. It exposes functions for:

- `createAccount(name, email)`
- `getAccountInfo()` and `getBalance()`
- `deposit(amount)` and `withdraw(amount)`
- `moneytransfer(amount, recipientEmail)`
- `resetName(name)` and `resetEmail(email)`

The contract emits events such as `checkInfo`, `checkbalance`, `checkDeposit`, `checkWithdraw`, and `checkTransfer`. The frontend reads these events from transaction receipts to update the page.

## Deployment Notes

The contract source is included for reference and redeployment. If you deploy a new version:

1. Compile `Bank.sol` with a Solidity compiler compatible with `>=0.7.0 <0.8.0`.
2. Deploy the resulting contract to your chosen Ethereum network.
3. Replace the contract address and ABI in `index.html`.
4. Update the Etherscan iframe URL to the matching network and contract address.
5. Make sure MetaMask is connected to the same network.

This repository does not include a deployment framework, automated tests, or a persistent backend.

## Important Limitations

- Account and balance data are public blockchain data; do not use real financial information or funds.
- The contract uses a simple internal integer balance and does not transfer native cryptocurrency or ERC-20 tokens.
- The frontend assumes an injected Web3 provider and an available wallet account.
- Input validation is minimal. Empty, negative, non-integer, duplicate, or otherwise invalid values may fail at the wallet or contract level.
- The contract maps emails to addresses without preventing email collisions or removing an old email mapping when an email is changed.
- The embedded Rinkeby explorer URL is legacy configuration and may no longer load.

## License

The project currently declares the ISC license in `package.json`.

