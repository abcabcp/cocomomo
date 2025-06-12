export function createUtilities(
  colors: Record<string, string>,
  classPrefix: string,
  styleKey: string,
) {
  return Object.entries(colors).reduce(
    (acc, [key, value]) => {
      acc[`.${classPrefix}-${key}`] = { [styleKey]: value };
      return acc;
    },
    {} as Record<string, any>,
  );
}
