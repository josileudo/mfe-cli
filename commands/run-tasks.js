'use strict'
// const { exec } = require('child_process');

const { Command } = require('@adonisjs/ace')
const Listr = require('listr')

const templateClone = require('./create-template.js')
// const gitCheckoutCommand = `git clone --depth 1 --branch 15.0.x https://github.com/josileudo/create-mfe-app ${'repoName'}`;

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
    const tasks = new Listr([
      {
        title: `Creating ${'test-mfe'} project`,
        skip: () => {
          // returning a truthy value for "skip" will actually skip the task
          // a falsy value will not skip the task execution
          return skipFuel ? 'Skip fueling.' : false
        },
        task: () => templateClone()
      },
      {
        title: 'Replace files name',
        skip: () => false,
        task: () => this.waitASecond()
      },
      {
        title: `Installing dependencies for the 'test-mfe' project`,
        skip: skipPassengers,
        task: () => this.waitASecond()
      },
    ])

    await tasks.run()
  }

  waitASecond() {
    return new Promise(resolve => setTimeout(resolve, 3000))
  }
}

module.exports = RunTasks
