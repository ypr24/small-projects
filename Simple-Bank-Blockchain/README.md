# Counter dApp

This project contains a small Solidity counter contract, a Foundry deployment script, and a browser frontend. The frontend connects to a local Anvil blockchain through ethers.js.

## Prerequisites

Install Foundry, MetaMask (or another browser wallet), and Python 3.

From the project root, build and test the contract:

```bash
forge build
forge test
```

## 1. Start Anvil

Open a terminal in the project root and run:

```bash
anvil
```

Keep this terminal open. Anvil creates a temporary local Ethereum network at:

| Setting | Value |
| --- | --- |
| RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `31337` |
| Currency | `ETH` |

Anvil prints funded accounts and private keys. These accounts exist only on this disposable local chain. Never import an Anvil private key into a real network or use a real wallet private key in this project.

In a second terminal, export the RPC URL and one Anvil private key. Replace the placeholder with a private key printed by Anvil:

```bash
export RPC_URL="http://127.0.0.1:8545"
export ANVIL_PRIVATE_KEY="0xPASTE_ANVIL_PRIVATE_KEY_HERE"
export ANVIL_ACCOUNT="$(cast wallet address --private-key "$ANVIL_PRIVATE_KEY")"

echo "Using account: $ANVIL_ACCOUNT"
cast balance "$ANVIL_ACCOUNT" --rpc-url "$RPC_URL"
```

`ANVIL_ACCOUNT` is the public address derived from the private key. It is safe to display and use as an account address; the private key must remain private even though this local key is disposable.

## 2. Deploy the Counter contract

Run the deployment script with the exported key:

```bash
forge script script/Counter.s.sol:CounterScript \
  --rpc-url "$RPC_URL" \
  --private-key "$ANVIL_PRIVATE_KEY" \
  --broadcast
```

Find the `Contract Address` in the command output and export it for later commands:

```bash
export COUNTER_ADDRESS="0xPASTE_DEPLOYED_CONTRACT_ADDRESS_HERE"
cast call "$COUNTER_ADDRESS" "number()(uint256)" --rpc-url "$RPC_URL"
```

The initial counter value should be `0`. Every successful `increment()` transaction creates a new block on Anvil.

## 3. Configure MetaMask

MetaMask must use the same local network as the frontend:

1. Open MetaMask and open the network selector.
2. Choose **Add network** and then **Add a network manually**.
3. Enter these values:
   - Network name: `Anvil Local`
   - New RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency symbol: `ETH`
   - Block explorer URL: leave empty
4. Save the network and select it.
5. Import the same Anvil account used for deployment by selecting **Import account**, then pasting its private key.

Use only a private key printed by the currently running Anvil instance. Restarting Anvil usually creates a new chain and new accounts unless a fixed mnemonic is configured.

## 4. Start the frontend

From the project root, run:

```bash
python3 -m http.server 8080 --directory frontend
```

