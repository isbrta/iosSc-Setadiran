export interface ProductCategoryFeedResponse {
  content: ProductCategoryFeedResponseContentItem[];
  totalPages: number;
  totalElements: number;
  resultsExtraInfo: any | null;
}

export interface ProductCategoryFeedResponseContentItem {
  id: number;
  classificationCategoryId: number;
  categoryName: string;
  categoryCount: number;
  image: string | null;
  keyword: string | null;
  hasCategoryCount: boolean;
}
