import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

import style from "../styles/listPage.scss"
import { PageList, SortFn } from "../PageList"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { i18n } from "../../i18n"
import { QuartzPluginData } from "../../plugins/vfile"
import { ComponentChildren } from "preact"
import { concatenateResources } from "../../util/resources"
import { trieFromAllFiles } from "../../util/ctx"

interface FolderContentOptions {
  /**
   * Whether to display number of folders
   */
  showFolderCount: boolean
  showSubfolders: boolean
  sort?: SortFn
}

const defaultOptions: FolderContentOptions = {
  showFolderCount: true,
  showSubfolders: true,
}

function folderLabel(slug: string | undefined, fallback: string): string {
  const value = String(slug ?? "").replace(/\/index$/, "")
  if (value === "objektai") return "Objektų indeksas"
  if (value === "temos") return "Temų indeksas"
  if (value === "laikotarpiai") return "Laikotarpių indeksas"
  if (value.startsWith("objektai/")) return "Objektų tipas"
  return fallback
}

function folderTitle(slug: string | undefined, fallback: string): string {
  const value = String(slug ?? "").replace(/\/index$/, "")
  const labels: Record<string, string> = {
    objektai: "Objektai",
    "objektai/asmenys": "Asmenys",
    "objektai/autoriai": "Autoriai",
    "objektai/ivykiai": "Įvykiai",
    "objektai/vietos": "Vietos",
    "objektai/grupes": "Grupės",
    "objektai/daiktai": "Daiktai",
    "objektai/paprociai": "Papročiai",
    "objektai/posakiai": "Posakiai",
    "objektai/zodynas": "Žodynas",
    "objektai/saltiniai": "Šaltiniai",
    temos: "Temos",
    laikotarpiai: "Laikotarpiai",
  }

  return labels[value] ?? fallback.replace(/^Aplankas:\s*/i, "")
}

export default ((opts?: Partial<FolderContentOptions>) => {
  const options: FolderContentOptions = { ...defaultOptions, ...opts }

  const FolderContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles, cfg } = props

    const trie = (props.ctx.trie ??= trieFromAllFiles(allFiles))
    const folder = trie.findNode(fileData.slug!.split("/"))
    if (!folder) {
      return null
    }

    const allPagesInFolder: QuartzPluginData[] =
      folder.children
        .map((node) => {
          // regular file, proceed
          if (node.data) {
            return node.data
          }

          if (node.isFolder && options.showSubfolders) {
            // folders that dont have data need synthetic files
            const getMostRecentDates = (): QuartzPluginData["dates"] => {
              let maybeDates: QuartzPluginData["dates"] | undefined = undefined
              for (const child of node.children) {
                if (child.data?.dates) {
                  // compare all dates and assign to maybeDates if its more recent or its not set
                  if (!maybeDates) {
                    maybeDates = { ...child.data.dates }
                  } else {
                    if (child.data.dates.created > maybeDates.created) {
                      maybeDates.created = child.data.dates.created
                    }

                    if (child.data.dates.modified > maybeDates.modified) {
                      maybeDates.modified = child.data.dates.modified
                    }

                    if (child.data.dates.published > maybeDates.published) {
                      maybeDates.published = child.data.dates.published
                    }
                  }
                }
              }
              return (
                maybeDates ?? {
                  created: new Date(),
                  modified: new Date(),
                  published: new Date(),
                }
              )
            }

            return {
              slug: node.slug,
              dates: getMostRecentDates(),
              frontmatter: {
                title: folderTitle(node.slug, node.displayName),
                tags: [],
                tipas: "aplankas",
              },
            }
          }
        })
        .filter((page) => page !== undefined) ?? []
    const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
    const classes = cssClasses.join(" ")
    const listProps = {
      ...props,
      sort: options.sort,
      allFiles: allPagesInFolder,
    }

    const content = (
      (tree as Root).children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath!, tree)
    ) as ComponentChildren
    const rawTitle = String(fileData.frontmatter?.title ?? folder.displayName)
    const title = folderTitle(fileData.slug, rawTitle)
    const folderType = folderLabel(fileData.slug, title)
    const folderCount = allPagesInFolder.length.toLocaleString("lt-LT")

    return (
      <div class="popover-hint bm-list-page bm-folder-page">
        <section class="bm-list-intro" aria-label="Puslapio santrauka">
          <div>
            <p>{folderType}</p>
            <h2>{title}</h2>
          </div>
          <dl>
            <div>
              <dt>Įrašai</dt>
              <dd>{folderCount}</dd>
            </div>
          </dl>
        </section>
        <article class={classes}>{content}</article>
        <div class="page-listing">
          {options.showFolderCount && (
            <p>
              {i18n(cfg.locale).pages.folderContent.itemsUnderFolder({
                count: allPagesInFolder.length,
              })}
            </p>
          )}
          <div>
            <PageList {...listProps} />
          </div>
        </div>
      </div>
    )
  }

  FolderContent.css = concatenateResources(style, PageList.css)
  FolderContent.afterDOMLoaded = PageList.afterDOMLoaded
  return FolderContent
}) satisfies QuartzComponentConstructor
