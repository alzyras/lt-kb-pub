import { QuartzTransformerPlugin } from "../types"
import {
  CitationMetadata,
  collectCitationMetadata,
  isObjectPage,
} from "../../util/citationFilter"

export const CitationFilterMetadata: QuartzTransformerPlugin = () => ({
  name: "CitationFilterMetadata",
  markdownPlugins() {
    return [
      () => {
        return (_tree, file) => {
          const relativePath = String(file.data.relativePath ?? "")
          if (!isObjectPage(relativePath)) {
            return
          }

          const markdown = String(file.value ?? "")
          const metadata = collectCitationMetadata(markdown)
          const frontmatter = file.data.frontmatter as
            | ({
                title: string
                citatu_skaicius?: number
                citatu_saltiniai?: string[]
                citatu_saltiniu_id?: string[]
              } & Record<string, unknown>)
            | undefined
          if (!frontmatter) {
            return
          }

          frontmatter.citatu_skaicius = metadata.quoteCount
          frontmatter.citatu_saltiniai = metadata.sourceTitles
          frontmatter.citatu_saltiniu_id = metadata.sourceIds
          file.data.citationFilter = metadata
        }
      },
    ]
  },
})

declare module "vfile" {
  interface DataMap {
    citationFilter?: CitationMetadata
  }
}
