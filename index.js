import {
  Connection,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

// TODO: add github authentication to make this work
const airDrop = async (publicKey, amount) => {
  const airDropSignature = await connection.requestAirdrop(
    new PublicKey(publicKey),
    amount,
  );
  connection.confirmTransaction({ signature: airDropSignature });
};

airDrop("CL9gAAiFQJ5WZZDWN82wGegVCi2WzQHpeHLebt5gGNss", LAMPORTS_PER_SOL).then(
  (signature) => console.log("airdrop signature:", signature),
);
