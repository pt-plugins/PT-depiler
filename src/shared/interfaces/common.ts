export interface ILangMetaData {
  name: string,
  code: string,
  authors: string[],
}

export interface LogItem {
  id: string;
  time: number;

  event?: string;
  msg?: string;
  data?: any;
}
