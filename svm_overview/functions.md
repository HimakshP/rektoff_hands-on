Following are the functions ive used in this repo:


/// this function is used to transfer the raw values of any data into another handle,
/// provided that the size of both the source and destination data type is same.
/// this is already checked in safe rust but in unsafe the developer should mannually
/// verify this.

1> fn using_transmute() -> ProgramResult

this function logs the memory regions of the values stored on the stack, heap, static memory and text/code segmemt

2>fn log_memory_regions(instruction_data: &[u8]) -> ProgramResult

this funtion demonstrates use after free undefined behaviour on solana localnet

3>fn attempt_uaf() -> ProgramResult 

this funtion demonstrates buffer overflow undefined behaviour on solana localnet

4>fn attempt_buffer_overflow() -> ProgramResult

data races are not possible on solana as the sbf restricts concurrency.