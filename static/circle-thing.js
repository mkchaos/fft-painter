import Circle from "./circle.js";

// class CircleConfig {
//   size;
//   rotation;
//   frequency;
// }

export default class CircleThing {
  // circles: Circle[];
  // drawnPoints: { x: number; y: number }[];

  constructor(cfgs) {
    this.circles = [];
    this.drawnPoints = [];

    for (let i = 0; i < cfgs.length; i++) {
      const circle = new Circle(
        /* size= */
        cfgs[i].size,
        /* rotation= */
        cfgs[i].rotation,
        /* frequency= */
        cfgs[i].frequency,
      );
      if (i > 0) {
        circle.set_parent(this.circles[i - 1]);
      }
      this.circles.push(circle);
    }
  }

  update(deltaT) {
    for (let i = 0; i < this.circles.length; i++) {
      this.circles[i].update(deltaT);
    }
    this.addDrawPoint();
  }

  // Add a draw point. Ignores how far the circles themselves are in the process of being drawn.
  addDrawPoint() {
    const first_circle = this.circles[0];
    const circle = this.circles[this.circles.length - 1];
    if (first_circle.rotation - first_circle.startRotation < 2 * Math.PI + 0.1) {
      this.drawnPoints.push(circle.end);
    }
  }

  reset() {
    for (let i = 0; i < this.circles.length; i++) {
      this.circles[i].reset();
    }
    this.drawnPoints = [];
  }

  render(
    context,
    scale,
    off_x,
    off_y,
  ) {
    context.strokeStyle = "black";
    for (let i = 0; i < this.circles.length; i++) {
      this.circles[i].render(context, scale, off_x, off_y);
    }
    context.strokeStyle = "red";
    if (this.drawnPoints.length > 0) {
      context.beginPath();
      context.moveTo(
        scale * (this.drawnPoints[0].x + off_x),
        scale * (this.drawnPoints[0].y + off_y),
      );
      for (let i = 1; i < this.drawnPoints.length; i++) {
        context.lineTo(
          scale * (this.drawnPoints[i].x + off_x),
          scale * (this.drawnPoints[i].y + off_y),
        );
      }
      context.stroke();
    }
  }
}
