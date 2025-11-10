use anchor_lang::prelude::*;
use spl_token::state::Account as SplTokenAccount;
use spl_token::solana_program::program_pack::Pack;


declare_id!("oHFNy1n397F1JvQUaYeg7zPNYYnUMHZGQFohx4Zz7Eg");

#[program]
pub mod bugs_slowmist {
    
    use anchor_lang::prelude::entrypoint::ProgramResult;

    use super::*;
// paste snippet below ⇊⇊⇊⇊⇊
//_____________________________________________________________________________________________________________________

//missing signer 
//     pub fn log_it(ctx: Context<LogIt>) -> ProgramResult {
//         msg!("authority- Bob: {}", ctx.accounts.authority.key().to_string());
//         Ok(())
//     }
// #[derive(Accounts)]
// pub struct LogIt<'info> {
//     /// CHECK: TESTING
//     authority: AccountInfo<'info>
// }
// }


//account data matching
pub fn log_message(ctx: Context<LogMessage>) -> ProgramResult {
        let token = SplTokenAccount::unpack(&ctx.accounts.token.data.borrow())?;
        if ctx.accounts.authority.key != &token.owner {
            return Err(ProgramError::InvalidAccountData);
        }
        msg!("Your account owner is: {}", token.owner);
        Ok(())
    }

#[derive(Accounts)]
pub struct LogMessage<'info> {
    /// CHECK: TESTING
    token: AccountInfo<'info>,
    authority: Signer<'info>,
}}
//_____________________________________________________________________________________________________________________
//paste snippets above ⇈⇈⇈⇈⇈