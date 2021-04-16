export enum UnorderedWord {
  东 = "东",
  南 = "南",
  西 = "西",
  北 = "北",
  中 = "中",
  发 = "发",
  白 = "白",
}
export enum OrderedWord {
  条 = "条",
  万 = "万",
  筒 = "筒",
}

export type CardNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface OrderedCard {
  value: OrderedWord;
  number: CardNum;
  type: "Ordered";
  id: string;
}
export interface UnorderedCard {
  value: UnorderedWord;
  type: "Unordered";
  id: string;
}
export type Card = OrderedCard | UnorderedCard;
