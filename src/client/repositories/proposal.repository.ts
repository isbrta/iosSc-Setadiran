import { Repository } from '../core/repository';

import {
  ProposalRepositoryCatalogResponse,
  ProposalRepositoryCommissionResponse,
  ProposalRepositoryDetailResponse,
  ProposalRepositoryOwnerResponse,
  ProposalRepositoryParentResponse,
} from '../responses';

export class ProposalRepository extends Repository {
  // اطلاعات مالی + اطلاعات مورد معامله
  async detail(
    baseTradeId: number,
    appType: number,
    tradeType: number,
    comeFromApp: string = 'proposalService',
  ): Promise<ProposalRepositoryDetailResponse> {
    const { body } = await this.client.request.send<ProposalRepositoryDetailResponse>({
      method: 'GET',
      url: `/proposal-srv-setad/proposal/baseTrade/${baseTradeId}`,
      params: {
        appType,
        tradeType,
        comeFromApp,
      },
      responseType: 'json',
      app: 'setadproposal',
    });
    return body;
  }

  // اطلاعات مالکان
  async owner(baseTradeId: number, comeFromApp: string = 'proposalService'): Promise<ProposalRepositoryOwnerResponse> {
    const { body } = await this.client.request.send<ProposalRepositoryOwnerResponse>({
      method: 'GET',
      url: `/proposal-srv-setad/proposal/ownerBaseTrade/${baseTradeId}`,
      params: {
        comeFromApp,
      },
      responseType: 'json',
      app: 'setadproposal',
    });
    return body;
  }

  // اطلاعات مورد معامله + عکس ها
  async catalog(
    baseTradeId: number,
    appType: number,
    tradeType: number,
    cartId: number = 0,
    comeFromApp: string = 'proposalService',
  ): Promise<ProposalRepositoryCatalogResponse> {
    const { body } = await this.client.request.send<ProposalRepositoryCatalogResponse>({
      method: 'GET',
      url: `/proposal-srv-setad/proposal/catalog/baseTradeId/${baseTradeId}`,
      params: {
        appType,
        tradeType,
        cartId,
        comeFromApp,
      },
      responseType: 'json',
      app: 'setadproposal',
    });
    return body;
  }

  // اطلاعات دستگاه + اطلاعات معامله + اطلاعات زمانی
  async parent(
    baseTradeParentId: number,
    appType: number,
    tradeType: number,
    comeFromApp: string = 'proposalService',
  ): Promise<ProposalRepositoryParentResponse> {
    const { body } = await this.client.request.send<ProposalRepositoryParentResponse>({
      method: 'GET',
      url: `/proposal-srv-setad/proposal/baseParentTrade/${baseTradeParentId}`,
      params: { appType, tradeType, comeFromApp },
      responseType: 'json',
      app: 'setadproposal',
    });
    return body;
  }

  async commission(
    baseTradeId: number,
    comeFromApp: string = 'proposalService',
  ): Promise<ProposalRepositoryCommissionResponse> {
    const { body } = await this.client.request.send<ProposalRepositoryCommissionResponse>({
      method: 'GET',
      url: `/proposal-srv-setad/proposal/commissionBaseTrade/${baseTradeId}`,
      params: {
        comeFromApp,
      },
      responseType: 'json',
      app: 'setadproposal',
    });
    return body;
  }

  // آگهی الکترونیک قوه قضائیه
  async downloadJudgeAds(baseTradeId: number) {
    const { body } = await this.client.request.send({
      method: 'GET',
      url: `/proposal-srv-setad/proposal/print/auction/judiciary/${baseTradeId}`,
      responseType: 'data',
      app: 'setadproposal',
    });
    return body;
  }
}
