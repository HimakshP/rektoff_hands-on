use anchor_lang::prelude::*;

declare_id!("oHFNy1n397F1JvQUaYeg7zPNYYnUMHZGQFohx4Zz7Eg");

#[program]
pub mod bugs_slowmist {
    use anchor_lang::prelude::entrypoint::ProgramResult;

    use super::*;
// paste snippet below ⇊⇊⇊⇊⇊
//_____________________________________________________________________________________________________________________

//missing signer 
    pub fn log_message(ctx: Context<LogMessage>) -> ProgramResult {
        msg!("Bob: {}", ctx.accounts.authority.key().to_string());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct LogMessage<'info> {
    /// CHECK: TESTING
    authority: AccountInfo<'info>
}

//_____________________________________________________________________________________________________________________
//paste snippets above ⇈⇈⇈⇈⇈