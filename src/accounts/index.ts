import Enquirer from 'enquirer';
import { generateAccount } from './generate-account';
import { selectMode } from '../mode';
import { selectAccount } from './select-account';
import { sendSol } from '../tokens/send-sol';
import { sendTokens } from '../tokens/send-token';

type Module = 'Generate accounts' | 'Send sol to accounts' | 'Claim tokens' | 'Back';

export const selectAccountMode = async () => {
  while (true) {
    const { module }: { module: Module } = await Enquirer.prompt({
      type: 'select',
      name: 'module',
      message: 'Select module',
      choices: ['Generate accounts', 'Claim tokens', 'Send sol to accounts', 'Back'] as Module[]
    });

    switch (module) {
      case 'Generate accounts':
        const { accountsNum }: { accountsNum: number } = await Enquirer.prompt({
          type: 'numeral',
          name: 'accountsNum',
          message: 'Enter the number of accounts to generate',
          min: 1
        });

        for (let i = 0; i < accountsNum; i++) {
          await generateAccount();
        }

        console.log(accountsNum + ' accounts generated');
        break;
      case 'Send sol to accounts':
        const { solAmount }: { solAmount: number } = await Enquirer.prompt({
          type: 'numeral',
          name: 'solAmount',
          message: 'Enter the amount of SOL to send'
        });

        const accounts = await selectAccount();
        await sendSol(accounts, solAmount);
        break;
      case 'Claim tokens':
        const claimAccounts = await selectAccount();
        const { token }: { token: string } = await Enquirer.prompt({
          type: 'text',
          name: 'token',
          message: 'Enter token address'
        });

        await sendTokens(claimAccounts, token);
        break;

      case 'Back':
        await selectMode();
        break;
    }
  }
};
