export const getValues = (enumValue) => {
  const keys = Object.keys(enumValue).filter((key) => isNaN(+key))
  const values = keys.map((key) => enumValue[key as any])
  return values
}
