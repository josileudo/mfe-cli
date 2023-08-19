#!/usr/bin/env node
'use strict'

const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');
const Ace = require('@adonisjs/ace')

//const { createPromptModule } = require('inquirer');
const ex = require('fs-extra');

// const yargs = require('yargs/yargs');
// const { hideBin } = require('yargs/helpers');
// const argv = yargs(hideBin(process.argv)).argv;

const removeFilesRequired = async (src, dest) => {
  try {
    await ex.remove(`${src}/${dest}`)
  } catch (err) {
    console.error(err)
  }
}

const runCommand = command => {
  try {
    execSync(`${command}`, {stdio: ['inherit', 'ignore', 'ignore']});
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }

  return true;
}


const main = async() => {
  try {
    const { createPromptModule } = await import('inquirer');
 
    const prompt = createPromptModule();
    const answers = await prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Input your name prefer: '
      },
      {
        type: 'list',
        name: 'style',
        message: 'Choice your style extension: ',
        choices: ['scss', 'css', 'sass', 'less']
      }
    ])

    const repoName = answers.projectName;
    const gitCheckoutCommand = `git clone --depth 1 --branch 15.0.x https://github.com/josileudo/create-mfe-app ${repoName}`;
    const installAfterCommand = `cd ${repoName} && npm i -f`;
    
    // console.warn()

    console.log(`${'\x1b[33m'} Creating ${repoName} project`)

    // start the progress bar with a total value of 200 and start value of 0
  
    // update the curren
    // stop the progress bar
          
    // const checkedOut = runCommand(gitCheckoutCommand);
    // if(!checkedOut) process.exit(-1);
    execSync(gitCheckoutCommand, { stdio: ['inherit', 'ignore', 'ignore' ]})
    
    const projectName = repoName;
    const templatePath = path.join(process.cwd(), repoName);
    const oldName = 'create-mfe-app';

    const updateNameInFiles = (basePath, fileName, oldName, projectName) => {
      const filePath = path.join(basePath, fileName);
      let fileContent = fs.readFileSync(filePath, 'utf-8');
      
      fileContent = fileContent.replace(new RegExp(oldName, 'g'), projectName);
    
      fs.writeFileSync(filePath, fileContent, 'utf-8');
    }

    // Replace *TS files
    updateNameInFiles(templatePath, 'src/app/app.component.ts', oldName, projectName);
    updateNameInFiles(templatePath, 'src/app/app.component.spec.ts', oldName, projectName);
    updateNameInFiles(templatePath, 'src/app/app.module.ts', oldName, projectName);
    
    // Replace *Json files
    updateNameInFiles(templatePath, 'package.json', oldName, projectName);
    updateNameInFiles(templatePath, 'angular.json', oldName, projectName);
    
    // get versions    
    
    // Choice style
    const choiceStyleExtension = () => {
      const extensions = ['scss', 'css', 'sass', 'less'];
    
      let res = extensions.filter((extension) => extension === answers.style);
      
      res.map(type => {
        if(type)  {
          const oldExt = path.join(templatePath, 'src', 'styles.scss');
          const newExt = path.join(templatePath, 'src', `styles.${type}`);
    
          updateNameInFiles(templatePath, 'angular.json', 'scss', type);
    
          fs.rename(oldExt, newExt, (err) => {
            if(err) console.error(`${'x1b[31m'} Extensions error!!!!`);
          })
        }
        return;
      })
    }
    
    choiceStyleExtension();
    
    // Replace *README.md name
    updateNameInFiles(templatePath, 'README.md', oldName, projectName);
    
    // Remove .git file to initializing a new project
    removeFilesRequired(projectName, '.git');

    console.log(`${'\x1b[33m'} Installing dependencies for the ${'\x1b[32m', repoName} project`)
    
    const installedDeps = runCommand(installAfterCommand);
    
    if(!installedDeps) process.exit(-1);
    
    // Work finish

    console.log(`${'\x1b[32m'} Congratulations! You are ready. Follow the following commands to start`);
    console.warn(`${'\x1b[34m'} cd ${repoName} && npm start`);  

  } catch(err) {
    console.error(`${'\x1b[31m'}An error ocurred: `, err)
    process.exit(1);
  }
}


// add commands as ES2015 classes
Ace.addCommand(require('../commands/run-tasks'))
Ace.addCommand(require('../commands/run-tasks-parallel'))

// Boot ace to execute commands
Ace.wireUpWithCommander()
Ace.invoke()
// main();