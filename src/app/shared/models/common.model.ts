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
