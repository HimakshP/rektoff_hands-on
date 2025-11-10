import * as anchor from "@coral-xyz/anchor";
import { getProvider, Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { BugsSlowmist } from "../target/types/bugs_slowmist";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";

describe("bugs-slowmist", async () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.bugsSlowmist as Program<BugsSlowmist>;
  const provider = anchor.getProvider();
  const Connection = provider.connection;

  let alice: Keypair;
  let bob: Keypair;

  let payer: Keypair;
  let mint: Token;
  let mintAuthority: Keypair;
  
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
    payer = Keypair.generate();
    mintAuthority = Keypair.generate();

    await provider.connection.requestAirdrop(alice.publicKey, 5 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(bob.publicKey, 5 * anchor.web3.LAMPORTS_PER_SOL);

    await provider.connection.requestAirdrop(payer.publicKey, 1_000_000_000);
    await provider.connection.requestAirdrop(mintAuthority.publicKey, 1_000_000_000);

    console.log("Alice is: {}",alice.publicKey);
    console.log("Bob is: {}",bob.publicKey);
     
    await new Promise(resolve => setTimeout(resolve, 1100));
  });



//missing signer poc
  //  it("bob can become authority", async () => {
//     //for alice
//     console.log("Alice messages as authority");
//     const alice_as_authority = await program.methods.logIt().accounts({authority: alice.publicKey}).rpc();

//     await showProgramLogs(alice_as_authority, "Alice messaged");

//    //for bob
//     console.log("Bob tries to be authority");
//     const bob_as_authority = await program.methods.logIt().accounts({authority: bob.publicKey}).rpc();
//     await showProgramLogs(bob_as_authority, "bob messaged as authority");

//   console.log("VULNERABILITY PROVEN: Bob successfully used Alice's pubkey without her signature!");
// });


//account owner uunspecified
// it("should pass when bob is the owner of alice's token", async () => {
//   //for alice 
//   mint = await Token.createMint(
//             Connection,
//             payer,
//             mintAuthority.publicKey,
//             null, // Freeze authority
//             9,    // Decimals
//             TOKEN_PROGRAM_ID
//         );
  
//   console.log("Alice logs her token account balance-");

//   const aliceTxn = await program.methods.logMessage().accounts({
//     token: await mint.createAccount(alice.publicKey), 
//     authority: alice.publicKey})
//     .signers([alice])
//     .rpc();

//   await showProgramLogs(aliceTxn,"Program log:Alice messaged");

//   console.log("Bob tries to own alice's coin");
//   const bobTxn = await program.methods.logMessage().accounts({
//     token: await mint.createAccount(bob.publicKey),          //bob is the owner 
//     authority: alice.publicKey})                             //alice is the authority
//     .signers([alice])
//     .rpc();     

//     await showProgramLogs(bobTxn,"Program log:Bob messaged");
// }


// )
});
