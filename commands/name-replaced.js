const fs = require('fs');
const path = require('path');

const files = [
  'src/app/app.component.ts',
  'src/app/app.component.spec.ts',
  'src/app/app.module.ts',
  'package.json',
  'angular.json',
  'bundle-mfe.js',
  'src/index.html',
  'README.md'
]
const extensions = ['scss', 'css', 'sass', 'less'];

const updateNameInFiles = (projectName) => {
  const oldName = 'create-mfe-app';
  const templatePath = path.join(process.cwd(), projectName);

  for(const file of files) {    
    replaceRequired(templatePath, file, oldName, projectName);
  }
}

const choiceStyleExtension = (style, projectName) => {
  let res = extensions.filter((extension) => extension === style);
  const templatePath = path.join(process.cwd(), projectName);

  res.map(type => {
    if(type)  {
      const defExt = 'scss'
      const oldExt = path.join(templatePath, 'src', `styles.${defExt}`);
      const newExt = path.join(templatePath, 'src', `styles.${type}`);

      replaceRequired(templatePath, 'angular.json', defExt, type)
      
      fs.rename(oldExt, newExt, (err) => {
        if(err) console.error(`${'x1b[31m'} Extensions error!!!!`);
      })
    }
    return;
  })
}

const replaceRequired = (templatePath, file, oldName, newName) => {
  const filePath = path.join(templatePath, file);
  let fileContent = fs.readFileSync(filePath, 'utf-8');

  fileContent = fileContent.replace(new RegExp(oldName, 'g'), newName);

  fs.writeFileSync(filePath, fileContent, 'utf-8');
}

module.exports = { updateNameInFiles, choiceStyleExtension };
