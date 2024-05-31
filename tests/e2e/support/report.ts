const report = require('multiple-cucumber-html-reporter');

report.generate({
  jsonDir: './e2e/results/report',
  reportPath: './e2e/results/report',
  metadata: {
    platform: {
      name: 'ubuntu',
      version: 'node 16.20.2'
    }
  },
  customData: {
    title: 'Run info',
    data: [
      { label: 'Project', value: 'Banner CDS' },
      { label: 'Release', value: `${process.env.RELEASE_NUMBER}` },
      { label: 'Run ID', value: `${process.env.RUN_ID}` },
      { label: 'Execution Start Time', value: `${process.env.TEST_START}` },
      { label: 'Execution End Time', value: `${process.env.TEST_END}` }
    ]
  }
});
