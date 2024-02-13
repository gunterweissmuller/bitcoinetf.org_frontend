import { join } from 'path'
import fs from 'fs'
import glob from 'glob'

const EOL = '\n' //lf

const ext = '.svg'
const pattern = '/**/*' + ext

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const convertToEnumValue = (iconDir, path) => {
  return path
    .replace(iconDir + '/', '')
    .replace(ext, '')
    .replaceAll('/', '--')
}

const convertToEnumKey = (enumValue) => {
  return enumValue
    .split('-')
    .map((word) => capitalizeFirstLetter(word))
    .join('')
}

export default async ({ iconDir, outputFile }, nuxt) => {
  nuxt.hook('build:before', async () => {
    if (!(iconDir && outputFile)) {
      return
    }

    const paths = glob.sync(join(iconDir, pattern).replace(/\\/g, '/'))
    let filesIconTemplate = 'export const files = {' + EOL
    let enumIconTemplate = '// eslint-disable-next-line no-shadow' + EOL

    enumIconTemplate += 'export enum Icon {' + EOL

    for (const path of paths) {
      const enumValue = convertToEnumValue(iconDir, path)
      const enumKey = convertToEnumKey(enumValue)

      enumIconTemplate += `  ${enumKey} = '${enumValue}',` + EOL
      filesIconTemplate += `  [Icon.${enumKey}]: '${path.replace('public', '')}',` + EOL
    }

    enumIconTemplate += '}' + EOL
    filesIconTemplate += '}' + EOL

    const data = enumIconTemplate + filesIconTemplate

    fs.writeFile(outputFile, data, 'utf8', function(err) {
      if (err) throw err
    })
  })
}
