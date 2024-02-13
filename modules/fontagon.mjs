import fs, { promises } from 'fs'
import os from 'os'
import { join, sep } from 'path'
import glob from 'glob'
import webfontsGenerator from 'webfonts-generator'

const prefixTempDir = 'for-fontagon'
const svgPattern = '/**/*.svg'
const removeTempDir = (tempDir) => {
  try {
    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true })
    }
  } catch (e) {
    console.error(e)
  }
}
const asyncWebfontsGenerator = (
  { dest = 'assets/fonts/icons/dist', cssTemplate, cssDest = 'icons.scss', fontName = 'icons', templateOptions },
  files,
) => {
  return new Promise((res, rej) => {
    webfontsGenerator(
      {
        files,
        dest,
        cssTemplate,
        cssDest: join(dest, cssDest),
        fontName,
        templateOptions,
      },
      function(error) {
        if (error) {
          rej(error)
        }

        res()
      },
    )
  })
}

export default async (options, nuxt) => {
  nuxt.hook('build:before', async () => {
    let tempDir

    try {
      tempDir = fs.mkdtempSync(join(os.tmpdir(), prefixTempDir))
      const paths = glob.sync(join(options.iconDir, svgPattern).replace(/\\/g, '/'))

      if (!paths.length) {
        return
      }

      for (const path of paths) {
        const tempPath = path.replace(options.iconDir + '/', '').replaceAll('/', '--')
        const dest = join(tempDir, tempPath)

        fs.copyFileSync(path, dest, fs.constants.COPYFILE_EXCL)
      }

      const files = fs.readdirSync(tempDir).map(file => join(tempDir, file))

      if (files.length) {
        const asyncFilter = async (arr, predicate) => {
          const results = await Promise.all(arr.map(predicate))

          return arr.filter((_v, index) => results[index])
        }

        await asyncWebfontsGenerator(options, await asyncFilter(files, async (file) => {
          const data = await promises.readFile(file, 'utf8')

          const hasImageTag = data.includes('<image')
          if (hasImageTag) {
            console.error(file)
          }

          return !hasImageTag
        }))
      }
    } catch (e) {
      console.error('Generate Error: ', e)
    }

    removeTempDir(tempDir)
  })
}
