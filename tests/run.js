const fs = require('fs/promises');
const path = require('path');
const { exec } = require('../scheme.js');

async function run() {
  const pattern = process.argv[2];

  const libSource = await fs.readFile(
    path.join(__dirname, '_lib.scm'),
    'utf-8'
  );

  const entries = await fs.readdir(__dirname, { withFileTypes: true });
  const testFiles = entries
    .filter(
      entry =>
        entry.isFile() &&
        entry.name.endsWith('.scm') &&
        // Don't test testing lib on its own.
        entry.name !== '_lib.scm' &&
        (!pattern || entry.name.includes(pattern))
    )
    .map(entry => entry.name);

  let failureCount = 0;
  await Promise.all(
    testFiles.map(async testFile => {
      try {
        console.log(`Running all tests in ${testFile}...`);
        const source = await fs.readFile(
          path.join(__dirname, testFile),
          'utf-8'
        );

        // Prepend the testing library code to the source file.
        const sourceWithLib = `${libSource}\n\n${source}`;
        exec(sourceWithLib);
      } catch (err) {
        console.log(`Failure: ${err.message}\n  in ${testFile}\n`);
        failureCount += 1;
      }
    })
  );

  if (failureCount === 0) {
    console.log('All tests passed!');
  } else {
    console.log(`${failureCount} failure(s)`);
  }
}

run();
