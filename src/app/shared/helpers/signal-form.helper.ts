export class SignalFormHelper {
  static getVisibleValues<T>(form: any): T {
    const values = form.value();
    const controls = form.controls;
    const result: any = {};

    for (const key in values) {
      if (!controls[key]?.hidden?.()) {
        result[key] = values[key];
      }
    }
    return result;
  }
}