
const {exec} = require('child_process');
let commandToInstall = '';

const runCommand = command => {
  return new Promise((resolve, reject) => {
    const process = exec(command, (error) => {
      error ? reject(error) : resolve();
    });

    // process.stdout.pipe(process.stdout);
    // process.stderr.pipe(process.stderr);
    
    process.on('close', code => {
      code === 0 
        ? resolve() 
        : reject(new Error(`Command failed with exit code ${code}`))
    })
  });

}

// const installedDeps = runCommand(commandToInstall);
// const installAfterCommand = (repoName) => {
//   commandToInstall = `cd ${repoName} && npm i -f`;
// }

// if(!installedDeps) process.exit(-1);

module.exports = runCommand