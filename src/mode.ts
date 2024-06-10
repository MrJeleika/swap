import Enquirer from 'enquirer';
import { selectAccountMode } from './accounts';
import 'dotenv/config';
import { sendTokens } from './tokens/send-token';
import { selectAccount } from './accounts/select-account';
import { getKeypairByAddress } from './accounts/utils';
import RaydiumSwap from './RaydiumSwap';
import { getSwapConfig } from './swapConfig';
import { VersionedTransaction, Transaction } from '@solana/web3.js';
import { getTokenBalance } from './tokens/utils';
import { conn } from './accounts/connection';
import base58 from 'bs58';
import { sleep } from './utils';

type Module = 'Accounts' | 'Swap';

export const selectMode = async () => {
  const { module }: { module: Module } = await Enquirer.prompt({
    type: 'select',
    name: 'module',
    message: 'Select module',
    choices: ['Accounts', 'Swap'] as Module[]
  });
  switch (module) {
    case 'Accounts':
      await selectAccountMode();
      break;

    case 'Swap':
      const addresses = await selectAccount();

      const { token }: { token: string } = await Enquirer.prompt({
        type: 'text',
        name: 'token',
        message: 'Enter token address'
      });

      const { iterations }: { iterations: number } = await Enquirer.prompt({
        type: 'numeral',
        name: 'iterations',
        message: 'Enter the number of iterations',
        min: 1
      });

      const swapConfigIn = getSwapConfig(token, 'in');

      const swapConfigOut = getSwapConfig(token, 'out');

      for (const address of addresses) {
        for (let i = 0; i < iterations; i++) {
          const keypair = await getKeypairByAddress(address);

          const privateKey = base58.encode(keypair.secretKey);

          const raydiumSwap = new RaydiumSwap(process.env.RPC_URL, privateKey);

          await raydiumSwap.loadPoolKeys(swapConfigIn.liquidityFile);

          const poolInfo = raydiumSwap.findPoolInfoForTokens(swapConfigIn.tokenAAddress, swapConfigIn.tokenBAddress);

          if (!poolInfo) {
            console.error('Pool info not found');
          } else {
            const tx = await raydiumSwap.getSwapTransaction(
              swapConfigIn.tokenBAddress,
              swapConfigIn.tokenAAmount,
              poolInfo,
              swapConfigIn.maxLamports,
              swapConfigIn.useVersionedTransaction,
              swapConfigIn.direction
            );

            try {
              console.log('Created in transaction');

              const txidIn = swapConfigIn.useVersionedTransaction
                ? await raydiumSwap.sendVersionedTransaction(tx as VersionedTransaction, swapConfigIn.maxRetries)
                : await raydiumSwap.sendLegacyTransaction(tx as Transaction, swapConfigIn.maxRetries);

              const latestBlockHash = await conn.getLatestBlockhash();
              console.log('Waiting in tx confirmation');
              await sleep(2000);
              await conn.confirmTransaction({
                blockhash: latestBlockHash.blockhash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                signature: txidIn
              });

              console.log(`https://solscan.io/tx/${txidIn}`);
            } catch (error) {
              console.log('Transaction not confirmed in 60 sec, hope it will be confirmed soon');
            }

            console.log('Waiting for update balance after swap');

            await sleep(5000);

            const tokenBalance = await getTokenBalance(address, token);
            console.log(`Token Balance: ${tokenBalance}`);

            const txOut = await raydiumSwap.getSwapTransaction(
              swapConfigIn.tokenAAddress,
              Number(tokenBalance.toString()),
              poolInfo,
              swapConfigIn.maxLamports,
              swapConfigIn.useVersionedTransaction,
              swapConfigOut.direction
            );

            try {
              console.log('Created out transaction');

              const txidOut = swapConfigIn.useVersionedTransaction
                ? await raydiumSwap.sendVersionedTransaction(txOut as VersionedTransaction, swapConfigIn.maxRetries)
                : await raydiumSwap.sendLegacyTransaction(txOut as Transaction, swapConfigIn.maxRetries);

              const latestBlockHash = await conn.getLatestBlockhash();
              console.log('Waiting out tx confirmation');
              await sleep(2000);

              await conn.confirmTransaction({
                blockhash: latestBlockHash.blockhash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                signature: txidOut
              });

              console.log(`https://solscan.io/tx/${txidOut}`);
            } catch (error) {
              console.log('Transaction not confirmed in 60 sec, hope it will be confirmed soon');
            }
          }
        }
      }

      break;
  }
};

selectMode();
