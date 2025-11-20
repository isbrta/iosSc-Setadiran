export interface ProposalRepositoryCatalogResponse {
  tradeTitle: string | null;
  commodityTitle: string;
  amount: number | null;
  baseUnitIssueTitle: string;
  propBaseCatalogDtos: ProposalRepositoryCatalogResponsePropBaseCatalogDto[];
  ticketDtos: ProposalRepositoryCatalogResponseTicketDto[];
  cartId: number;
}

export interface ProposalRepositoryCatalogResponsePropBaseCatalogDto {
  // اگر ساختار مشخصه، اینجا تعریف کن
  [key: string]: any;
}

export interface ProposalRepositoryCatalogResponseTicketDto {
  // اگر ساختار مشخصه، اینجا تعریف کن
  [key: string]: any;
}
