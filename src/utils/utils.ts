export const getColor = (cashPoint: number) => {
  if (cashPoint < 2) return '#6D6D8F';
  if (cashPoint >= 10) return '#37f713';
  if (cashPoint >= 2) return '#29C7A1';
  return '#ED6300';
};

export const f = (x: number) => {
  // x = Math.max(x - 5, 0);
  // if (x < 0) {
  //  return Math.pow(1 - (x * x) / 5 / 5, 0.4);
  // }
  return Math.pow(x / 10, 2.5) + 1;
};

export const rf = (x: number) => {
  return Math.pow(x - 1, 0.4) * 10 + 5;
};

export const fixed = (x: number, figure: number) => {
  return Math.floor(x * 10 ** figure) / 10 ** figure;
};
