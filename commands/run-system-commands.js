const { Command } = require('@adonisjs/ace')
const Execa = require('execa')

class RunSystemCommand extends Command {
  /**
   * The method signature describes the comannd, arguments and flags/aliases
   * The words flags and aliases mean the same thing in this context 😃
   */
  static get signature() {
    return `cli-infor`
  }

  /**
   * Use this description to provide additional details
   * about the command
   */
  static get description() {
    return 'Run this command to see versions'
  }

  /**
   * Handle the command
   *
   * @param {*} args   arguments object, contains only data if you’ve added arguments in the signature
   * @param {*} flags  an object of flags where each value is either "null" or "true".
   *                   Check the signature for available flags
   */
  async handle(args, flags) {
    try {
      // grab your Node.js version
      const node = await Execa('node', ['-v'])
      console.log(`Node.js: ${this.chalk.bold.green(node.stdout)}`)
      console.log(`Mfe-cli: ${this.chalk.bold.green('15.0.0')}`)
      console.log(`Angular: ${this.chalk.bold.green('15.0.0')}`)
      
      const npm = await Execa.shell('npm -v')
      console.log(`NPM: ${this.chalk.bold.green(npm.stdout)}`)
      
    } catch (err) {
      // catch any error and print the error message
      console.log(`❗️ Error: ${this.error(err.message)}`)
      
      process.exit(1)
    }
  }
}

module.exports = RunSystemCommand
