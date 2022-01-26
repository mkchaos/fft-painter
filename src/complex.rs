use std::convert::From;
use std::ops::{Add, Div, Mul, Sub};

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Complex(f64, f64);

impl Complex {
    pub fn new(x: f64, y: f64) -> Complex {
        Complex(x, y)
    }
    pub fn new_rad(rad: f64) -> Complex {
        Complex(rad.cos(), rad.sin())
    }
    pub fn length(&self) -> f64 {
        (self.0.powi(2) + self.1.powi(2)).sqrt()
    }
    pub fn unit(&self) -> Complex {
        let length = self.length();
        Complex(self.0 / length, self.1 / length)
    }
    pub fn x(&self) -> f64 {
        self.0
    }
    pub fn y(&self) -> f64 {
        self.1
    }
}

impl From<f64> for Complex {
    fn from(item: f64) -> Self {
        Complex(item, 0.)
    }
}

impl Add for Complex {
    type Output = Complex;
    fn add(self, other: Complex) -> Complex {
        Complex(self.0 + other.0, self.1 + other.1)
    }
}

impl Sub for Complex {
    type Output = Complex;
    fn sub(self, other: Complex) -> Complex {
        Complex(self.0 - other.0, self.1 - other.1)
    }
}

impl Mul for Complex {
    type Output = Complex;
    fn mul(self, other: Complex) -> Complex {
        Complex(
            self.0 * other.0 - self.1 * other.1,
            self.0 * other.1 + self.1 * other.0,
        )
    }
}

impl Div for Complex {
    type Output = Complex;
    fn div(self, other: Complex) -> Complex {
        let m = self * Complex::new(other.0, -other.1);
        let l2 = other.0.powi(2) + other.1.powi(2);
        Complex(m.0 / l2, m.1 / l2)
    }
}

#[cfg(test)]
mod tests {
    use super::Complex;
    #[test]
    fn test_complex_calc() {
        let a = Complex::new(1.0, 2.0);
        let b = Complex::new(3.0, 4.0);
        assert_eq!(a + b, Complex::new(4.0, 6.0));
        assert_eq!(a - b, Complex::new(-2.0, -2.0));
        assert_eq!(a * b, Complex::new(-5.0, 10.0));
        assert_eq!(a / b, Complex::new(0.44, 0.08));
        assert_eq!(a / b * b, a);
    }

    #[test]
    fn test_complex_impl() {
        let a = Complex::new(3.0, 4.0);
        assert_eq!(a.length(), 5.0);
        assert_eq!(a.unit(), Complex::new(0.6, 0.8));
        assert_eq!(a.x(), 3.0);
        assert_eq!(a.y(), 4.0);
        let b = Complex::new_rad(1.1);
        let c = Complex::new_rad(-1.1);
        assert_eq!(b * c, Complex::new(1., 0.));
        let d = Complex::new_rad(std::f64::consts::PI);
        assert!((d.x() - -1.0).abs() < 0.0001);
        assert!(d.y().abs() < 0.0001);
    }
}
