export interface ProposalRepositoryParentResponse {
  aucNo: string;
  auctionReferenceNo: string;
  aucTitle: string;
  orgName: string;
  classificationId: number;
  classType: number;
  aucState: number;
  provinceName: string;
  cityName: string;
  fax: string;
  tel: string;
  address: string;
  viewDateTimeDto: ProposalRepositoryParentResponseViewDateTimeDto;
  possibilityExtensionValues: number;
  description: string;
  archiveNo: string;
  shift: number;
}

export interface ProposalRepositoryParentResponseViewDateTimeDto {
  fromViewDate: number;
  fromViewTime: string | null;
  toViewDate: number;
  toViewTime: string | null;
  undergraduateDate: string;
  fromSiteShowDate: string;
  toSiteShowDate: string;
  fromProposalDate: string;
  toProposalDate: string;
  paperDate: string | null;
  aucWinAccPayDeadlineDay: number;
}
