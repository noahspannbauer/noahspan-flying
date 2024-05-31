import { Locator, Page } from '@playwright/test';
import { config } from '../support/config';

export class PilotsPage {
  page: Page;
  newButton: Locator;
  pilotDrawer: Locator;
  pilotDrawerCancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newButton = page.getByTestId('new-pilot-button');
    this.pilotDrawer = page.getByTestId('pilot-drawer');
    this.pilotDrawerCancelButton = page.getByTestId(
      'pilot-drawer-cancel-button'
    );
  }

  public async clickNewButton() {
    await this.newButton.click();
  }

  public async clickPilotDrawerCancelButton() {
    await this.pilotDrawerCancelButton.click();
  }
}
