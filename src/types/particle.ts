import { randomNumBetween } from '../utils/utils';

export interface Particle {
  r: number;
  rAlpha: number;
  rFriction: number;
  angle: number;
  angleAlpha: number;
  angleFriction: number;
  x: number;
  y: number;
  opacity: number;
  size: number;
  update: (canvasWidth: number, canvasHeight: number) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export const createParticle = (
  canvasWidth: number,
  canvasHeight: number,
): Particle => {
  const ringRadius = Math.min(canvasHeight * 0.25, canvasWidth * 0.25);

  return {
    r: ringRadius,
    rAlpha: randomNumBetween(0, 5),
    rFriction: randomNumBetween(0.95, 1.01),
    angle: randomNumBetween(0, 360),
    angleAlpha: randomNumBetween(1, 2),
    angleFriction: randomNumBetween(0.97, 0.99),
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    opacity: randomNumBetween(0.2, 1),
    size: randomNumBetween(0.5, 2),

    update(canvasWidth: number, canvasHeight: number) {
      this.rAlpha *= this.rFriction;
      this.r += this.rAlpha;
      this.angleAlpha *= this.angleFriction;
      this.angle += this.angleAlpha;
      this.x =
        canvasWidth / 2 + this.r * Math.cos((Math.PI / 180) * this.angle);
      this.y =
        canvasHeight / 2 + this.r * Math.sin((Math.PI / 180) * this.angle);
      this.opacity -= 0.003;
    },

    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.fill();
      ctx.closePath();
    },
  };
};
