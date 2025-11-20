import { Feed } from '../core/feed';
import { CategoryFeedResponse, CategoryFeedResponseContentItem } from '../responses/category.feed.response';

export class CategoryFeed extends Feed<CategoryFeedResponse, CategoryFeedResponseContentItem> {
  categorySearch: string = '';
  sort: string = 'name,asc';
  pageSize: number = 20;
  queryText: string = '';

  set state(data: CategoryFeedResponse) {
    const { totalPages } = data;
    this.moreAvailable = this.pageNumber + 1 < (totalPages ?? 0);
  }

  async request(): Promise<CategoryFeedResponse> {
    const params = {
      categorySearch: this.categorySearch,
      queryText: this.queryText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort: this.sort,
    };

    const { body } = await this.client.request.send<CategoryFeedResponse>({
      url: '/centralboard/cards/setadCategory/',
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
