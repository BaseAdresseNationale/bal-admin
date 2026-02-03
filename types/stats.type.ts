export interface Stats<T extends number | Array<string>> {
  id: string;
  name: string;
  value: T;
}
