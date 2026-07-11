export class NumberFormatter {
    //Rounds to 2 decimals, eg. 1,234.567 -> 1234.56
    roundThb = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

    roundMmk = (num: number) => Math.ceil(num / 1) * 1;

    //Rounds to 2 decimals, returns plain number with commas. eg "1,234.56"
    format(value: number | string): string {
        const num = typeof value === "string" ? parseFloat(value) : value;

        if (isNaN(num)) return "0";

        const rounded = this.roundThb(num);
        return new Intl.NumberFormat().format(rounded);
    }
}
