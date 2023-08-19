const { exec } = require('child_process')

const gitCheckoutCommand = `git clone --depth 1 --branch 15.0.x https://github.com/josileudo/create-mfe-app ${'repoName'}`;

const templateClone = () => {
  return new Promise((resolve, reject) => {
    const process = exec(gitCheckoutCommand, (error) => {
      error ? reject(error) : resolve();
    });

    process.stdout.pipe(process.stdout);
    process.stderr.pipe(process.stderr);
  });
}

module.exports = templateClone;