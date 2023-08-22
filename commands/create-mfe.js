'use strict'
// const { exec } = require('child_process');

const { Command } = require('@adonisjs/ace')
const Listr = require('listr')

const runCommand = require('./run-command.js');
const removeFilesRequired = require('./remove-files.js')
const { updateNameInFiles, choiceStyleExtension} = require('./name-replaced');

let answers;
const gitCheckoutCommand = `git clone --depth 1 --branch 15.0.x https://github.com/josileudo/create-mfe-app`;

const project_name = {
  type: 'input',
  name: 'projectName',
  message: '🎤 Choose a name for your MFE: '
}
const style_extension = { 
  type: 'list',
  name: 'style',
  message: '💄 Choice your style extension: ',
  choices: ['scss', 'css', 'sass', 'less']
}
const project_version = { 
  type: 'list',
  name: 'version',
  message: '🧭 Choice version for your project: ',
  choices: ['15.0.x', '16.0.x']
}


class CreateMfe extends Command { 
  /**
   * The method signature describes the command, arguments and flags/aliases
   * The words flags and aliases mean the same thing in this context 😃
   */
  static get signature() {
    return `create-mfe
    { -s, --style-choose: Choice your style extension }
    { -i, --install-packages: Install packages after create mfe project}
    { -v, --project-version: Choice a version for your work project}
    `
  }

  /**
   * Use this description to provide additional details
   * about the command
   */
  static get description() {
    return 'Run to create an mfe create.'
  }
  
  /**
   * Handle the command
   *
   * @param {*} args   arguments object, contains only data if you’ve added arguments in the signature
   * @param {*} flags  an object of flags where each value is either "null" or "true".
   *                   Check the signature for available flags
   */

  async handle(args, { styleChoose, installPackages, projectVersion }) {
    // deployment task list
    try {
      const { createPromptModule } = await import('inquirer'); 
      const prompt = createPromptModule();

      const ask = [project_name]

      if(styleChoose) ask.push(style_extension);
      if(projectVersion) ask.push(project_version);

      answers = await prompt(ask)
    } catch(err) {
      console.error(`${'\x1b[31m'}An error ocurred: `, err)
      process.exit(1);
    }

    const tasks = new Listr([
      {
        title: `🔨Configuring ${this.chalk.bold.green(answers.projectName)} project`,
        skip: () => false,
        task: () => new Listr([
          {
            title: 'Creating ...',
            skip: () => false, 
            task: () => runCommand(`git clone --depth 1 --branch ${projectVersion ? answers.version : '16.0.x'} https://github.com/josileudo/create-mfe-app ${answers.projectName}`)
          },
          {
            title: 'Replace files name',
            skip: () => false,
            task: () => updateNameInFiles(answers.projectName)
          },
          {
            title: 'Replace extension style',
            skip: () => { return styleChoose ? false : 'Skip style extension' },
            task: () => choiceStyleExtension(answers.style, answers.projectName)
          },
          {
            title: 'Remove .git file',
            skip: () => false,
            task: () => removeFilesRequired(answers.projectName, '.git')
          },
          {
            title: 'Preparing ...',
            skip: () => false,
            task: () =>  this.waitASecond()
          },
        ])
        
      },
      {
        title: `📦 Installing dependencies for the ${this.chalk.bold.green(answers.projectName)} project`,
        skip: () => installPackages ? false : true,
        task: () => runCommand(`cd ${answers.projectName} && npm i -f`)
      },
    ])
    
    await tasks.run() 
    console.log(this.chalk.bold.green(`
      '##::::'##:'########:'########:::::::::::'######::'##:::::::'####:
      ###::'###: ##.....:: ##.....:::::::::::'##... ##: ##:::::::. ##::
      ####'####: ##::::::: ##:::::::::::::::: ##:::..:: ##:::::::: ##::
      ## ### ##: ######::: ######:::'#######: ##::::::: ##:::::::: ##::
      ##. #: ##: ##...:::: ##...::::........: ##::::::: ##:::::::: ##::
      ##:.:: ##: ##::::::: ##:::::::::::::::: ##::: ##: ##:::::::: ##::
      ##:::: ##: ##::::::: ########::::::::::. ######:: ########:'####:
      ..:::::..::..::::::::........::::::::::::......:::........::....::
    `))   
  }

  waitASecond() {
    return new Promise(resolve => setTimeout(resolve, 900))
  } 
}

module.exports = CreateMfe
