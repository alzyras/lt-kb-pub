import * as esbuild from "esbuild"
import { sassPlugin } from "esbuild-sass-plugin"
import path from "node:path"
const output = path.resolve(".quartz-cache/object-preview.mjs")
await esbuild.build({
  entryPoints: ["scripts/preview_object_page.tsx"],
  outfile: output,
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  jsx: "automatic",
  jsxImportSource: "preact",
  plugins: [
    sassPlugin({ type: "css-text" }),
    {
      name: "inline",
      setup(build) {
        build.onLoad({ filter: /\.inline\.(ts|js)$/ }, async (args) => {
          const result = await esbuild.build({
            entryPoints: [args.path],
            bundle: true,
            write: false,
            platform: "browser",
            format: "iife",
            minify: true,
          })
          return { contents: result.outputFiles[0].text, loader: "text" }
        })
      },
    },
  ],
})
await import(output)
