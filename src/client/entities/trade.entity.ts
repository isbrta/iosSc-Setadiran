import { AppType } from '../core/constants';
import { Entity } from '../core/entity';

export class TradeEntity extends Entity {
  baseTradeId: number;
  partyNumber: any;
  appType: AppType;
  boardCode: number;
  tradeType: any;
  tagCode: number;
  cartId: number;

  private get _baseTradeId(): number {
    return this.baseTradeId ?? Number(this.partyNumber);
  }
  private get _appType(): number {
    return this.appType ?? this.client.state.getAppType(this.boardCode);
  }

  private get _tradeType(): number {
    if (this.tradeType) return this.tradeType;
    if (this._appType === AppType.EAUC) {
      return this.client.state.getEAucTagType(this.tagCode);
    }
    return this.tagCode;
  }

  public async detail() {
    return await this.client.proposal.detail(this._baseTradeId, this._appType, this._tradeType, 'board');
  }

  public async owner() {
    return await this.client.proposal.owner(this._baseTradeId, 'board');
  }

  public async catalog() {
    return await this.client.proposal.catalog(this._baseTradeId, this._appType, this._tradeType, this.cartId, 'board');
  }

  public async parent() {
    return await this.client.proposal.parent(this._baseTradeId, this._appType, this._tradeType, 'board');
  }

  public async commission() {
    return await this.client.proposal.commission(this._baseTradeId, 'board');
  }

  public async downloadJudgeAds() {
    return await this.client.proposal.downloadJudgeAds(this._baseTradeId);
  }

  public async countTotalAppendix() {
    return await this.client.proposalAppendix.countTotalAppendix(
      this._baseTradeId,
      this._appType,
      this._tradeType,
      [1122, 7455], // appendixTypeList
      [1911, 4426], // parentAppendixTypeList
      'board',
    );
  }

  public async allTotalAppendixes() {
    return await this.client.proposalAppendix.allTotalAppendixes(
      this._baseTradeId,
      this._appType,
      this._tradeType,
      [1122, 7455], // appendixTypeList
      [1911, 4426], // parentAppendixTypeList
      'board',
    );
  }
}
