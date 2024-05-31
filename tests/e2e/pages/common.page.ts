import { Locator, Page } from '@playwright/test';
import { config } from '../support/config';

export class CommonPage {
  page: Page;
  loginLink: Locator;
  navbarLinks: Locator;
  pageHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginLink = page.getByTestId('login-link');
    this.navbarLinks = page.getByTestId('flying-navbar').getByRole('link');
    this.pageHeading = page.getByRole('heading');
  }

  public async goto() {
    await this.page.goto(config.baseUrl);
  }

  public async clickLoginLink() {
    await this.loginLink.click();
  }

  public async clickNavbarLink(navbarLinkName: string) {
    await this.navbarLinks.filter({ hasText: navbarLinkName });
  }
}
