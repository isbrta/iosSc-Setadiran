import { Feed } from '../core/feed';
import { CardsOfferHistoryFeedResponse, CardsOfferHistoryFeedResponseContentItem } from '../responses';

export class CardsOfferHistoryFeed extends Feed<
  CardsOfferHistoryFeedResponse,
  CardsOfferHistoryFeedResponseContentItem
> {
  baseTradeType: number;
  appType: number;
  tradeType: number;
  queryText?: string;
  pageNumber: number = 0;
  pageSize: number = 5;

  set state(data: CardsOfferHistoryFeedResponse) {
    const { totalPages } = data;
    this.moreAvailable = this.pageNumber + 1 < (totalPages ?? 0);
  }

  async request() {
    const params = {
      baseTradeType: this.baseTradeType,
      appType: this.appType,
      tradeType: this.tradeType,
      queryText: this.queryText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };

    const { body } = await this.client.request.send<CardsOfferHistoryFeedResponse>({
      url: 'centralboard/cards/offerHistoryGridInfo',
      method: 'GET',
      params,
      responseType: 'json',
      app: 'centralboard',
    });

    this.state = body;
    return body;
  }

  async items() {
    const response = await this.request();
    return response.content;
  }
}
