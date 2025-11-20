import { Feed } from '../core/feed';
import { deepAssign, formatDateISO, joinIfArray } from '../../lib/utils';
import { CardsFeedResponse, CardsFeedResponseContentItem } from '../responses/cards.feed.response';

export enum SearchType {
  KEYWORD = 0, // کلیدواژه
  PARTY_NUMBER = 1, // شماره معامله
}

export enum SortType {
  CORE = 'core,desc',
  ON_PERFORMING = 'onPerforming,desc',
  SCORE = 'score,desc',
  NEWER_INSERT_DATE = 'newerInsertDate,desc',
  OLDER_INSERT_DATE = 'olderInsertDate,desc',
  NEWER_JALALI_SEND_DEAD_LINE_DATE = 'newerJalaliSendDeadLineDate,desc',
  OLDER_JALALI_SEND_DEAD_LINE_DATE = 'olderJalaliSendDeadLineDate,desc',
}

export class CardsFeed extends Feed<CardsFeedResponse, CardsFeedResponseContentItem> {
  searchTypeCode: SearchType = SearchType.KEYWORD;
  keyword?: string;
  fromSendDeadlineDate?: Date;
  toSendDeadlineDate?: Date;
  fromDocumentDeadlineDate?: Date;
  toDocumentDeadlineDate?: Date;
  selectedOrganization?: number[] | number;
  selectedCategory?: number[] | number;
  selectedCities?: number[] | number;
  classificationId?: number[] | number;
  boardCode?: number[] | number;
  tagCode?: number[] | number;
  fromPrice?: number;
  toPrice?: number;
  queryText?: string;
  pageNumber: number = 0;
  pageSize: number = 5;
  sort: SortType = SortType.CORE;

  set state(data: CardsFeedResponse) {
    const { totalPages } = data;
    this.moreAvailable = this.pageNumber + 1 < (totalPages ?? 0);
  }

  async request() {
    const params = {
      searchTypeCode: this.searchTypeCode,
      keyword: this.keyword,
      fromSendDeadlineDate: formatDateISO(this.fromSendDeadlineDate),
      toSendDeadlineDate: formatDateISO(this.toSendDeadlineDate),
      fromDocumentDeadlineDate: formatDateISO(this.fromDocumentDeadlineDate),
      toDocumentDeadlineDate: formatDateISO(this.toDocumentDeadlineDate),
      selectedOrganization: joinIfArray(this.selectedOrganization),
      selectedCategory: joinIfArray(this.selectedCategory),
      selectedCities: joinIfArray(this.selectedCities),
      classificationId: joinIfArray(this.classificationId),
      boardCode: joinIfArray(this.boardCode),
      tagCode: joinIfArray(this.tagCode),
      fromPrice: this.fromPrice,
      toPrice: this.toPrice,
      queryText: this.queryText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort: this.sort,
    };

    const { body } = await this.client.request.send<CardsFeedResponse>({
      url: 'centralboard/cards/',
      method: 'GET',
      params,
      responseType: 'json',
      app: 'centralboard',
    });

    this.state = body;
    return body;
  }

  async items() {
    const body = await this.request();
    return body.content.map((card) => {
      const response = new CardsFeedResponseContentItem(this.client);
      deepAssign(response, card);
      return response;
    });
  }
}
