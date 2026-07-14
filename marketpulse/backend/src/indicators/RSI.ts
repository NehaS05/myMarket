export class RSI {
  static calculate(values: number[], period = 14): number | null {
    if (values.length <= period) return null;
    let gains = 0; let losses = 0;
    for (let i = values.length - period; i < values.length; i += 1) {
      const diff = values[i] - values[i - 1];
      if (diff >= 0) gains += diff; else losses -= diff;
    }
    if (losses === 0) return 100;
    const rs = gains / period / (losses / period);
    return 100 - 100 / (1 + rs);
  }
}
