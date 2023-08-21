const { exec } = require('child_process');

const templateClone = (mfeName) => {
  const gitCheckoutCommand = `git clone --depth 1 --branch 15.0.x https://github.com/josileudo/create-mfe-app ${mfeName}`;
  return new Promise((resolve, reject) => {
    const process = exec(gitCheckoutCommand, (error) => {
      error ? reject(error) : resolve();
    });

    process.on('close', code => {
      code === 0 
        ? resolve() 
        : reject(new Error(`Command failed with exit code ${code}`))
    })
  });
}

module.exports = templateClone;