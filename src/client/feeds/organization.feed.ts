import { Feed } from '../core/feed';
import { OrganizationFeedResponse, OrganizationFeedResponseContentItem } from '../responses/organization.feed';
import { joinIfArray } from '../../lib/utils';

export class OrganizationFeed extends Feed<OrganizationFeedResponse, OrganizationFeedResponseContentItem> {
  organizationState: number = 225;
  queryText: string = '';
  sort: string = 'name,asc';
  pageSize: number = 10;
  organizationSearch?: string;
  classificationId?: number | number[];

  set state(data: OrganizationFeedResponse) {
    const { totalPages } = data;
    this.moreAvailable = this.pageNumber + 1 < (totalPages ?? 0);
  }

  async request() {
    const params = {
      organizationSearch: this.organizationSearch,
      organizationState: this.organizationState,
      classificationId: joinIfArray(this.classificationId),
      queryText: this.queryText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort: this.sort,
    };

    const { body } = await this.client.request.send<OrganizationFeedResponse>({
      url: '/centralboard/cards/setadOrganization/',
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
