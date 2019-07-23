import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from 'projects/sample/src/app/auth-code-flow.config';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Quickstart Demo';

  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.loadDiscoveryDocumentAndLogin({
      state: 'abcde'
    }).then(_ => {
      console.debug('logged in', this.oauthService.state);
    });

    this.oauthService
        .events
        .pipe(filter(e => e.type === 'token_received'))
        .subscribe(_ => this.oauthService.loadUserProfile());
  }

  get userName(): string {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims) return null;
    return claims['given_name'];
  }

  get idToken(): string {
    return this.oauthService.getIdToken();
  }

  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  refresh() {
    this.oauthService.refreshToken();
  }

}
