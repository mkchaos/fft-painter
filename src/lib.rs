// The wasm-pack uses wasm-bindgen to build and generate JavaScript binding file.
// Import the wasm-bindgen crate.
mod complex;
mod fft;
use complex::Complex;
use fft::FFT;
use wasm_bindgen::prelude::*;

// #[wasm_bindgen]
// extern "C" {
//     #[wasm_bindgen(js_namespace = console)]
//     fn log(s: &str);
// }

const WASM_MEMORY_BUFFER_SIZE: usize = 128;
static mut WASM_MEMORY_BUFFER: [f64; WASM_MEMORY_BUFFER_SIZE] = [0.; WASM_MEMORY_BUFFER_SIZE];

// Our Add function
// wasm-pack requires "exported" functions
// to include #[wasm_bindgen]
#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    return a + b;
}

#[wasm_bindgen]
pub fn get_wasm_memory_buffer_pointer() -> *const f64 {
    let pointer: *const f64;
    unsafe {
        pointer = WASM_MEMORY_BUFFER.as_ptr();
    }
    return pointer;
}

fn get_cs_from_buffer(sz: usize) -> Vec<Complex> {
    unsafe {
        (0..sz * 2)
            .step_by(2)
            .map(|i| Complex::new(WASM_MEMORY_BUFFER[i], WASM_MEMORY_BUFFER[i + 1]))
            .collect()
    }
}

fn put_cs_to_buffer(cs: &[Complex]) {
    for i in 0..cs.len() {
        unsafe {
            WASM_MEMORY_BUFFER[2 * i] = cs[i].x();
            WASM_MEMORY_BUFFER[2 * i + 1] = cs[i].y();
        }
    }
}

#[wasm_bindgen]
pub fn fft(sz: usize, inv: bool) -> bool {
    let mut f = FFT::new();
    let cs = get_cs_from_buffer(sz);
    if let Some(d) = if inv { f.fft(&cs) } else { f.ifft(&cs) } {
        put_cs_to_buffer(&d);
        true
    } else {
        false
    }
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
