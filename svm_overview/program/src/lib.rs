use std::mem::transmute;

use solana_program::{
    account_info::AccountInfo,
    entrypoint::{entrypoint, ProgramResult},
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

// Declare the program's entry point
entrypoint!(process_instruction);

// Should be in read only static memory
static IN_RO: u8 = 0;

// Program entry point's implementation
pub fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Log a message to the Solana runtime
    if instruction_data.is_empty() {
        msg!("Hello, world!");
        msg!("This is a simple logging program for learning.");
        msg!("Program executed successfully!");
        return Ok(());
    }

pub fn using_transmute() -> ProgramResult{
    let raw_bytes = [0x78, 0x56, 0x34, 0x12];
    msg!("raw bytes were: 0x78, 0x56, 0x34, 0x12");

    let num: u32 = unsafe {
    std::mem::transmute::<[u8; 4], u32>(raw_bytes)
    };

    msg!("number is {}, its hex is {:x}", num, num);
/// this function is used to transfer the raw values of any data into another handle,
/// provided that the size of both the source and destination data type is same.
/// this is already checked in safe rust but in unsafe the developer should mannually
/// verify this.
    
    Ok(())
}

    match instruction_data[0] {
        0 => log_memory_regions(instruction_data),
        1 => attempt_uaf(),
        2 => attempt_buffer_overflow(),
        3 => using_transmute(),
        _ => Err(ProgramError::InvalidInstructionData),
    }
}

fn log_memory_regions(instruction_data: &[u8]) -> ProgramResult {
    // Vec is good because it has stack and heap components
    let vec = vec![0x11, 0x22, 0x33];

    // Args should be in Input data 0x400000000
    msg!("instr args   = {:p}", instruction_data);

    // Vec data should be on heap in 0x300000000
    msg!("vec heap     = {:p}", &vec[0]);

    // Vec struct should be on stack in 0x200000000
    msg!("vec stack    = {:p}", &vec);

    // Static var should be in 0x100000000
    msg!("IN_RO static = {:p}", &IN_RO);

    // Instructions should be in the text segment at 0x000000000
    msg!(
        "process_instruction address: {:p}",
        process_instruction as *const ()
    );
    msg!(
        "log_memory_regions address: {:p}",
        log_memory_regions as *const ()
    );

    Ok(())
}

fn attempt_uaf() -> ProgramResult {
    msg!("Attempting UAF");

    let x = Box::new(5);
    msg!{"Value before free:  with pointer at {:p}", &x};
    let raw_x = Box::into_raw(x);

    unsafe {
        drop(Box::from_raw(raw_x));
        msg!("Value after free: with pointer at {:p}",  &raw_x);
    }

    Ok(())
}

fn attempt_buffer_overflow() -> ProgramResult {
    let mut buffer = [0u8; 5];
    let not_in_buffer = 56789;

    unsafe {
        let ptr = buffer.as_mut_ptr();

        for i in 0..6 {
            *ptr.add(i) = i as u8;
            msg!("writing {} at:          {:p}", i, ptr.add(i));
        }
    }

    msg!("");
    msg!("buffer address:        {:p}", &buffer);
    msg!("not_in_buffer address: {:p}", &not_in_buffer);

    msg!("buffer: {:?}", buffer);
    msg!("not_in_buffer: {}", not_in_buffer);

    Ok(())
}
