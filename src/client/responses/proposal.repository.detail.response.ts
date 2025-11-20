export interface ProposalRepositoryDetailResponse {
  usageTypeName: string | null;
  attributeDecs: string | null;
  totalBasePrice: number;
  haveTaxValue: boolean;
  prepayPercent: number;
  accountInfo: string;
  description: string;

  baseTradeItemInfoDto: ProposalRepositoryDetailResponseBaseTradeItemInfo;
  baseTradeVisitInfoDto: ProposalRepositoryDetailResponseBaseTradeVisitInfo;
  baseTradeCreditInfoDto: ProposalRepositoryDetailResponseBaseTradeCreditInfo;
  baseTradePrpInfoDto: ProposalRepositoryDetailResponseBaseTradePrpInfo;
  baseTradeGhovehInfoDto: ProposalRepositoryDetailResponseBaseTradeGhovehInfo;

  propertyType: string;
  ownershipType: number;
  ownershipTypeName: string;
  documentState: number;
  documentStateName: string;
  rentalState: number;
  rentalStateName: string;

  depositPrice: number | null;
  rentalMonthlyPrice: number | null;
  rentalFinalDate: string | null;

  summery: string;
  shift: number;
  reasonAuction: number;
  reasonAuctionName: string;
  salesVolume: string;
}

export interface ProposalRepositoryDetailResponseBaseTradeItemInfo {
  itemNo: string;
  itemReferenceNo: string;
  parentItemNo: string;
  parentItemId: string;
  itemTypeName: string;
  itemName: string;
  itemTitle: string;
  itemDescription: string | null;
  auctionItemsOwnersInfoDtos: any; // define if known
  cartId: number;
  orgName: string;
  classificationId: number;
  classType: number;
  orgProvinceName: string;
  orgCityName: string;
  orgFaxNo: string;
  orgTelNo: string;
  orgMobileNo: string;
  orgEmail: string;
  orgAddress: string;
}

export interface ProposalRepositoryDetailResponseBaseTradeVisitInfo {
  visitProvince: string;
  visitCity: string;
  visitAddress: string;
  postalCode: string;
}

export interface ProposalRepositoryDetailResponseBaseTradeCreditInfo {
  epayCreditAlwd: boolean;
  creditPrice: number;
  creditDepositPayerId: number | null;
  creditAccountId: number;
}

export interface ProposalRepositoryDetailResponseBaseTradePrpInfo {
  isGiveFree: boolean;
  isGiveStep: boolean;
  giveStepType: string | null;
  giveStepLastPercent: number | null;
  giveStepConst: number | null;
  minPriceIncrease: number;
  haveTaxValue: boolean | null;
}

export interface ProposalRepositoryDetailResponseBaseTradeGhovehInfo {
  obligatoryDocumentType: string | null;
  insuranceState: string | null;
  insuranceName: string | null;
  specifiedDebit: string | null;
  privilegeInfo: string;
}
