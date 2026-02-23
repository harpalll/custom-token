import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";

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
const mint = new PublicKey("45YfWX12T1fkZMkDLEZZksiPoBSfofmBcXeKH6yB74wC");

const tokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  payer,
  mint,
  payer.publicKey,
);

const mintToken = async (amount) => {
  try {
    const mintTx = await mintTo(
      connection,
      payer,
      mint,
      tokenAccount.address,
      payer,
      amount * Math.pow(10, 9),
    );
    return mintTx;
  } catch (error) {
    console.log(error);
  }
};

const main = async () => {
  const mintTx = await mintToken(100);
  console.log(mintTx);
};

main();
