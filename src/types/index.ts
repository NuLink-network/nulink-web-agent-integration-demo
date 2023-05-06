export type FileData = {
  list: any[];
  total: number;
}

type FieldItem = {
  value: string | number | boolean;
  label: string;
};
export type ILocale = {
  id: "zh_CN" | "en";
  messages: Record<string, Record<string, any>>;
  fields: Record<string, FieldItem[]>;
};