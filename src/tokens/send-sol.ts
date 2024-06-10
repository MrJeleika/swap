import { Transaction, SystemProgram, sendAndConfirmTransaction, PublicKey } from '@solana/web3.js';
import { conn, owner } from '../accounts/connection';

export const sendSol = async (recipients: string[], amount: number) => {
  const amountInSol = amount * 1e9;
  const transaction = new Transaction();

  recipients.forEach((address) => {
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: owner.publicKey,
        toPubkey: new PublicKey(address),
        lamports: amountInSol
      })
    );
  });
  const latestBlockHash = await conn.getLatestBlockhash('confirmed');
  transaction.feePayer = owner.publicKey;
  transaction.recentBlockhash = latestBlockHash.blockhash;

  transaction.partialSign(owner);
  const signature = await sendAndConfirmTransaction(conn, transaction, [owner]);
  console.log('Sol sent, signature:', signature);
};
