import { ICustomWorld } from '../support/world';
import { Given, When, Then } from '@cucumber/cucumber';
import { config } from '../support/config';
import { expect } from '@playwright/test';
import { CommonPage } from '../pages/common.page';

Given('the user is on the homepage', async function (this: ICustomWorld) {
  const commonPage = new CommonPage(this.page!);

  await commonPage.goto();
});

When(
  'the user clicks the {string} navbar link',
  async function (this: ICustomWorld, navbarLinkName: string) {
    const commonPage = new CommonPage(this.page!);

    await commonPage.clickNavbarLink(navbarLinkName);
  }
);

Then(
  'the user is on the {string} page',
  async function (this: ICustomWorld, pageHeadingText: string) {
    const commonPage = new CommonPage(this.page!);

    await expect(
      commonPage.pageHeading.filter({ hasText: pageHeadingText })
    ).toHaveText('Pilots');
  }
);
