import Enquirer from 'enquirer';
import { getAllAddresses } from './utils';

type SelectAccount = 'All' | 'Select manually';

export const selectAccount = async () => {
  const variant: { variant: SelectAccount } = await Enquirer.prompt({
    type: 'select',
    name: 'variant',
    message: 'Choose accounts',
    choices: ['All', 'Select manually'] as SelectAccount[]
  });

  const selectedVariant = variant.variant;

  if (selectedVariant === 'All') {
    return await getAllAddresses();
  }

  const res: { accounts: `0x${string}`[] } = await Enquirer.prompt({
    type: 'multiselect',
    name: 'accounts',
    message: 'Select accounts using SPACE',
    choices: await getAllAddresses()
  });
  const action = res.accounts;

  return action;
};
