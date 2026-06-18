import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "priceFormat",
})
export class PriceFormatPipe implements PipeTransform {
  transform(value: number | string | null | undefined, currencySymbol: string = ''): string {
    if (value === null || value === undefined || value === '') {
      return '0' + (currencySymbol ? ` ${currencySymbol}` : '');
    }

    const parsedNumber = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(parsedNumber)) {
      return '0';
    }

    const formatted = parsedNumber.toLocaleString('uk-UA', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    return currencySymbol ? `${formatted} ${currencySymbol}` : formatted;
  }
}
