import { debug } from '../../lib/debug';
import { ScRequest } from '../../lib/sc-request';
import { SiApiClient } from '../core/client';
import { SiAuthError, SiRoleVerificationError } from '../errors';

export interface Role {
  id: string;
  name: string;
  title: string;
}

export interface AppType {
  code: number;
  clientName: string;
  title: string;
}

export interface RoleApp {
  appCode: number;
  appType: string;
  appTitle: string;
  clientName: string;
  roles: Role[];
}

export interface RoleOrganization {
  id: string;
  title: string;
  code: string;
  isActive: boolean;
  description?: string;
  apps: RoleApp[];
}

export class PortalAuth {
  static _portalDebug = debug('si:portal');
  private http: ScRequest;
  private client: SiApiClient;
  public roles: RoleOrganization[];

  constructor(client: SiApiClient) {
    this.client = client;
    this.http = new ScRequest({
      baseUrl: 'https://sso2.setadiran.ir/portal',
      jar: this.client.state.cookieJar,
      headers: {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'X-XSRF-TOKEN': this.client.state.getCookieCsrfToken('https://sso2.setadiran.ir/portal'),
      },
      responseType: 'html',
    });
  }

  public async isLoggedIn(): Promise<boolean> {
    const response = await this.http.request({
      url: '/role-selection',
      method: 'GET',
    });
    const isRolePage = response.url.includes('/role-selection');
    this.roles = isRolePage ? this.parseRoles(response.body) : null;
    return isRolePage;
  }

  public async captchaImage(): Promise<Image> {
    const { body } = await this.http.request({
      url: '/captcha',
      method: 'GET',
      params: { action: 'create', t: Date.now() },
      responseType: 'image',
    });
    return body;
  }

  async login(username: string, password: string, captchaCode: string): Promise<boolean> {
    const response = await this.http.request({
      url: '/login',
      method: 'POST',
      form: { username, password, captcha: captchaCode },
    });

    if (response.url.includes('role-selection')) {
      this.roles = this.parseRoles(response.body);
      return true;
    }

    throw new SiAuthError(response);
  }

  async selectRole(organizationId: string, appCode: number, roleId: number) {
    const response = await this.http.request({
      url: '/role-selection/verification',
      method: 'POST',
      form: {
        originalMessage: JSON.stringify({
          appType: String(appCode),
          role: String(roleId),
          organization: String(organizationId),
        }),
      },
      followRedirect: false,
    });

    if (response?.statusCode === 200) {
      return response.body;
    }
    throw new SiRoleVerificationError(response)

  }

  private parseRoles(html: string): RoleOrganization[] {
    const orgsMatch = html.match(/let\s+organizations\s*=\s*(\[[\s\S]*?\]);/);
    const roleMatch = html.match(/let\s+organizationIdsWithAppTypesAndRoles\s*=\s*(\{[\s\S]*?\});/);
    const appTypesMatch = html.match(/let\s+appTypesObject\s*=\s*(\{[\s\S]*?\});/);

    const organizationsRaw: RoleOrganization[] = orgsMatch?.[1] ? JSON.parse(orgsMatch[1]) : [];
    const rolesRaw = roleMatch?.[1] ? JSON.parse(roleMatch[1]) : {};
    const appTypesRaw = appTypesMatch?.[1] ? JSON.parse(appTypesMatch[1]) : {};

    return (organizationsRaw as any[]).map((org: any) => {
      const rawApps = rolesRaw[org.id] || {};
      const apps: RoleApp[] = Object.entries(rawApps).map(([appType, roles]) => {
        const appMeta = appTypesRaw[appType] || {};
        return {
          appCode: appMeta.code,
          appType,
          appTitle: appMeta.title,
          clientName: appMeta.clientName,
          roles: roles as Role[],
        };
      });

      return {
        id: org.id,
        title: org.title,
        code: org.code,
        isActive: org.isActive,
        description: org.description,
        apps,
      };
    });
  }
}
