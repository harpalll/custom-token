import {
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  ExtensionType,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  pack,
  type TokenMetadata,
} from "@solana/spl-token-metadata";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

const mint = new PublicKey("45YfWX12T1fkZMkDLEZZksiPoBSfofmBcXeKH6yB74wC");

// const tokenMetadata: TokenMetadata = {
//   mint,
//   name: "Penguin Token",
//   symbol: "PENG",
//   uri: "https://res.cloudinary.com/dlx4wfuyh/raw/upload/v1771868671/metadata_mqeotz.json",
//   additionalMetadata: [
//     ["project", "Penguin Ecosystem"],
//     ["website", "https://penguintoken.xyz"],
//     ["type", "utility"],
//     ["standard", "token-2022"],
//   ],
// };

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const payer = Keypair.fromSecretKey(
  Uint8Array.from([
    168, 229, 137, 253, 76, 44, 44, 85, 197, 140, 95, 212, 47, 136, 168, 20,
    212, 177, 158, 167, 132, 149, 161, 251, 153, 27, 205, 39, 209, 154, 235, 85,
    168, 88, 102, 139, 246, 223, 99, 62, 114, 213, 213, 184, 148, 110, 99, 110,
    248, 241, 124, 103, 106, 188, 223, 136, 250, 15, 220, 20, 220, 113, 202,
    130,
  ]),
);

export const createTokenWithMetadata = async (payer: Keypair) => {
  const mintKeypair = Keypair.generate();
  const decimals = 6;
  const metaData: TokenMetadata = {
    updateAuthority: payer.publicKey,
    mint: mintKeypair.publicKey,
    name: "Penguin Token",
    symbol: "PENG",
    uri: "https://res.cloudinary.com/dlx4wfuyh/raw/upload/v1771869527/metadata_t8khqi.json",
    additionalMetadata: [
      ["project", "Penguin Ecosystem"],
      ["website", "https://penguintoken.xyz"],
      ["type", "utility"],
      ["standard", "token-2022"],
    ],
  };

  const mintLen = getMintLen([ExtensionType.MetadataPointer]);
  const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metaData).length;
  const lamports = await connection.getMinimumBalanceForRentExemption(
    mintLen + metadataLen,
  );
  const balance = await connection.getBalance(payer.publicKey);

  const tx = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      lamports: lamports,
      programId: TOKEN_2022_PROGRAM_ID,
      space: mintLen,
    }),
    createInitializeMetadataPointerInstruction(
      mintKeypair.publicKey,
      payer.publicKey,
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      decimals,
      payer.publicKey,
      null,
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      mint: mintKeypair.publicKey,
      metadata: mintKeypair.publicKey,
      name: metaData.name,
      symbol: metaData.symbol,
      uri: metaData.uri,
      mintAuthority: payer.publicKey,
      updateAuthority: payer.publicKey,
    }),
  );

  const sig = await sendAndConfirmTransaction(connection, tx, [
    payer,
    mintKeypair,
  ]);
  return sig;
};

const main = async () => {
  const newTokenWithMetaData = await createTokenWithMetadata(payer);
  console.log(`New Token: ${newTokenWithMetaData}`);
};

main();
