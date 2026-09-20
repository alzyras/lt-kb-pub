import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

import style from "../styles/listPage.scss"
import { PageList, SortFn } from "../PageList"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { QuartzPluginData } from "../../plugins/vfile"
import { ComponentChildren } from "preact"
import { concatenateResources } from "../../util/resources"
import { trieFromAllFiles } from "../../util/ctx"
import { resolveRelative, FullSlug } from "../../util/path"
import { themeEntries } from "../../util/themeCatalog"
import ObjectDirectory from "../ObjectDirectory"
import objectDirectoryStyle from "../styles/objectDirectory.scss"
import { ArticleCatalog, editorialCatalogStyle } from "../EditorialCatalog"
import { objectCountLabel, objectTypes } from "../../util/objectTypes"
import { CollectionIntro, CollectionNav, PeriodDirectory, collectionStyle } from "../CollectionPage"
import { collectionCategories } from "../../util/collections"

const ObjectDirectoryComponent = ObjectDirectory()

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
    const { tree, fileData, allFiles } = props
    if (String(fileData.slug ?? "").replace(/\/index$/, "") === "straipsniai")
      return <ArticleCatalog {...props} />

    // The root object directory is a bespoke collection landing page. It is
    // synthetic (there is no Markdown index file), so it must not depend on
    // the folder trie having an `index` child node.
    if (String(fileData.slug ?? "").replace(/\/index$/, "") === "objektai") {
      return <ObjectDirectoryComponent {...props} />
    }
    if (String(fileData.slug ?? "").replace(/\/index$/, "") === "laikotarpiai") {
      return <PeriodDirectory {...props} />
    }

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
    const uniquePagesInFolder = [
      ...new Map(allPagesInFolder.map((page) => [page.slug, page])).values(),
    ]
    const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
    const classes = cssClasses.join(" ")
    const listProps = {
      ...props,
      sort: options.sort,
      allFiles: uniquePagesInFolder,
    }

    const content = (
      (tree as Root).children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath!, tree)
    ) as ComponentChildren
    const rawTitle = String(fileData.frontmatter?.title ?? folder.displayName)
    const title = folderTitle(fileData.slug, rawTitle)

    if (String(fileData.slug ?? "").replace(/\/index$/, "") === "temos") {
      const themes = themeEntries(allFiles)
      return (
        <div class="popover-hint bm-list-page collection-page theme-catalog-page">
          <CollectionIntro
            title="Temos"
            label="Istorijos gijos"
            description="Atraskite istoriją per bendras temas: nuo kasdienio gyvenimo iki valstybės ir kultūros."
            count={themes.length}
          />
          <CollectionNav {...props} />
          <div class="theme-catalog-grid">
            {themes.map((theme) => (
              <a class="theme-catalog-card" href={resolveRelative(fileData.slug!, theme.slug)}>
                <span class="theme-catalog-category">{theme.categoryLabel || theme.category}</span>
                <strong>{theme.title}</strong>
                {theme.description && <p>{theme.description}</p>}
                <small>{theme.objectCount.toLocaleString("lt-LT")} objektų</small>
              </a>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div class="popover-hint bm-list-page bm-folder-page collection-page">
        <CollectionIntro
          title={title}
          label="Lietuvos istorijos žinynas"
          description={
            collectionCategories.find(
              ([route]) => `objektai/${route}` === String(fileData.slug).replace(/\/index$/, ""),
            )?.[2] ?? "Tyrinėkite susijusią medžiagą ir jos šaltinius."
          }
          count={uniquePagesInFolder.length}
        />
        <CollectionNav {...props} />
        <article class={classes}>{content}</article>
        <div class="page-listing">
          <div>
            <PageList {...listProps} />
          </div>
        </div>
      </div>
    )
  }

  FolderContent.css = concatenateResources(
    style,
    PageList.css,
    objectDirectoryStyle,
    editorialCatalogStyle,
    collectionStyle,
    `
.theme-catalog-lead { max-width: 48rem; margin: 1rem 0 1.5rem; color: var(--darkgray); }
.theme-catalog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr)); gap: 0.85rem; }
.theme-catalog-card { display: flex; flex-direction: column; gap: 0.35rem; min-height: 9rem; padding: 1rem; border: 1px solid var(--lightgray); border-radius: 12px; background: var(--light); text-decoration: none; }
.theme-catalog-card:hover { border-color: var(--secondary); transform: translateY(-1px); }
.theme-catalog-card strong { color: var(--dark); font-size: 1.05rem; }
.theme-catalog-card p { margin: 0; color: var(--darkgray); font-size: 0.88rem; line-height: 1.4; }
.theme-catalog-card small { margin-top: auto; color: var(--secondary); font-weight: 650; }
.theme-catalog-category { color: var(--darkgray); font-size: 0.72rem; letter-spacing: 0.04em; text-transform: uppercase; }
`,
  )
  FolderContent.afterDOMLoaded = PageList.afterDOMLoaded
  return FolderContent
}) satisfies QuartzComponentConstructor
