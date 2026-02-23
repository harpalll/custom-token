import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
  transfer,
  updateTransferHook,
} from "@solana/spl-token";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const payer = Keypair.fromSecretKey(
  Uint8Array.from([
    168, 229, 137, 253, 76, 44, 44, 85, 197, 140, 95, 212, 47, 136, 168, 20,
    212, 177, 158, 167, 132, 149, 161, 251, 153, 27, 205, 39, 209, 154, 235, 85,
    168, 88, 102, 139, 246, 223, 99, 62, 114, 213, 213, 184, 148, 110, 99, 110,
    248, 241, 124, 103, 106, 188, 223, 136, 250, 15, 220, 20, 220, 113, 202,
    130,
  ]),
);
const recipient = new PublicKey("5vxQg3YE9fxRdbfBC3PhxATZApiLJpFP8G4GjGdb2n6J");
const mint = new PublicKey("45YfWX12T1fkZMkDLEZZksiPoBSfofmBcXeKH6yB74wC");

const sourceATA = await getOrCreateAssociatedTokenAccount(
  connection,
  payer,
  mint,
  payer.publicKey,
);
const destinationATA = await getOrCreateAssociatedTokenAccount(
  connection,
  payer,
  mint,
  recipient,
);

const transferToken = async (
  sourceATAAddress,
  destinationATAAddress,
  amountToBeTransfered,
) => {
  const tx = await transfer(
    connection,
    payer,
    sourceATAAddress,
    destinationATAAddress,
    payer.publicKey,
    amountToBeTransfered * Math.pow(10, 9),
  );
  console.log(`tx created at signature: `, tx);
  return tx;
};

const main = async () => {
  const tx = await transferToken(sourceATA.address, destinationATA.address, 10);
};

main();
