const inlineSourceMap =
  /\/\*[#@]\s*sourceMappingURL=data:application\/json(?:;charset=[^;,]+)?;base64,[A-Za-z0-9+/=]+\s*\*\//g

export function stripInlineCssSourceMaps(stylesheet: string): string {
  return stylesheet.replace(inlineSourceMap, "")
}
