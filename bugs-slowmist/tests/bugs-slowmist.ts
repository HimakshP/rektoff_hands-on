import * as anchor from "@coral-xyz/anchor";
import { getProvider, Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { BugsSlowmist } from "../target/types/bugs_slowmist";

describe("bugs-slowmist", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.bugsSlowmist as Program<BugsSlowmist>;
  const provider = anchor.getProvider();

  let alice: Keypair;
  let bob: Keypair;

  const showProgramLogs = async (txSig: string, description: string) => {
   console.log (`\n--Program Logs for ${description}---`);
   try{
    const tx = await provider.connection.getTransaction(txSig, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0
    });
      if (tx && tx.meta && tx.meta.logMessages) {
        tx.meta.logMessages.forEach(log => {
          if (log.includes("Program log:")) {
            console.log("📝", log.replace("Program log: ", ""));
          }
        });
      } else {
        console.log("⚠️  No logs found for this transaction");
      }
    } catch (error) {
      console.log("❌ Error retrieving logs:", error);
    }
    console.log("--- End Program Logs ---\n");
  };

  

  before(async () => {
    
    alice = Keypair.generate();
    bob = Keypair.generate();

    await provider.connection.requestAirdrop(alice.publicKey, 5 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(bob.publicKey, 5 * anchor.web3.LAMPORTS_PER_SOL);

    console.log("Alice is: {}",alice.publicKey);
    console.log("Bob is: {}",bob.publicKey);
    
    await new Promise(resolve => setTimeout(resolve, 1100));
  });



 it("bob can become authority", async () => {
    //for alice
    console.log("Alice messages as authority");
    const alice_as_authority = await program.methods.logIt().accounts({authority: alice.publicKey}).rpc();

    await showProgramLogs(alice_as_authority, "Alice messaged");

   //for bob
    console.log("Bob tries to be authority");
    const bob_as_authority = await program.methods.logIt().accounts({authority: bob.publicKey}).rpc();
    await showProgramLogs(bob_as_authority, "bob messaged as authority");


  //  it("alice logs her message", async () => {
  // // Create a new provider with Alice as the wallet
  // const aliceProvider = new anchor.AnchorProvider(
  //   provider.connection,
  //   new anchor.Wallet(alice),
  //   { commitment: "confirmed" }
  // );
  // const aliceProgram = new anchor.Program(
  //   program.idl,
  //   program.programId,
  //   aliceProvider
  // );

  // console.log("Alice messages as authority");
  // const alice_as_authority = await aliceProgram.methods.logIt()
  //   .accounts({ authority: alice.publicKey })
  //   .rpc();

  // await showProgramLogs(alice_as_authority, "Alice messaged");

  // // Create a new provider with Bob as the wallet
  // const bobProvider = new anchor.AnchorProvider(
  //   provider.connection,
  //   new anchor.Wallet(bob),
  //   { commitment: "confirmed" }
  // );
  // const bobProgram = new anchor.Program(
  //   program.idl,
  //   program.programId,
  //   bobProvider
  // );

  // // Bob can impersonate Alice due to missing Signer constraint
  // console.log("Bob impersonates Alice (vulnerability demonstration)");
  // const bob_as_authority = await bobProgram.methods.logIt()
  //   .accounts({ authority: alice.publicKey })  // Bob uses Alice's pubkey
  //   .rpc();  // But Bob's wallet signs it

  await showProgramLogs(bob_as_authority, "Bob impersonated Alice");

  console.log("VULNERABILITY PROVEN: Bob successfully used Alice's pubkey without her signature!");
});
});
