export interface LogItem {
  id: string;
  time: number;

  event?: string;
  msg?: string;
  data?: any;
}
