import { State } from './state';
import { SiRequest } from './request';
import { FeedFactory } from './feed.factory';
import { EntityFactory } from './entity.factory';
import { ProposalRepository } from '../repositories/proposal.repository';
import { ProposalAppendixRepository } from '../repositories/proposal-appendix.repository';
import { PortalAuth } from '../auth/portal.auth';

export class SiApiClient {
  public state = new State();
  public request = new SiRequest(this);
  public feed = new FeedFactory(this);
  public entity = new EntityFactory(this);

  public portal = new PortalAuth(this);

  /* Repositories */
  proposal = new ProposalRepository(this);
  proposalAppendix = new ProposalAppendixRepository(this);
}
