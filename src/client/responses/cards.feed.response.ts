import { TradeEntity } from '../entities/trade.entity';

export interface CardsFeedResponse {
  content: CardsFeedResponseContentItem[];
  totalPages: number;
  totalElements: number;
  resultsExtraInfo: any;
}

export class CardsFeedResponseContentItem extends TradeEntity {
  number!: number;
  title!: string;
  boardCode!: number;
  basePrice!: number; // basePrice only on AUCTION_TYPE
  orgName!: string;
  score!: number;
  cityName!: string;
  insertDate!: string | null;
  boardName!: string;
  provinceName!: string;
  jalaliSendDeadlineDate!: string;
  jalaliLastEditDate!: string | null;
  jalaliDocumentDeadlineDate!: string;
  tableId!: number;
  tagCode!: number;
  needType!: string | null;
  reqId!: number | null;
  jalaliFromProposalDate!: string;
  partyNumber!: string;
  orgId!: number;
  aucState!: number;
  cartId!: number;
  categoryId!: number;
  categoryName!: string;
  locId!: number | null;
  ticketId!: string;

  aggregations!: {
    by_boardCode: {
      buckets: { doc_count: number; key: string }[];
    };
    by_tagCode: {
      buckets: { doc_count: number; key: string }[];
    };
  };

  public toJSON(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const key of Reflect.ownKeys(this)) {
      const desc = Object.getOwnPropertyDescriptor(this, key);
      if (typeof key === 'string' && desc?.enumerable) {
        result[key] = this[key as keyof typeof this];
      }
    }
    return result;
  }
}
