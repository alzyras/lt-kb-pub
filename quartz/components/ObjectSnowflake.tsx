import { QuartzComponentProps } from "./types"
import { objectShellFile } from "./ObjectPageShell"
import { objectDetailEvidenceFromFile } from "../util/objectDetail"
import { objectRelationInputs } from "../util/objectRelations"
import { cleanText } from "../util/objectMedia"
import { slugifyFilePath } from "../util/path"
import { graphVisualRegistry } from "../util/graphVisualRegistry"

const fileIndexes = new WeakMap<QuartzComponentProps["allFiles"], Map<string, QuartzComponentProps["fileData"]>>()
function labelLines(title: string): string[] {
  const lines: string[] = []
  for (const word of title.split(/\s+/)) {
    const last = lines.length - 1
    if (last >= 0 && lines[last].length + word.length < 37) lines[last] += ` ${word}`
    else lines.push(word)
  }
  return lines
}

/** A stable, accessible view of the object's actual direct relations. */
export function ObjectSnowflake({ props }: { props: QuartzComponentProps }) {
  const file = objectShellFile(props)
  const fm = (file.frontmatter ?? {}) as Record<string, unknown>
  const evidence = objectDetailEvidenceFromFile(String(file.filePath || ""))
  let files = fileIndexes.get(props.allFiles)
  if (!files) {
    files = new Map(props.allFiles.map((page) => [String(page.slug).replace(/\/index$/, ""), page]))
    fileIndexes.set(props.allFiles, files)
  }
  const current = String(file.slug).replace(/\/index$/, "")
  const seen = new Set([current])
  const nodes = objectRelationInputs(fm, evidence).flatMap((row) => {
    const slug = slugifyFilePath(`${row.target.replace(/\.md$/, "")}.md` as any).replace(/\/index$/, "")
    const target = files!.get(slug)
    if (!target || seen.has(slug)) return []
    seen.add(slug)
    return [{ slug, title: cleanText(target.frontmatter?.canonical_name || target.frontmatter?.pavadinimas || target.frontmatter?.title), type: cleanText(target.frontmatter?.tipas) }]
  }).sort((a, b) => a.type.localeCompare(b.type) || a.title.localeCompare(b.title, "lt"))
  if (!nodes.length) return null
  const title = cleanText(fm.canonical_name || fm.pavadinimas || fm.title).replace(/\s*\([^)]*\)$/, "")
  const typeOrder = Object.keys(graphVisualRegistry.typeLabels)
  const groups = [...new Set(nodes.map(node => node.type))].sort((a,b) => typeOrder.indexOf(a)-typeOrder.indexOf(b))
    .map(type => ({type, nodes: nodes.filter(node => node.type === type)}))
  const totalWeight = groups.reduce((sum, group) => sum + Math.sqrt(group.nodes.length), 0)
  const gap = groups.length > 1 ? .15 : 0
  let angleStart = -Math.PI / 2
  const points = groups.flatMap(group => {
    const span = (Math.PI * 2 - gap * groups.length) * Math.sqrt(group.nodes.length) / totalWeight
    const color = `#${(graphVisualRegistry.typeColors[group.type as keyof typeof graphVisualRegistry.typeColors] ?? graphVisualRegistry.fallbackNode).toString(16).padStart(6,"0")}`
    const result = group.nodes.map((node, index) => {
      // Stable sectors keep each type together; all real neighbours stay visible.
      const fraction = ((index + .5) * .61803398875) % 1
      const angle = angleStart + span * (.06 + .88 * fraction)
      const radius = 78 + 194 * Math.sqrt((index + .5) / group.nodes.length)
      return {...node, color, x: Math.cos(angle)*radius, y: Math.sin(angle)*radius, lines: labelLines(node.title)}
    })
    angleStart += span + gap
    return result
  })
  return (
    <section id="rysiu-snaige" class="object-snowflake" data-neighbour-count={nodes.length} aria-label={`${title}: susiję objektai`}>
      <svg class="snowflake-scene" viewBox="-310 -310 620 620" role="group" aria-label="Ryšių žemėlapis">
        <g class="snowflake-edges" aria-hidden="true">
          {points.map((point) => <path style={`--node-color:${point.color}`} d={`M 0 0 Q ${point.x * .12 - point.y * .08} ${point.y * .12 + point.x * .08} ${point.x} ${point.y}`} />)}
        </g>
        {points.map((point) => (
          <a class="snowflake-node" href={`/${point.slug}`} aria-label={point.title} data-node-type={point.type} style={`--node-color:${point.color}`}>
            <circle class="snowflake-hit" cx={point.x} cy={point.y} r="12" />
            <circle class="snowflake-dot" cx={point.x} cy={point.y} r={nodes.length > 500 ? 2.8 : 4.5} />
            <text x={point.x} y={Math.max(-288, point.y - 12 - (point.lines.length - 1) * 14)} text-anchor={point.x > 120 ? "end" : point.x < -120 ? "start" : "middle"}>
              {point.lines.map((line, i) => <tspan x={point.x} dy={i ? "1.2em" : 0}>{line}</tspan>)}
            </text>
          </a>
        ))}
        <a class="snowflake-center" href={`/zemelapis/?focus=${encodeURIComponent(current)}&depth=1&panel=details`} aria-label={`Atidaryti visą ${title} ryšių žemėlapį`}>
          <circle r="27" />
          <text y="47" text-anchor="middle">{labelLines(title).map((line, i) => <tspan x="0" dy={i ? "1.2em" : 0}>{line}</tspan>)}</text>
        </a>
      </svg>
    </section>
  )
}
