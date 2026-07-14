export class EMA {
  static calculate(values: number[], period: number): number[] {
    if (values.length === 0) return [];
    const k = 2 / (period + 1);
    const result: number[] = [values[0]];
    for (let i = 1; i < values.length; i += 1) result.push(values[i] * k + result[i - 1] * (1 - k));
    return result;
  }
}
