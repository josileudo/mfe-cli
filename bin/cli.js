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

const replaceAllOccurrences = (obj, searchValue, replaceValue) => {
  for(const key in obj) {
    if(typeof obj[key] === 'object') {
      replaceAllOccurrences(obj[key], searchValue, replaceValue);
    } else if (typeof obj[key] === 'string') {
      obj[key] = obj[key].replace(new RegExp(searchValue, 'g'), replaceValue);
    }
  }
}

const replaceProjectNameInAngularJson = (basePath, projectName) => {
  const angularJsonPath = path.join(basePath, 'angular.json');

  if(fs.existsSync(angularJsonPath)) {
    const angularJsonContent = fs.readFileSync(angularJsonPath, 'utf-8');
    const angularJson = JSON.parse(angularJsonContent);

    angularJson.projects[projectName] = angularJson.projects['create-mfe-app'];
    delete angularJson.projects['create-mfe-app'];

    const oldName = 'create-mfe-app'
    replaceAllOccurrences(angularJson, oldName, projectName);

    fs.writeFileSync(angularJsonPath, JSON.stringify(angularJson, null, 2), 'utf-8');
  }
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
replaceProjectNameInAngularJson(templatePath, projectName);

console.log("Congratulations! You are ready. Follow the following commands to start");
console.log(`cd ${repoName} && npm start`);
