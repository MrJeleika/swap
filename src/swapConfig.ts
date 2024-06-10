export const swapConfig = {
  executeSwap: true, // Send tx when true, simulate tx when false
  useVersionedTransaction: true,
  tokenAAmount: 0.00001, // Swap 0.01 SOL for USDT in this example
  tokenAAddress: 'So11111111111111111111111111111111111111112', // Token to swap for the other, SOL in this case
  tokenBAddress: '2RVAVAjoFCfhWuaUoojzcm8gnJTfbPCXdvkZB3pc2Vai', // USDC address
  maxLamports: 150000, // Micro lamports for priority fee
  direction: 'in' as 'in' | 'out', // Swap direction: 'in' or 'out'
  liquidityFile: 'https://api.raydium.io/v2/sdk/liquidity/mainnet.json',
  maxRetries: 20
};

export const getSwapConfig = (token: string, direction: 'in' | 'out') => {
  return {
    executeSwap: true, // Send tx when true, simulate tx when false
    useVersionedTransaction: true,
    tokenAAmount: 0.0001, // Swap 0.01 SOL for USDT in this example
    tokenAAddress: 'So11111111111111111111111111111111111111112', // Token to swap for the other, SOL in this case
    tokenBAddress: token, // USDC address
    maxLamports: 0.000021 * 1e9, // Micro lamports for priority fee
    direction, // Swap direction: 'in' or 'out'
    liquidityFile: 'https://api.raydium.io/v2/sdk/liquidity/mainnet.json',
    maxRetries: 20
  };
};
