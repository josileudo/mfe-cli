
const {exec} = require('child_process');

const runCommand = command => {
  return new Promise((resolve, reject) => {
    const process = exec(command, (error) => {
      error ? reject(error) : resolve();
    });

    process.on('close', code => {
      code === 0 
        ? resolve() 
        : reject(new Error(`Command failed with exit code ${code}`))
    })
  });
}

module.exports = runCommand