Open [http://127.0.0.1:8080](http://127.0.0.1:8080). The counter page is `frontend/Counter.html`; update `CONTRACT_ADDRESS` there if you deploy a new Counter contract.

The page can:

- Read and display the current counter value.
- Connect MetaMask and send `increment()` transactions.
- Display every block from block `0` through the latest Anvil block.
- Look up an individual block by number, including its hash, parent hash, timestamp, and transaction count.

## 5. Try the dApp

1. Confirm MetaMask is connected to `Anvil Local`.
2. Click **Connect Wallet** and approve the connection.
3. Click **Increment** and approve the transaction.
4. Wait for the transaction to be mined. The counter and block list will update.
5. Enter a block number, such as `1`, and click **View Block**.

The **Refresh** button reads the counter again. **Refresh All Blocks** reads the current Anvil chain and displays all blocks.

## How the pieces fit together

This project demonstrates two separate contracts and two separate browser pages. Both contracts run on the same local Anvil blockchain, but each page talks to its own deployed contract address.

### Counter contract and page

- `src/Counter.sol` stores one unsigned integer in `number`.
- `setNumber(uint256)` replaces the stored value, while `increment()` increases it by one.
- `script/Counter.s.sol` deploys a new Counter contract and prints its address.
- `frontend/Counter.html` reads `number()` through ethers.js and displays the current value.
- Clicking **Increment** asks MetaMask to sign a transaction. After Anvil mines it, the page reads the new value and refreshes the block list.
- The block explorer in `Counter.html` uses the provider's `getBlockNumber()` and `getBlock()` calls to display blocks without needing a contract transaction.

### Bank contract and page

- `src/Bank.sol` stores a separate ETH balance for every wallet in `balances[address]`.
- `deposit()` is payable. The ETH sent with the transaction is added to the connected wallet's recorded balance.
- `withdraw(amount)` checks that the wallet has enough recorded balance, subtracts the amount, and sends the ETH back to that wallet.
- `script/Bank.s.sol` deploys a new Bank contract. Its address must be placed in `BANK_ADDRESS` inside `frontend/bank.html`.
- `frontend/bank.html` connects MetaMask, reads the connected wallet's bank balance, and sends deposit or withdrawal transactions after the user approves them.
- The displayed bank balance is the amount recorded inside the Bank contract. It is not the wallet's total ETH balance shown by MetaMask.

### Read and write flow

1. The page creates a read-only ethers `JsonRpcProvider` connected to `http://127.0.0.1:8545`.
2. Read operations, such as reading the counter or bank balance, use that provider and do not require a wallet signature.
3. Write operations, such as `increment()`, `deposit()`, and `withdraw()`, use an ethers `BrowserProvider` backed by MetaMask.
4. MetaMask asks the user to approve the transaction and signs it with the connected Anvil account.
5. Anvil mines the transaction, updates contract state, and the page reads the updated state after confirmation.

The contract address is important because the frontend does not discover deployments automatically. `CONTRACT_ADDRESS` in `frontend/Counter.html` must point to the deployed Counter, and `BANK_ADDRESS` in `frontend/bank.html` must point to the deployed Bank. If either address is wrong, reads and transactions will fail or interact with a different contract.

## Troubleshooting

- **Could not connect to blockchain:** make sure Anvil is still running on port `8545`.
- **Wrong counter address:** set `CONTRACT_ADDRESS` in `frontend/Counter.html` to the address printed by the deployment command.
- **MetaMask is on the wrong network:** select `Anvil Local` and confirm chain ID `31337`.
- **Insufficient funds:** import an account and private key printed by the current Anvil process.
- **The page does not update:** refresh the page, then click **Refresh All Blocks**. Check the browser console for RPC errors.

## Bank contract and frontend

The bank is a separate contract that tracks each wallet's deposited ETH. It has two user actions:

- `deposit()` adds ETH to the caller's bank balance.
- `withdraw(amount)` sends deposited ETH back to the caller.

Deploy it with the same Anvil account:

```bash
forge script script/Bank.s.sol:BankScript \
  --rpc-url "$RPC_URL" \
  --private-key "$ANVIL_PRIVATE_KEY" \
  --broadcast
```

Copy the new `Contract Address` from the output. Open `frontend/bank.html` and replace the zero address in `BANK_ADDRESS`:

```js
const BANK_ADDRESS = "0xPASTE_DEPLOYED_BANK_ADDRESS_HERE";
```

Open the bank frontend at [http://127.0.0.1:8080/bank.html](http://127.0.0.1:8080/bank.html). Connect MetaMask on `Anvil Local`, enter an ETH amount, and approve the deposit or withdrawal transaction. The displayed balance is the amount recorded for the connected wallet by the bank contract, not the wallet's total ETH balance.

The counter frontend is available at [http://127.0.0.1:8080/Counter.html](http://127.0.0.1:8080/Counter.html).