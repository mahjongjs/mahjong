export enum UnorderedWord {
  东 = '东',
  南 = '南',
  西 = '西',
  北 = '北',
  中 = '中',
  发 = '发',
  白 = '白',
}
export enum OrderedWord {
  条 = '条',
  万 = '万',
  筒 = '筒',
}

export class Card {
  value: OrderedWord | UnorderedWord;
  constructor(value: OrderedWord | UnorderedWord) {
    this.value = value;
  }
}

export type CardNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export class OrderedCard extends Card {
  value: UnorderedWord;
  number: CardNum;

  constructor(value: OrderedWord | UnorderedWord, number: CardNum) {
    super(value);
    this.number = number;
  }
}
