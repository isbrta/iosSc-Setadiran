
export class PortalAuth {
  static _portalDebug = debug('si:portal');
  private http: ScRequest;
  private client: SiApiClient;
  public roles: RoleOrganization[];

  constructor(client: SiApiClient) {
  }
}