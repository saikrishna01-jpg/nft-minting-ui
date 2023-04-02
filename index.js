import { readFileSync } from 'fs';

import { 
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey
} from "@solana/web3.js";

import { 
  createMint,
  mintTo,
  transfer,
  getOrCreateAssociatedTokenAccount
} from "@solana/spl-token"

import bs58 from 'bs58';


(async () => {

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const wallet = JSON.parse(
    readFileSync("C:/Users/saikr/.config/solana/id.json","utf-8")
  )

  const from = Keypair.fromSecretKey(Uint8Array.from(wallet));
  const to = new PublicKey(
    "GRikC3n6gSXxdwXXf6eNBqTtRtipSYrdNrKezti9iTZt"
  )

  const fromAirdropSignature = await connection.requestAirdrop(
    from.publicKey,
    LAMPORTS_PER_SOL
  )

  await connection.confirmTransaction(fromAirdropSignature, "confirmed")


  const tokenMintAccount = await createMint(
    connection,
    from,
    from.publicKey,
    null,
    9
  );


  const fromTokenAcc = await getOrCreateAssociatedTokenAccount(
    connection,
    from,
    tokenMintAccount,
    from.publicKey
  )
  
  console.log("Newly minted token: ", tokenMintAccount.toBase58());

  let signature = await mintTo(
    connection,
    from,
    tokenMintAccount,
    fromTokenAcc.address,
    from.publicKey,
    100000000000,
    []
  )
  console.log("Mint tx: ", signature);

  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    from,
    tokenMintAccount,
    to
  )

  signature = await transfer(
    connection,
    from,
    fromTokenAcc.address,
    toTokenAccount.address,
    from.publicKey,
    100000000000,
    []
  )
  console.log("Transfer tx: ", signature);
})();