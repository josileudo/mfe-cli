let answers;

const mfeCreateTopics = async() => {
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
}

const responseQuestions = () => {
  return answers;
}

module.exports = mfeCreateTopics;
module.exports = responseQuestions;