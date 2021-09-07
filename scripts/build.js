import esbuild from 'esbuild'
import del from 'del'
import { execSync } from 'child_process'

try {
  del.sync('./dist')

  for (const format of ['esm', 'cjs']) {
    const outfile = `./dist/js-cockpit.${format}.js`

    esbuild
      .build({
        entryPoints: ['./src/main/js-cockpit.ts'],
        bundle: true,
        outfile,
        target: 'es2020',
        minify: true,
        format,
        loader: { '.svg': 'dataurl', '.css': 'text' },
        external: ['lit-html', 'js-element', '@shoelace-style/shoelace'],
        define: {
          'process.env.NODE_ENV': '"production"'
        }
      })
      .catch((e) => {
        console.error('Error:', e)
        process.exit(1)
      })
  }
  /*
execSync('tsc -p ./tsconfig.dist.json -d --emitDeclarationOnly --declarationDir dist/types', {
  stdio: 'inherit'
})
*/
} catch (e) {
  console.error('Error:', e)
  throw e
}
