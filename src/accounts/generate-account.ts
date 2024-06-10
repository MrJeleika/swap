import { Config, JsonDB } from 'node-json-db';
import { Keypair } from '@solana/web3.js';
import base58 from 'bs58';

export const generateAccount = async () => {
  const keypair = Keypair.generate();
  const pk = base58.encode(keypair.secretKey);

  const db = new JsonDB(new Config('accounts', true, false, '/'));

  await db.push(`/accounts[]`, { pk, address: keypair.publicKey.toString() });
};
