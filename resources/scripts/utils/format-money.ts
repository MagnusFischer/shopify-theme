class FormatMoney {
  private readonly cents: number;

  private config: {
    format: string;
    regex: RegExp;
    removeTrailingZeros: boolean;
  };

  constructor(cents: number | string, format: string) {
    if (typeof cents === 'string') {
      this.cents = parseInt(cents.replace(/\D/g, ''), 10);
    } else {
      this.cents = cents;
    }

    this.config = {
      format,
      regex: /{{\s*(\w+)\s*}}/,
      removeTrailingZeros: false,
    };
  }

  removeTrailingZeros() {
    this.config.removeTrailingZeros = true;

    return this;
  }

  private formatNumber(
    decimals: number,
    thousandSeparator: string = '.',
    decimalSeparator: string = ','
  ): string {
    const [whole, decimal] = (this.cents / 100).toFixed(decimals).split('.');

    let formattedAmount = whole.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

    if (decimal && (!this.config.removeTrailingZeros || decimal !== '00')) {
      formattedAmount += `${decimalSeparator}${decimal}`;
    }

    return formattedAmount;
  }

  toString(): string {
    let args: [number, string?, string?];

    switch (this.config.format.match(this.config.regex)[1]) {
      case 'amount':
        args = [2];
        break;

      case 'amount_no_decimals':
        args = [0];
        break;

      case 'amount_with_comma_separator':
        args = [2, '.', ','];
        break;

      case 'amount_with_space_separator':
        args = [2, ' ', ','];
        break;

      case 'amount_with_period_and_space_separator':
        args = [2, ' ', '.'];
        break;

      case 'amount_no_decimals_with_comma_separator':
        args = [0, '.', ','];
        break;

      case 'amount_no_decimals_with_space_separator':
        args = [0, ' '];
        break;

      case 'amount_with_apostrophe_separator':
        args = [2, "'", '.'];
        break;

      default:
        throw new Error(`Format of ${this.config.format} is not a valid format`);
    }

    return this.config.format.replace(this.config.regex, this.formatNumber(...args));
  }
}

export default (cents: number | string, format: string = theme.moneyFormat) =>
  new FormatMoney(cents, format);
