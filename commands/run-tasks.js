'use strict'
// const { exec } = require('child_process');

const { Command } = require('@adonisjs/ace')
const Listr = require('listr')

const templateClone = require('./create-template.js')
const runCommand = require('./install-files.js');
const removeFilesRequired = require('./remove-files.js')
const { updateNameInFiles, choiceStyleExtension} = require('./name-replaced');

// const gitCheckoutCommand = `git clone --depth 1 --branch 15.0.x https://github.com/josileudo/create-mfe-app ${'repoName'}`;
let answers;
class RunTasks extends Command { 
  /**
   * The method signature describes the comannd, arguments and flags/aliases
   * The words flags and aliases mean the same thing in this context 😃
   */
  static get signature() {
    return `run-tasks
    { -f, --skip-fuel: Skip fueling the rocket }
    { -p, --skip-passengers: Skip boarding passengers }
    { -c, --captain=@value: Specify the captain's name }`
  }

  /**
   * Use this description to provide additional details
   * about the command
   */
  static get description() {
    return 'Run a list of tasks.'
  }

  /**
   * Handle the command
   *
   * @param {*} args   arguments object, contains only data if you’ve added arguments in the signature
   * @param {*} flags  an object of flags where each value is either "null" or "true".
   *                   Check the signature for available flags
   */

  async handle(args, { skipFuel, skipPassengers, captain }) {
    // deployment task list
    try {
      const { createPromptModule } = await import('inquirer'); 
      const prompt = createPromptModule();
      answers = await prompt([
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
    } catch(err) {
      console.error(`${'\x1b[31m'}An error ocurred: `, err)
      process.exit(1);
    }
  

    const tasks = new Listr([
      {
        title: `Creating ${answers.projectName} project`,
        skip: () => {
          // returning a truthy value for "skip" will actually skip the task
          // a falsy value will not skip the task execution
          return skipFuel ? 'Skip fueling.' : false
        },
        task: () => templateClone(answers.projectName)
      },
      {
        title: 'Replace files name',
        skip: () => false,
        task: () => updateNameInFiles(answers.projectName)
      },
      {
        title: 'Replace extension style',
        skip: () => false,
        task: () => choiceStyleExtension(answers.style, answers.projectName)
      },
      {
        title: 'Remove .git file',
        skip: () => false,
        task: () => removeFilesRequired(answers.projectName, '.git')
      },
      {
        title: `Installing dependencies for the ${answers.projectName} project`,
        skip: skipPassengers,
        task: () => runCommand(`cd ${answers.projectName} `)
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
    // console.log(this.chalk.bold.bgBlue('Project already for use'))
  }

  waitASecond() {
    return new Promise(resolve => setTimeout(resolve, 3000))
  } 
}

module.exports = RunTasks
