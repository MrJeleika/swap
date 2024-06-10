import { Connection, Keypair } from '@solana/web3.js';
import base58 from 'bs58';
import dotenv from 'dotenv';

dotenv.config();

export const conn = new Connection(process.env.RPC_URL);
export const owner = Keypair.fromSecretKey(base58.decode(`${process.env.WALLET_PRIVATE_KEY}`));
