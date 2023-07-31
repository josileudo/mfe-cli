#!/usr/bin/env node

const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

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
const replaceAllOccurrences = (obj, searchValue, replaceValue) => {
  for(const key in obj) {
    if(typeof obj[key] === 'object') {
      replaceAllOccurrences(obj[key], searchValue, replaceValue);
    } else if (typeof obj[key] === 'string') {
      obj[key] = obj[key].replace(new RegExp(searchValue, 'g'), replaceValue);
    }
  }
}

// Will be receive a name to replace
const updateJsonFile = (basePath, fileName, projectName) => {
  const filePath = path.join(basePath, fileName);

  if(fs.existsSync(filePath)) {
    const fileJsonContent = fs.readFileSync(filePath, 'utf-8');
    const fileJson = JSON.parse(fileJsonContent);

    if(fileJson.projects) {
      fileJson.projects[projectName] = fileJson.projects['create-mfe-app'];
      delete fileJson.projects['create-mfe-app'];
    }

    const oldName = 'create-mfe-app'
    replaceAllOccurrences(fileJson, oldName, projectName);

    fs.writeFileSync(filePath, JSON.stringify(fileJson, null, 2), 'utf-8');
  }
}

const replaceTsTitleName = (basePath, fileName ,projectName) => {
  const filePath = path.join(basePath, fileName);
  let fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const oldName = 'create-mfe-app';
  fileContent = fileContent.replace(new RegExp(oldName, 'g'), projectName);

  fs.writeFileSync(filePath, fileContent, 'utf-8');
}

const repoName = process.argv[2];
const gitCheckoutCommand = `git clone --depth 1 https://github.com/josileudo/create-mfe-app ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;

console.log(`Cloning the repository with name ${repoName}`);
const checkedOut = runCommand(gitCheckoutCommand);
if(!checkedOut) process.exit(-1);

console.log(`Installing dependencies for the ${repoName}`);
const installedDeps = runCommand(installDepsCommand);
if(!installedDeps) process.exit(-1);

const projectName = repoName;
const templatePath = path.join(process.cwd(), repoName);

// Replace name in JSON files
updateJsonFile(templatePath, 'angular.json', projectName);
updateJsonFile(templatePath, 'package.json', projectName);

// Replace name in TS files
replaceTsTitleName(templatePath, 'src/app/app.component.ts', projectName);
replaceTsTitleName(templatePath, 'src/app/app.component.spec.ts', projectName);

// Work finish
console.log("Congratulations! You are ready. Follow the following commands to start");
console.log(`cd ${repoName} && npm start`);
