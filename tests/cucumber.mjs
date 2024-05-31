import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const config = {
  requireModule: ['ts-node/register'],
  require: ['e2e/support/hooks.ts', 'e2e/steps/*.steps.ts'],
  format: [
    'progress-bar',
    'json:e2e/results/report/report.json',
    'rerun:e2e/results/@rerun.txt'
  ],
  formatOptions: { snippetInterface: 'async-await' },
  parallel: Number(process.env.PARALLEL) ? Number(process.env.PARALLEL) : 1
};

export default config;
