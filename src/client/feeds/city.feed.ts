import { Feed } from '../core/feed';
import { CityFeedResponse, CityFeedResponseContentItem } from '../responses/city.feed.redponse';

export class CityFeed extends Feed<CityFeedResponse, CityFeedResponseContentItem> {
  parentLocId?: number;
  citySearch?: string;
  sort: string = 'id,desc';
  pageSize: number = 20;

  set state(data: CityFeedResponse) {
    const { totalPages } = data;
    this.moreAvailable = this.pageNumber + 1 < (totalPages ?? 0);
  }

  async request() {
    const params = {
      parentLocId: this.parentLocId,
      citySearch: this.citySearch,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort: this.sort,
    };

    const { body } = await this.client.request.send<CityFeedResponse>({
      url: '/centralboard/cards/setadCity',
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
