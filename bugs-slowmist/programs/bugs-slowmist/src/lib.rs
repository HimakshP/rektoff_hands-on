use anchor_lang::prelude::*;
use spl_token::state::Account as SplTokenAccount;
use spl_token::solana_program::program_pack::Pack;


declare_id!("oHFNy1n397F1JvQUaYeg7zPNYYnUMHZGQFohx4Zz7Eg");

#[program]
pub mod bugs_slowmist {
    
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
pub fn log_message(ctx: Context<LogMessage>) -> Result<()> {
        let data = ctx.accounts.token.try_borrow_data()?;
        let token = SplTokenAccount::unpack(&data);
        msg!("Your account balance is: {}", token.unwrap().amount);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct LogMessage<'info> {
    /// CHECK: TESTING
    token: AccountInfo<'info>,
    authority: Signer<'info>,
}
//_____________________________________________________________________________________________________________________
//paste snippets above ⇈⇈⇈⇈⇈