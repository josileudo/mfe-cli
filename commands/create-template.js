const { exec } = require('child_process');

const templateClone = (mfeName) => {
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