import { Repository } from './repository';
import { TradeEntity } from '../entities';

export class EntityFactory extends Repository {
  trade(baseTradeId: number, appType: number, tradeType: number, cartId: number) {
    const thread = new TradeEntity(this.client);
    thread.baseTradeId = baseTradeId;
    thread.appType = appType;
    thread.tradeType = tradeType;
    thread.cartId = cartId;
    return thread;
  }
}
