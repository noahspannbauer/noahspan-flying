import { LaunchOptions, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const browserOptions: LaunchOptions = {
  headless: Boolean(process.env.HEADLESS) || false,
  timeout: Number(process.env.TIMEOUT) || 60000,
  args: [
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream'
  ],
  firefoxUserPrefs: {
    'media.navigator.streams.fake': true,
    'media.navigator.permission.disable': true
  },
  slowMo: Number(process.env.SLO_MO) || 0
};
const desktopChrome = devices['Desktop Chrome'];

export const config = {
  browser: process.env.BROWSER || 'chromium',
  browserOptions,
  baseUrl: process.env.BASE_URL || 'http://localhost:5173',
  username: process.env.TEST_USERNAME,
  password: process.env.TEST_PASSWORD,
  viewportHeight: process.env.VIEWPORT_HEIGHT || desktopChrome.viewport.height,
  viewportWidth: process.env.VIEWPORT_WIDTH || desktopChrome.viewport.width,
  userAgent: process.env.USER_AGENT || desktopChrome.userAgent
};
