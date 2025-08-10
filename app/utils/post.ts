export function formatPostAmount(amount: number, withSuffix: boolean = false) {
  const stringAmount = amount.toString();
  const length = stringAmount.length;

  if (length >= 7 && withSuffix) {
    const prefix = stringAmount.slice(0, -6);
    const suffix = prefix === '1' ? 'millón' : 'mill.';
    return `${prefix} ${suffix}`;
  }

  if (length >= 5) {
    return new Intl.NumberFormat().format(amount).replace('.', ',');
  }

  return stringAmount;
}

export function formatPostFrequency(frequency: Frequency) {
  return frequency === 'daily' ? 'día' : 'mes';
}
