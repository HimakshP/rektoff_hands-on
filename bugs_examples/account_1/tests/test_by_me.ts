//imports
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Account1 } from "../target/types/account_1";
import { Keypair, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";

describe("account_1", ()=> {

    // describe block used to isolate tests 
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const program = anchor.workspace.account_1 as Program<Account1>;


    // Helper function to display program logs
    const showProgramLogs = async (txSig: string, description: string) => {
    console.log(`\n--- Program Logs for ${description} ---`);
    try {
      const tx = await provider.connection.getTransaction(txSig, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
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

  let alice: Keypair;
  let bob: Keypair;
  let aliceProfileAccount: Keypair;


   beforeEach(async () => {

    //before each block to conduct these things before every test 
      alice = Keypair.generate();
      bob = Keypair.generate();
      aliceProfileAccount = Keypair.generate();
  
      await provider.connection.requestAirdrop(alice.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
      await provider.connection.requestAirdrop(bob.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      const space = 8 + 32 + 64 + 8 + 8 + 1;
      const createAccountTx = new anchor.web3.Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: alice.publicKey,
          newAccountPubkey: aliceProfileAccount.publicKey,
          space: space,
          lamports: await provider.connection.getMinimumBalanceForRentExemption(space),
          programId: program.programId,
        })
      );
  
      await provider.sendAndConfirm(createAccountTx, [alice, aliceProfileAccount]);
    });


    it("should initialise an account"), async () => {

        // initialise alice account for which we need alice's username and keypair
        // which will be the signer of the init user  profile 
        const init_alice = await program.methods.initializeUserProfile("ItsAlice").accounts({
            userProfile: aliceProfileAccount.publicKey,
            authority: alice.publicKey
        }).signers([alice]).rpc();

       await showProgramLogs(init_alice, "Profile Initialization");
    };

    // initialise bob's user profile using alice's username but bob being the signer 
    


    //list an nft where price, nft mint is provided by user
    //and profile is alice's profile and authority being alice 
    
})