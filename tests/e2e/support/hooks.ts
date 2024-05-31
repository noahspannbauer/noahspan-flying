import { ICustomWorld } from './world';
import { config } from './config';
import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  Status,
  setDefaultTimeout
} from '@cucumber/cucumber';
import {
  chromium,
  ChromiumBrowser,
  firefox,
  FirefoxBrowser,
  webkit,
  WebKitBrowser,
  ConsoleMessage,
  ViewportSize
} from '@playwright/test';
import { ITestCaseHookParameter } from '@cucumber/cucumber/lib/support_code_library_builder/types';
import { ensureDir } from 'fs-extra';

const tracesDir = './e2e/results/traces';
const getStorageState = (
  pickleName: string
):
  | string
  | {
      cookies: {
        name: string;
        value: string;
        domain: string;
        path: string;
        expires: number;
        httpOnly: boolean;
        secure: boolean;
        sameSite: 'Strict' | 'Lax' | 'None';
      }[];
      origins: {
        origin: string;
        localStorage: { name: string; value: string }[];
      }[];
    }
  | undefined => {
  if (pickleName.endsWith('admin')) {
    return './auth/write.json';
  }
};
let browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;

declare global {
  let browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
}

setDefaultTimeout(process.env.PWDEBUG ? -1 : 60 * 100);

BeforeAll(async function () {
  switch (config.browser) {
    case 'firefox': {
      browser = await firefox.launch(config.browserOptions);

      break;
    }
    case 'webkit': {
      browser = await webkit.launch(config.browserOptions);

      break;
    }
    default: {
      browser = await chromium.launch(config.browserOptions);
    }
  }

  await ensureDir(tracesDir);
});

Before({ tags: '@ignore' }, async function () {
  return 'skipped' as any;
});

Before({ tags: '@debug' }, async function (this: ICustomWorld) {
  this.debug = true;
});

Before(
  { tags: '@noAuth' },
  async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
    const viewportSize: ViewportSize = {
      height: Number(1080),
      width: Number(1920)
    };

    this.startTime = new Date();
    this.testName = pickle.name.replace(/\W/g, '-');
    this.context = await browser.newContext({
      acceptDownloads: true,
      viewport: viewportSize,
      userAgent: config.userAgent
    });

    await this.context.tracing.start({
      screenshots: true,
      snapshots: true
    });

    this.page = await this.context.newPage();
    this.page.on('console', async (msg: ConsoleMessage) => {
      if (msg.type() === 'log') {
        await this.attach(msg.text());
      }
    });
    this.feature = pickle;
  }
);

Before(async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
  const viewportSize: ViewportSize = {
    height: Number(1080),
    width: Number(1920)
  };

  this.startTime = new Date();
  this.testName = pickle.name.replace(/\W/g, '-');
  this.context = await browser.newContext({
    storageState: getStorageState(pickle.name),
    acceptDownloads: true,
    viewport: viewportSize,
    userAgent: config.userAgent
  });

  await this.context.tracing.start({
    screenshots: true,
    snapshots: true
  });

  this.page = await this.context.newPage();
  this.page.on('console', async (msg: ConsoleMessage) => {
    if (msg.type() === 'log') {
      await this.attach(msg.text());
    }
  });
  this.feature = pickle;
});

After(async function (this: ICustomWorld, { result }: ITestCaseHookParameter) {
  if (result) {
    await this.attach(
      `Status: ${result?.status}. Duration:${result.duration?.seconds}s`
    );

    if (result.status !== Status.PASSED) {
      const image = await this.page?.screenshot({
        path: `./e2e/results/screenshots/${this.testName}.png`,
        type: 'png'
      });
      const timePart = this.startTime
        ?.toISOString()
        .split('.')[0]
        .replace(/:/g, '_');

      if (image) {
        await this.attach(image, 'image/png');
      }

      await this.context?.tracing.stop({
        path: `${tracesDir}/${this.testName}-${timePart}trace.zip`
      });
    }
  }

  await this.page?.close();
  await this.context?.close();
});

AfterAll(async function () {
  await browser.close();
});
