import { Feed } from '../core/feed';
import {
  ProductCategoryFeedResponse,
  ProductCategoryFeedResponseContentItem,
} from '../responses/product-category.feed.response';
import { joinIfArray } from '../../lib/utils';

export class ProductCategoryFeed extends Feed<ProductCategoryFeedResponse, ProductCategoryFeedResponseContentItem> {
  tagCode: string = '';
  orgCode: string = '';
  boardCode?: string | string[];
  classificationId: number[] = [];
  queryText: string = '';
  pageSize: number = 20;

  set state(data: ProductCategoryFeedResponse) {
    const { totalPages } = data;
    this.moreAvailable = this.pageNumber + 1 < (totalPages ?? 0);
  }

  async request() {
    const params = {
      tagCode: this.tagCode,
      orgCode: this.orgCode,
      boardCode: joinIfArray(this.boardCode),
      classificationId: joinIfArray(this.classificationId),
      queryText: this.queryText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };

    const { body } = await this.client.request.send<ProductCategoryFeedResponse>({
      url: '/centralboard/cards/selectProductCategory/',
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
