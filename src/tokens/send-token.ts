import { Transaction, SystemProgram, sendAndConfirmTransaction, PublicKey } from '@solana/web3.js';
import { conn, owner } from '../accounts/connection';
import { createTransferInstruction, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import axios from 'axios';
import { getKeypairByAddress } from '../accounts/utils';
import { getTokenBalance } from './utils';

export const sendTokens = async (addresses: string[], token: string) => {
  for (const address of addresses) {
    const tokenBalance = await getTokenBalance(address, token);
    const keypair = await getKeypairByAddress(address);

    let sourceAccount = await getOrCreateAssociatedTokenAccount(conn, keypair, new PublicKey(token), keypair.publicKey);

    let destinationAccount = await getOrCreateAssociatedTokenAccount(
      conn,
      keypair,
      new PublicKey(token),
      new PublicKey(owner.publicKey)
    );

    const transaction = new Transaction();

    transaction.add(
      createTransferInstruction(
        sourceAccount.address,
        destinationAccount.address,
        keypair.publicKey,
        Number(tokenBalance)
      )
    );

    const latestBlockHash = await conn.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = latestBlockHash.blockhash;

    transaction.partialSign(keypair);
    await sendAndConfirmTransaction(conn, transaction, [keypair]);
  }
  console.log('Tokens sent!');
};
