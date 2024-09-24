import { Locator, Page } from '@playwright/test';
import { config } from '../support/config';

export class PilotsPage {
  page: Page;
  pilotDrawer: Locator;
  pilotAddButton: Locator;
  pilotSaveButton: Locator;
  pilotCancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pilotDrawer = page.getByTestId('pilot-drawer');
    this.pilotAddButton = page.getByTestId('add-pilot-button');
    this.pilotSaveButton = page.getByTestId('save-pilot-button');
    this.pilotCancelButton = page.getByTestId('pilot-form-cancel-button');
  }

  public async clickAddPilotButton() {
    await this.pilotAddButton.click();
  }

  public async clickSaveButton() {
    await this.pilotSaveButton.click();
  }

  public async clickPilotDrawerCancelButton() {
    await this.pilotCancelButton.click();
  }
}
