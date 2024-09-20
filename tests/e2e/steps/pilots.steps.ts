import { ICustomWorld } from '../support/world';
import { Given, Then, When } from '@cucumber/cucumber';
import { config } from '../support/config';
import { expect } from '@playwright/test';
import { PilotsPage } from '../pages/pilots.page';

When(
  'the user clicks the Add Pilot button',
  async function (this: ICustomWorld) {
    const pilotsPage = new PilotsPage(this.page!);

    await pilotsPage.clickAddPilotButton();
  }
);

When(
  `the user enters the pilot's information`,
  async function (this: ICustomWorld) {
    const pilotsPage = new PilotsPage(this.page!);
  }
);

// When(`the user clicks the Save button`, async function (this: ICustomWorld) {
//   const pilotsPage = new PilotsPage(this.page!);

//   await pil
// })

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
