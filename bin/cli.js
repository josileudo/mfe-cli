#!/usr/bin/env node

const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const ex = require('fs-extra');

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

// TODO
// Nossa ideia é setar o tipo de estilo que o cliente deseja
// por exemplo: scss, css, sass, less

// Caso a flag setada não contenha nenhum dos valores, retornar um erro


// if(argv.style !== 'scss') {
//   console.log('Está usando outro estilo');
// }



const removeFilesRequired = async (src, dest) => {
  try {
    await ex.remove(`${src}/${dest}`)
  } catch (err) {
    console.error(err)
  }
}

const runCommand = command => {
  try {
    execSync(`${command}`, {stdio: 'inherit'});
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }

  return true;
}

// Check all structure to change name project.
// const replaceAllOccurrences = (obj, searchValue, replaceValue) => {
//   for(const key in obj) {
//     if(typeof obj[key] === 'object') {
//       replaceAllOccurrences(obj[key], searchValue, replaceValue);
//     } else if (typeof obj[key] === 'string') {
//       obj[key] = obj[key].replace(new RegExp(searchValue, 'g'), replaceValue);
//     }
//   }
// }

// Will be receive a name to replace
// const updateJsonFile = (basePath, fileName, projectName) => {
//   const filePath = path.join(basePath, fileName);

//   if(fs.existsSync(filePath)) {
//     const fileJsonContent = fs.readFileSync(filePath, 'utf-8');
//     const fileJson = JSON.parse(fileJsonContent);

//     if(fileJson.projects) {
//       fileJson.projects[projectName] = fileJson.projects['create-mfe-app'];
//       delete fileJson.projects['create-mfe-app'];
//     }

//     const oldName = 'create-mfe-app'
//     replaceAllOccurrences(fileJson, oldName, projectName);

//     fs.writeFileSync(filePath, JSON.stringify(fileJson, null, 2), 'utf-8');
//   }
// }

const updateNameInFiles = (basePath, fileName, oldName, projectName) => {
  const filePath = path.join(basePath, fileName);
  let fileContent = fs.readFileSync(filePath, 'utf-8');
  
  fileContent = fileContent.replace(new RegExp(oldName, 'g'), projectName);

  fs.writeFileSync(filePath, fileContent, 'utf-8');
}

const repoName = process.argv[2];
const gitCheckoutCommand = `git clone --depth 1 https://github.com/josileudo/create-mfe-app ${repoName}`;
const installAfterCommand = `cd ${repoName} && npm i -f`;

console.log(`Cloning the repository with name ${repoName}`);
const checkedOut = runCommand(gitCheckoutCommand);
if(!checkedOut) process.exit(-1);

const projectName = repoName;
const templatePath = path.join(process.cwd(), repoName);
const oldName = 'create-mfe-app';

// Replace *TS files
updateNameInFiles(templatePath, 'src/app/app.component.ts', oldName, projectName);
updateNameInFiles(templatePath, 'src/app/app.component.spec.ts', oldName, projectName);
updateNameInFiles(templatePath, 'src/app/app.module.ts', oldName, projectName);

// Replace *Json files
updateNameInFiles(templatePath, 'package.json', oldName, projectName);
updateNameInFiles(templatePath, 'angular.json', oldName, projectName);

// Choice style
const choiceStyleExtension = () => {
  const extensions = ['scss', 'css', 'sass', 'less'];

  let res = extensions.filter((extension) => extension === argv.style);
  
  res.map(type => {
    if(type)  {
      const oldExt = path.join(templatePath, 'src', 'styles.scss');
      const newExt = path.join(templatePath, 'src', `styles.${type}`);

      updateNameInFiles(templatePath, 'angular.json', 'scss', type);

      fs.rename(oldExt, newExt, (err) => {
        if(err) console.error('Extensions error!!!!');
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

console.log(`Installing dependencies for the ${repoName}`);
const installedDeps = runCommand(installAfterCommand);
if(!installedDeps) process.exit(-1);

// Work finish
console.warn("Congratulations! You are ready. Follow the following commands to start");
console.warn(`cd ${repoName} && npm start`);
