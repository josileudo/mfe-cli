const extra = require('fs-extra');

const removeFilesRequired = async (src, file) => {
  try {
    await extra.remove(`${src}/${file}`)
  } catch (err) {
    console.error(err)
  }
}

module.exports = removeFilesRequired;