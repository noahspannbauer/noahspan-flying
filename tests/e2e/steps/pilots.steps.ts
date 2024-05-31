import { ICustomWorld } from '../support/world';
import { Given, Then, When } from '@cucumber/cucumber';
import { config } from '../support/config';
import { expect } from '@playwright/test';
import { PilotsPage } from '../pages/pilots.page';

When('the user clicks the New button', async function (this: ICustomWorld) {
  const pilotsPage = new PilotsPage(this.page!);

  await pilotsPage.clickNewButton();
});

When(
  'the user clicks the pilot drawer cancel button',
  async function (this: ICustomWorld) {
    const pilotsPage = new PilotsPage(this.page!);

    await pilotsPage.clickPilotDrawerCancelButton();
  }
);

Then('the pilot drawer is visible', async function (this: ICustomWorld) {
  const pilotsPage = new PilotsPage(this.page!);

  await expect(pilotsPage.pilotDrawer).toBeVisible();
});

Then(
  'the pilot drawer is no longer visible',
  async function (this: ICustomWorld) {
    const pilotsPage = new PilotsPage(this.page!);

    await expect(pilotsPage.pilotDrawer).not.toBeVisible();
  }
);
