import { Config, JsonDB } from 'node-json-db';
import { Keypair } from '@solana/web3.js';
import base58 from 'bs58';

export interface IStat {
  pk: `0x${string}`;
  address: `0x${string}`;
}

export const getAllAddresses = async () => {
  const db = new JsonDB(new Config('accounts', true, false, '/'));
  const data = await db.getData('/accounts');
  const addresses: `0x${string}`[] = data.map(({ address }: { address: `0x${string}` }) => address);
  return addresses;
};

export const getAccountByAddresses = async (addresses: `0x${string}`[]) => {
  const db = new JsonDB(new Config('accounts', true, false, '/'));
  const data: IStat[] = await db.getData('/accounts');
  const accounts = data
    .filter((item: IStat) => addresses.includes(item.address))
    .map((item: IStat) => {
      // Convert the hexadecimal private key string back into a Uint8Array
      const secretKey = new Uint8Array(Buffer.from(item.pk, 'hex'));
      // Create a new Keypair from the secret key
      const keypair = Keypair.fromSecretKey(secretKey);
      // Return the account information
      return {
        address: item.address,
        keypair
      };
    });

  return accounts;
};

export const getKeypairByAddress = async (address: string) => {
  const db = new JsonDB(new Config('accounts', true, false, '/'));
  const data: IStat[] = await db.getData('/accounts');
  const account = data.find((item: IStat) => item.address === address)!;
  
  return Keypair.fromSecretKey(base58.decode(account.pk));
};
