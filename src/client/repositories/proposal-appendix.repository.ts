import { Repository } from '../core/repository';

export class ProposalAppendixRepository extends Repository {
  async countTotalAppendix(
    documentId: number,
    appType: number,
    tradeType: number,
    appendixTypeList: number[],
    parentAppendixTypeList: number[],
    comeFromApp: string = 'proposalService',
  ) {
    const { body } = await this.client.request.send({
      method: 'GET',
      url: '/proposal-srv-setad/proposalAppendix/countTotalAppendix/',
      params: {
        documentId,
        appType,
        tradeType,
        appendixTypeList: appendixTypeList.join(','),
        parentAppendixTypeList: parentAppendixTypeList.join(','),
        comeFromApp,
      },
      responseType: 'text',
      app: 'setadproposal',
    });
    return body;
  }

  async getAppendixFileWithTicket(ticket: string, comeFromApp: string = 'proposalService') {
    const { body } = await this.client.request.send({
      method: 'GET',
      url: '/proposal-srv-setad/proposalAppendix/getAppendixFileWithTicket/',
      params: {
        ticket,
        comeFromApp,
      },
      responseType: 'json',
      app: 'setadproposal',
    });
    return body;
  }

  async getAppendixFile(
    baseTradeId: number,
    appendixId: number,
    appType: number,
    tradeType: number,
    documentType: number,
  ) {
    const { body } = await this.client.request.send({
      method: 'GET',
      url: `/proposal-srv-setad/proposal/${baseTradeId}/appendix/${appendixId}`,
      params: {
        appType,
        tradeType,
        documentType,
        comeFromApp: 'board',
      },
      responseType: 'data',
      app: 'setadproposal',
    });
    return body;
  }

  async allTotalAppendixes(
    baseTradeId: number,
    appType: number,
    tradeType: number,
    appendixTypeList: number[],
    parentAppendixTypeList: number[],
    comeFromApp: string = 'proposalService',
  ) {
    const { body } = await this.client.request.send({
      method: 'GET',
      url: `/proposal-srv-setad/proposalAppendix/allTotalAppendixes/${baseTradeId}`,
      params: {
        appType,
        tradeType,
        appendixTypeList: appendixTypeList.join(','),
        parentAppendixTypeList: parentAppendixTypeList.join(','),
        comeFromApp,
      },
      responseType: 'json',
      app: 'setadproposal',
    });
    return body;
  }
}
