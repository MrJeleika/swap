## Environment variables

Add your RPC endoint and private key to a `.env` file:

```env
RPC_URL=YOUR_RPC_URL
WALLET_PRIVATE_KEY=YOUR_PRIVATE_KEY
```

## Installation

Clone the repository locally and install the dependencies:

```bash
git clone https://github.com/soos3d/raydium-sdk-swap-example.git
cd raydium-sdk-swap-example
yarn
```

## Usage

Edit the configuration in `src/swapConfig.ts` editing:

- Select if you want to send the transaction or only simulate
- The amount to swap
- The tokens to swap
- The liquidity file to pull the pool info from

```ts
export const swapConfig = {
  executeSwap: false, // Send tx when true, simulate tx when false
  useVersionedTransaction: true,
  tokenAAmount: 0.01, // Swap 0.01 SOL for USDT in this example
  tokenAAddress: 'So11111111111111111111111111111111111111112', // Token to swap for the other, SOL in this case
  tokenBAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC address
  maxLamports: 1000000, // Max lamports allowed for fees
  direction: 'in' as 'in' | 'out', // Swap direction: 'in' or 'out'
  liquidityFile: 'https://api.raydium.io/v2/sdk/liquidity/mainnet.json',
  maxRetries: 10
};
```

Then run:

```sh
yarn swap
```
