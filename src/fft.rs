use crate::complex::Complex;

pub struct FFT {
    power: usize,
    size: usize,
}

impl FFT {
    pub fn new() -> FFT {
        FFT { power: 0, size: 0 }
    }
    fn get_size(&mut self, data: &[Complex]) -> bool {
        self.size = data.len();
        let mut power = 0;
        while (1 << (power)) < self.size {
            power += 1;
        }
        self.power = power;
        (1 << (power)) == self.size
    }

    fn change(&self, data: &[Complex]) -> Vec<Complex> {
        (0..self.size)
            .map(|i| {
                let mut ri = 0;
                for j in 0..self.power {
                    if (i & (1 << (j))) != 0 {
                        ri |= 1 << (self.power - 1 - j);
                    }
                }
                data[ri]
            })
            .collect()
    }

    fn butterfly(&self, data: &[Complex], inv: bool) -> Vec<Complex> {
        let mut d = self.change(data);
        for i in 0..self.power {
            let h = 1 << (i);
            let h2 = h + h;
            let a = std::f64::consts::PI / (h as f64);
            let wn = Complex::new_rad(a * if inv { -1. } else { 1. });
            for j in (0..self.size).step_by(h2) {
                let mut w = Complex::new(1.0, 0.0);
                for k in j..j + h {
                    let a = d[k];
                    let b = d[k + h] * w;
                    d[k] = a + b;
                    d[k + h] = a - b;
                    w = w * wn;
                }
            }
        }
        if inv {
            for x in d.iter_mut() {
                *x = (*x) / (self.size as f64).into();
            }
        }
        d
    }

    pub fn ifft(&mut self, data: &[Complex]) -> Option<Vec<Complex>> {
        if self.get_size(data) {
            Some(self.butterfly(data, true))
        } else {
            None
        }
    }

    pub fn fft(&mut self, data: &[Complex]) -> Option<Vec<Complex>> {
        if self.get_size(data) {
            Some(self.butterfly(data, false))
        } else {
            None
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_fft() {
        let mut fft = FFT::new();
        let data: Vec<Complex> = (0..4).map(|i| Complex::new(i as f64, 0.)).collect();
        let q = fft.fft(&data).unwrap();
        for i in 0..4 {
            let a = (i as f64) * std::f64::consts::PI / 2.;
            let wn = Complex::new_rad(a);
            let mut w = Complex::new(1., 0.);
            let mut res = Complex::new(0., 0.);
            for j in 0..4 {
                res = res + w * data[j];
                w = w * wn;
            }
            assert!((res.x() - q[i].x()).abs() < 0.0001);
            assert!((res.y() - q[i].y()).abs() < 0.0001);
        }
    }

    #[test]
    fn test_fft_mul() {
        let mut fft = FFT::new();
        let mut data: Vec<Complex> = (0..4).map(|i| Complex::new(i as f64, 0.)).collect();
        for _ in 0..4 {
            data.push(Complex::new(0., 0.));
        }
        let mut q = fft.fft(&data).unwrap();
        for x in q.iter_mut() {
            *x = (*x) * (*x);
        }
        let q = fft.ifft(&q).unwrap();
        let delta = 0.0001;
        let mut mul_v = 3210 * 3210;
        let mut more = 0;
        for i in 0..8 {
            let mut x = q[i].x().round() as i32 + more;
            more = x / 10;
            x %= 10;
            assert_eq!(x, mul_v % 10);
            assert!(q[i].y().abs() < delta);
            mul_v /= 10;
            if more >= 10 {
                more = 1;
            }
        }
    }
}
