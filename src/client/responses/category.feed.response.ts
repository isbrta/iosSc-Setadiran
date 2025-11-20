export interface CategoryFeedResponseContentItem {
  id: number;
  classificationCategoryId: number;
  categoryCode: string;
  categoryName: string;
  categoryLatinName: string;
  categoryImageFileTicket: string;
}

export interface CategoryFeedResponse {
  content: CategoryFeedResponseContentItem[];
  totalPages: number;
  totalElements: number;
  resultsExtraInfo: any | null;
}
