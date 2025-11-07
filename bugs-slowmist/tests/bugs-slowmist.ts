import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { BugsSlowmist } from "../target/types/bugs_slowmist";

describe("bugs-slowmist", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.bugsSlowmist as Program<BugsSlowmist>;
  
  let alice: Keypair;
  let bob: Keypair;

  const showProgramLogs =

  it("should print bob", async () => {
    // Add your test here.

    const tx = await program.methods.logMessage().rpc();
    console.log("Your transaction signature", tx);
  });
});
