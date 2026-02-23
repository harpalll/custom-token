import {
  createMint,
  TOKEN_PROGRAM_ID,
  updateTransferHook,
} from "@solana/spl-token";
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";

const payer = Keypair.fromSecretKey(
  Uint8Array.from([
    168, 229, 137, 253, 76, 44, 44, 85, 197, 140, 95, 212, 47, 136, 168, 20,
    212, 177, 158, 167, 132, 149, 161, 251, 153, 27, 205, 39, 209, 154, 235, 85,
    168, 88, 102, 139, 246, 223, 99, 62, 114, 213, 213, 184, 148, 110, 99, 110,
    248, 241, 124, 103, 106, 188, 223, 136, 250, 15, 220, 20, 220, 113, 202,
    130,
  ]),
);
const mintAuthority = payer;

const connection = new Connection(clusterApiUrl("devnet"));

const createMintForToken = async (payer, mintAuthority) => {
  const mint = await createMint(
    connection,
    payer,
    mintAuthority,
    null,
    6,
    undefined,
    undefined,
    TOKEN_PROGRAM_ID,
  );
  console.log(`mint created at: `, mint.toBase58());
  return mint;
};

const main = async () => {
  const mint = await createMintForToken(payer, mintAuthority.publicKey);
};

main();
