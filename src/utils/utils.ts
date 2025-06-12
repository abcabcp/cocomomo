export const randomNumBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const hypothenuse = (x: number, y: number): number => {
  return Math.sqrt(x * x + y * y);
};
