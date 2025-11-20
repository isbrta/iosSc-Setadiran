export interface OrganizationFeedResponse {
  content: OrganizationFeedResponseContentItem[];
  totalPages: number;
  totalElements: number;
  resultsExtraInfo: any | null;
}

export interface OrganizationFeedResponseContentItem {
  id: number;
  orgCode: string | null;
  name: string;
}
