export interface CityFeedResponse {
  content: CityFeedResponseContentItem[];
  totalPages: number;
  totalElements: number;
  resultsExtraInfo: any | null;
}

export interface CityFeedResponseContentItem {
  locId: number;
  parentLocId: number;
  locType: number;
  provinceAgentCode: number;
  caProvinceId: number;
  creatDate: string; // ISO timestamp
  locName: string;
  parentLocIdLocId: number | null;
}
