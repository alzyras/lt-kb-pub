import { transform } from "lightningcss"

/** Validate generated CSS without formatting or rewriting the build artifact. */
export function validateSiteStylesheet(css: string, filename = "index.css"): void {
  transform({ filename, code: Buffer.from(css), errorRecovery: false })

  for (const property of ["--bm-font", "--ui-page", "--bodyFont", "--light", "--secondary"]) {
    if (!new RegExp(`${property}\\s*:`).test(css)) {
      throw new Error(`${filename} is missing the global theme property ${property}`)
    }
  }
}
