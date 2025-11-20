import { deepAssign } from '../../lib/utils';
import { CardsFeed, CategoryFeed, CityFeed, OrganizationFeed, ProductCategoryFeed } from '../feeds';
import { SiApiClient } from './client';

export class FeedFactory {
  constructor(private client: SiApiClient) {}

  public category(options = {}): CategoryFeed {
    const feed = new CategoryFeed(this.client);
    return deepAssign(feed, options);
  }

  public productCategory(options = {}): ProductCategoryFeed {
    const feed = new ProductCategoryFeed(this.client);
    return deepAssign(feed, options);
  }

  public organization(options = {}): OrganizationFeed {
    const feed = new OrganizationFeed(this.client);
    return deepAssign(feed, options);
  }

  public city(options = {}): CityFeed {
    const feed = new CityFeed(this.client);
    return deepAssign(feed, options);
  }

  public cards(options = {}): CardsFeed {
    const feed = new CardsFeed(this.client);
    return deepAssign(feed, options);
  }
}
