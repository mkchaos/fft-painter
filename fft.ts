export class ComplexNumber {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(c: ComplexNumber | number) {
    if (typeof c == "number") {
      return new ComplexNumber(this.x + c, this.y);
    } else {
      return new ComplexNumber(this.x + c.x, this.y + c.y);
    }
  }

  sub(c: ComplexNumber | number) {
    if (typeof c == "number") {
      return new ComplexNumber(this.x - c, this.y);
    } else {
      return new ComplexNumber(this.x - c.x, this.y - c.y);
    }
  }

  mul(c: ComplexNumber | number) {
    if (typeof c == "number") {
      return new ComplexNumber(this.x * c, this.y * c);
    } else {
      return new ComplexNumber(
        this.x * c.x - this.y * c.y,
        this.x * c.y + this.y * c.x,
      );
    }
  }

  div(c: ComplexNumber | number) {
    if (typeof c == "number") {
      return new ComplexNumber(this.x / c, this.y / c);
    } else {
      return this.mul(c.inv);
    }
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  get inv() {
    const sz2 = this.x * this.x + this.y * this.y;
    return new ComplexNumber(this.x / sz2, -this.y / sz2);
  }

  get unit() {
    const len = this.length;
    return new ComplexNumber(this.x / len, this.y / len);
  }

  get rot() {
    return Math.atan2(this.y, this.x);
  }

  static from_rad(rad: number) {
    return new ComplexNumber(Math.cos(rad), Math.sin(rad));
  }
}

export class FFT {
  size: number;
  power: number;

  constructor(size: number) {
    let power = 1;
    while ((1 << power) < size) power++;
    this.power = power;
    this.size = size;
  }

  change(data: ComplexNumber[]) {
    const changed_data: ComplexNumber[] = [];
    for (let i = 0; i < this.size; i++) {
      let ri = 0;
      for (let j = 0; j < this.power; ++j) {
        if ((1 << j) & i) {
          ri |= 1 << (this.power - 1 - j);
        }
      }
      changed_data[i] = data[ri];
    }
    return changed_data;
  }

  bufferfly(data: ComplexNumber[], reverse: boolean) {
    const cd = this.change(data);
    const size = this.size;
    for (let seg = 2; seg <= size; seg *= 2) {
      const half_seg = seg / 2;
      let r = 2 * Math.PI / half_seg;
      if (reverse) {
        r = -r;
      }
      const wn = ComplexNumber.from_rad(r);
      for (let i = 0; i < size; i += seg) {
        let w = new ComplexNumber(1, 0);
        for (let j = 0; j < half_seg; j++) {
          const a = cd[i + j];
          const b = cd[i + half_seg + j].mul(w);
          cd[i + j] = a.add(b);
          cd[i + j + half_seg] = a.sub(b);
          w = w.mul(wn);
        }
      }
    }
    if (reverse) {
      for (let i = 0; i < size; i++) {
        cd[i] = cd[i].div(size);
      }
    }
    return cd;
  }

  do(data: ComplexNumber[]) {
    return this.bufferfly(data, false);
  }

  undo(data: ComplexNumber[]) {
    return this.bufferfly(data, true);
  }
}
