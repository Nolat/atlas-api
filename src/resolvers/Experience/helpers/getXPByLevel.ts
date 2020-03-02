const getXPByLevel = (level: number): number => {
  return Math.round(150 * level ** 1.1);
};

export default getXPByLevel;
