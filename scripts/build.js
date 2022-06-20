import esbuild from 'esbuild'
import path from 'path'
import zlib from 'zlib'
import { createWriteStream, mkdirSync } from 'fs'
import { readFile, writeFile, rm } from 'fs/promises'
import { execSync } from 'child_process'
import { promisify } from 'util'
import archiver from 'archiver'
import { sassPlugin } from 'esbuild-sass-plugin'

const brotliCompress = promisify(zlib.brotliCompress)

build().catch((e) => {
  throw e
})

async function build() {
  await rm('./dist', { recursive: true, force: true })

  for (const format of ['esm' /*, 'cjs'*/]) {
    const outfile = `./dist/js-cockpit.${format}.js`

    await esbuild.build({
      entryPoints: ['./src/main/js-cockpit.ts'],
      bundle: true,
      outfile,
      tsconfig: './tsconfig.build.json',
      target: 'esnext',
      minify: true,
      sourcemap: true,
      format,
      loader: { '.svg': 'dataurl' /*, '.css': 'text'*/ },
      external: [
        'lit',
        '@floating-ui/dom',
        '@shoelace-style/localize',
        '@shoelace-style/shoelace/*'
      ],
      define: {
        'process.env.NODE_ENV': '"production"'
      },

      plugins: [
        sassPlugin({
          type: 'css-text',
          outputStyle: 'compressed'
        })
      ]
    })

    await createBrotliFile(outfile, outfile + '.br')
  }

  execSync(
    'tsc -p tsconfig.build.json --emitDeclarationOnly -d --declarationDir dist/types',
    {
      stdio: 'inherit'
    }
  )

  await zipDirectory('.', './dist/source/source.zip', '*.*', [
    'src',
    'scripts',
    '.storybook'
  ])
}
// === helpers =======================================================

async function createBrotliFile(source, target) {
  const content = await readFile(source, 'utf-8')

  const compressedContent = await brotliCompress(content, {
    params: {
      [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT
    }
  })

  await writeFile(target, compressedContent)
}

function zipDirectory(source, out, fileGlob = '*.*', directories = []) {
  const archive = archiver('zip', { zlib: { level: 9 } })
  const stream = createWriteStream(out)

  archive.glob(fileGlob)
  directories.forEach((dir) => archive.directory(`${source}/${dir}/`))

  return new Promise((resolve, reject) => {
    mkdirSync(path.dirname(out), { recursive: true })
    archive.on('error', (err) => reject(err)).pipe(stream)
    stream.on('close', () => resolve())
    archive.finalize()
  })
}
