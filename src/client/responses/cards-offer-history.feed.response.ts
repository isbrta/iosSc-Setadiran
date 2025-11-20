export interface CardsOfferHistoryFeedResponse {
  content: CardsOfferHistoryFeedResponseContentItem[];
  totalPages: number;
  totalElements: number;
  resultsExtraInfo: any;
}

export class CardsOfferHistoryFeedResponseContentItem {
  id: number;
  supplierName: string;
  proposalPrice: number;
  responseDate: string; // ISO timestamp
}
