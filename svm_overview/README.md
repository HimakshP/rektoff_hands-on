# Solana Logger Program

## Start a Local Validator
Do this in a different terminal
```bash
solana-test-validator --reset
```

## Configure Solana CLI for Localhost
Need to connect to local validator not mainnet or devnet etc.
```bash
solana config set --url http://localhost:8899
solana config get # to confirm
```

## Start Log Stream
Do this in a different terminal again
```bash
solana logs
```

## Build Smart Contract
Creates `solana_logger_program.so` in `target/deploy/`
```bash
cd program
cargo-build-sbf
# or specify version
cargo-build-sbf --arch v3
```

## Check Program Size
Will need this if you are redeploying to make sure you have enough space in your account
```bash
ls -la target/deploy/solana_logger_program.so
```

## Deploy Smart Contract
Will return the address your smart contract is at
```bash
solana program deploy target/deploy/solana_logger_program.so
```

## Check On-Chain Program Size
Shoes details of the program (like data length)
```bash
solana program show <PROGRAM_PUBKEY>
```

## Dump Program from Chain
In case you want to analyse a program from the chain
```bash
solana program dump <PROGRAM_PUBKEY> dumped_program.so
```

## Increase Program Account Size
To resize the program so it can fit a larger program
```bash
solana program extend <PROGRAM_PUBKEY> <BYTES_TO_ADD>
```

## Redeploy Smart Contract
Writing the buffer will give a pubkey that to that buffer, you then move from buffer to account
```bash
cd program
cargo-build-sbf
solana program write-buffer target/deploy/solana_logger_program.so
solana program upgrade <BUFFER_PUBKEY> <PROGRAM_PUBKEY>
```

## Invoke Smart Contract
Inside `client/src/main.rs` there is the logic to form the Instructions and Transaction and submit it
```bash
cd client
cargo run
```

## Disassemble Smart Contract Binary
Lifts the binary into sBPF bytecode instructions
```bash
agave-ledger-tool program disassemble target/deploy/solana_logger_program.so
```