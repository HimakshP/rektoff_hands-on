use anyhow::Result;
use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    instruction::Instruction,
    message::Message,
    pubkey::Pubkey,
    signature::{EncodableKey, Keypair, Signer},
    transaction::Transaction,
};
use solana_transaction_status::{option_serializer::OptionSerializer, UiTransactionEncoding};
use std::str::FromStr;

// Only know this after deploying, replace with read data
const PROGRAM_PUBKEY: &str = "2bUCYxCrr6Q2dWuz4BjN78SJg4DDUeENUhC1Ub51VC86";

fn main() -> Result<()> {
    // Connect to local validator
    let rpc_url = "http://localhost:8899";
    let client = RpcClient::new(rpc_url.to_string());

    let program_id = Pubkey::from_str(PROGRAM_PUBKEY)?;

    // Load keypair - best to use absolute path e.g. /home/<USER>/.config/solana/id.json
    let keypair_path = "/home/himax/.config/solana/id.json";
    let client_keypair = Keypair::read_from_file(keypair_path)
        .map_err(|e| anyhow::anyhow!("Failed to read keypair: {}", e))?;

    // Transactions require a recent blockhash
    let recent_blockhash = client.get_latest_blockhash()?;

    // Create instruction to invoke the program
    let instruction = Instruction {
        program_id,
        accounts: vec![],
        data: vec![3],
    };

    // Create message and transaction
    let message = Message::new(&[instruction], Some(&client_keypair.pubkey()));
    let mut transaction = Transaction::new_unsigned(message);
    transaction.sign(&[&client_keypair], recent_blockhash);

    println!("Invoking program: {}", program_id);

    // Send the transaction
    let signature = client.send_and_confirm_transaction(&transaction)?;

    println!("Transaction succeeded! Signature: {}", signature);

    // Unpack and print the logs
    let tx_info = client.get_transaction(&signature, UiTransactionEncoding::Json)?;
    if let Some(meta) = tx_info.transaction.meta {
        if let OptionSerializer::Some(logs) = meta.log_messages {
            println!("Logs from {}:", signature);
            for log in logs {
                println!("  {}", log);
            }
        } else {
            println!("No logs");
        }
    }

    Ok(())
}
