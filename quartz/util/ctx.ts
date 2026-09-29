import { QuartzConfig } from "../cfg"
import { QuartzPluginData } from "../plugins/vfile"
import { FileTrieNode } from "./fileTrie"
import { FilePath, FullSlug } from "./path"
import { RelationTargetMap } from "./relations"

export interface Argv {
  directory: string
  verbose: boolean
  output: string
  serve: boolean
  watch: boolean
  port: number
  wsPort: number
  remoteDevHost?: string
  concurrency?: number
}

export type BuildTimeTrieData = QuartzPluginData & {
  slug: string
  title: string
  filePath: string
}

export interface BuildCtx {
  buildId: string
  argv: Argv
  cfg: QuartzConfig
  allSlugs: FullSlug[]
  allFiles: FilePath[]
  slugMap: Record<string, FullSlug>
  relationTargetMap?: RelationTargetMap
  /** Relation-index lookups made while transforming the current Markdown file. */
  parseCacheDependencies?: Map<string, string>
  /** Output paths written through Quartz helpers during a one-shot build. */
  emittedFiles?: Set<FilePath>
  /** Slugs selected by a one-shot emitter that still needs the full content index. */
  incrementalSelectedSlugs?: Set<string>
  /** Object routes selected for a media-catalog-stable incremental gallery refresh. */
  incrementalGalleryObjectSlugs?: Set<string>
  /** Pages whose rendered HTML depends on a changed page's backlinks/transclusion. */
  incrementalPageEvents?: import("../plugins/types").ChangeEvent[]
  /** Output paths removed while replacing a changed page's generated assets. */
  deletedFiles?: Set<FilePath>
  trie?: FileTrieNode<BuildTimeTrieData>
  incremental: boolean
}

export function trieFromAllFiles(allFiles: QuartzPluginData[]): FileTrieNode<BuildTimeTrieData> {
  const trie = new FileTrieNode<BuildTimeTrieData>([])
  allFiles.forEach((file) => {
    if (file.frontmatter) {
      trie.add({
        ...file,
        slug: file.slug!,
        title: file.frontmatter.title,
        filePath: file.filePath!,
      })
    }
  })

  return trie
}

export type WorkerSerializableBuildCtx = Omit<BuildCtx, "cfg" | "trie">
