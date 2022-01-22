export default class Circle {
  // size: number;
  // startRotation: number;
  // rotation: number;
  // frequency: number;
  // parent: Circle | null;
  // x: number;
  // y: number;

  constructor(size, rotation, frequency) {
    this.size = size;
    this.startRotation = rotation;
    this.rotation = rotation;
    this.frequency = frequency;
    this.parent = null;
    this.x = 0;
    this.y = 0;
  }

  set_parent(parent) {
    this.parent = parent;
    this.moveToParent();
  }

  moveToParent() {
    this.x = this.parent?.endX ?? 0;
    this.y = this.parent?.endY ?? 0;
  }

  reset() {
    this.rotation = this.startRotation;
    if (this.parent != null) {
      this.moveToParent();
    }
  }

  update(deltaT) {
    // TODO: Some delta T
    this.rotation += 2 * Math.PI * this.frequency * deltaT;
    if (this.parent != null) {
      this.moveToParent();
    }
  }

  get endX() {
    return this.x + this.size * Math.cos(this.rotation);
  }

  get endY() {
    return this.y + this.size * Math.sin(this.rotation);
  }

  get end() {
    return {
      x: this.endX,
      y: this.endY,
    };
  }

  get length() {
    // Circumference of circle + radius
    return 2 * Math.PI * this.size + this.size;
  }

  render(
    context,
    scale,
  ) {
    context.beginPath();
    context.arc(
      scale * (this.x),
      scale * (this.y),
      scale * this.size,
      0,
      2 * Math.PI,
    );
    context.moveTo(
      scale * (this.x),
      scale * (this.y),
    );
    context.lineTo(
      scale * (this.endX),
      scale * (this.endY),
    );
    context.stroke();
  }
}
