export enum ELang {
  UA = 'ua',
  EN = 'en'
}

export enum ETheme {
  System = 'system',
  Light = 'light',
  Dark = 'dark',
}

export interface IAppSettings {
  lang: ELang;
  theme: ETheme;
  repeat: boolean;
}

export const DEFAULT_APP_SETTINGS: IAppSettings = {
  lang: ELang.UA,
  theme: ETheme.Light,
  repeat: false,
};

export interface IOptions<T = string | number> {
  value: T;
  title: string;
}

export const DEADLINE_HOURS_BOOKING_LESSON_FOR_STUDENT = 15;
export const DEADLINE_HOURS_BOOKING_INDIVIDUAL_FOR_STUDENT = 3;

export const ONE_SECONDS = 1000;
export const FOUR_SECONDS = 4000;
