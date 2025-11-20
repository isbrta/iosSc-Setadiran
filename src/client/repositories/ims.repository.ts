import { Repository } from '../core/repository';

export class ImsRepository extends Repository {
  async units() {
    const { body } = await this.client.request.send({
      method: 'GET',
      url: '/item-srv/ims/baseUnits',
      responseType: 'json',
      app: 'item',
    });
    return body;
  }
}
