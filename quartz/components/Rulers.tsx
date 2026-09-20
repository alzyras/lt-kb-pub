import { loadRulers, rulersForEra, rulerEras, rulerExhibitionSlug, museumPlaces, type Ruler } from "../util/rulers"
import { mediaImageUrl, objectMediaSet, displayCaption, mediaPosition } from "../util/objectMedia"
import type { ExhibitionManifest } from "../util/exhibitions"
import { QuartzComponentProps } from "./types"
import { slugifyFilePath } from "../util/path"

function Portrait({ ruler, full = false }: { ruler: Ruler; full?: boolean }) {
  return <img src={mediaImageUrl(ruler.media)} alt={ruler.imageNote || ruler.name} width={ruler.media.width || 600} height={ruler.media.height || 800} loading="lazy" decoding="async" style={`--portrait-position:${mediaPosition(ruler.media)}`} class={ruler.contextualImage ? "ruler-context-image" : undefined} data-ruler-portrait={ruler.id} data-full-image={full || undefined} />
}

export function RulerTracks() {
  return <section class="museum-section museum-rulers" aria-labelledby="rulers-title">
    <div class="museum-section-header"><div><p class="museum-eyebrow">Valstybė ir jos valdovai</p><h2 id="rulers-title">Veidai, už kurių — šimtmečiai.</h2><p>Lietuvos didieji kunigaikščiai ir Abiejų Tautų Respublikos valdovai. Keliaukite laiku, atraskite jų istorijas ir išlikusius atvaizdus.</p></div><a class="museum-text-link" href={`/${rulerExhibitionSlug}`}>Visų valdovų paroda <span aria-hidden="true">↗</span></a></div>
    {rulerEras.map((era) => <div class="ruler-era" data-ruler-era={era.id}>
      <div class="ruler-era-heading"><h3>{era.title}</h3><span>{era.dates}</span><div class="ruler-controls"><button type="button" data-ruler-scroll="-1" aria-label={`${era.title}: ankstesni valdovai`}>←</button><button type="button" data-ruler-scroll="1" aria-label={`${era.title}: kiti valdovai`}>→</button></div></div>
      <div class="ruler-track" tabindex={0} role="region" aria-label={`${era.title}: valdovų chronologija`}>
        {rulersForEra(era.id).map((ruler) => <a class="ruler-card internal" href={`/${ruler.objectSlug}`} data-ruler-id={ruler.id}><div class="ruler-image"><Portrait ruler={ruler} /></div><div class="ruler-years">{ruler.years}</div><strong>{ruler.name}</strong><small>{ruler.notice ? "Datos ir kontekstas — parodoje" : era.id === "ldk" ? "Lietuvos valdovas" : "Respublikos valdovas"}</small></a>)}
      </div>
    </div>)}
  </section>
}

export function MuseumPlaces({ allFiles }: Pick<QuartzComponentProps, "allFiles">) {
  const places = museumPlaces.flatMap(([name, description]) => {
    const slug = slugifyFilePath(`objektai/vietos/${name}.md` as any)
    const file = allFiles.find((page) => page.slug === slug)
    if (!file) return []
    const images = objectMediaSet(file.frontmatter as any)
    const media = images.primary ?? images.direct[0] ?? images.all[0]
    return [{ name, description, slug, media }]
  })
  return <section class="museum-section" aria-labelledby="places-title"><div class="museum-section-header"><div><p class="museum-eyebrow">Istorijos erdvės</p><h2 id="places-title">Vietos, kurios pasakoja.</h2></div><a href="/objektai/vietos" class="museum-text-link">Visos vietos ↗</a></div><div class="museum-places">{places.map((place) => <a class="museum-place internal" href={`/${place.slug}`}>{place.media && <img src={mediaImageUrl(place.media)} alt={displayCaption(place.media)} width={600} height={450} loading="lazy" decoding="async" />}<h3>{place.name}</h3><p>{place.description}</p></a>)}</div></section>
}

export function MuseumReading() {
  return <section class="museum-section" aria-labelledby="reading-title"><p class="museum-eyebrow">Skaityti ir atrasti</p><h2 id="reading-title">Istorija iš arčiau.</h2><div class="museum-reading-grid">
    <a href="/parodos/valancius-nuo-sakyklos-iki-skaitytojo"><span class="museum-eyebrow">Skaitmeninė paroda</span><h3>Valančiaus blaivybės brolijos</h3><p>Dokumentai, atvaizdai ir liudijimai apie vyskupą, gyvenusį imperijos ir vietinės bendruomenės sandūroje.</p><span class="museum-text-link">Atrasti parodą ↗</span></a>
    <a href="/straipsniai/motiejus-valancius-ir-rusijos-imperija"><span class="museum-eyebrow">Straipsnis</span><h3>Valančius ir caro valdžia</h3><p>Bažnyčia, valdžia ir visuomenė XIX amžiaus Lietuvoje.</p><span class="museum-text-link">Skaityti ↗</span></a>
    <a href="/straipsniai/kaip-valancius-keite-kasdienybe"><span class="museum-eyebrow">Straipsnis</span><h3>Kodėl kaimas gėrė ir kaip Valančius ragino negerti</h3><p>Blaivybė, skaitymas ir bendruomenės gyvenimo pokyčiai.</p><span class="museum-text-link">Skaityti ↗</span></a>
  </div></section>
}

export function RulersExhibition({ exhibition }: { exhibition: ExhibitionManifest }) {
  const rulers = loadRulers()
  const items = new Map(exhibition.sections.flatMap((section) => section.items.map((item) => [item.rulerId, item] as const)))
  return <main class="rulers-exhibition" data-exhibition-id={exhibition.exhibitionId}>
    <header class="rulers-exhibition-hero"><img src={mediaImageUrl(exhibition.hero)} alt="" width={1600} height={1000} fetchPriority="high" /><div><p class="museum-eyebrow">Skaitmeninė paroda · XIII–XVIII amžiai</p><h1>{exhibition.title}</h1><p>{exhibition.description}</p><a class="museum-text-link" href="#ldk">Pradėti kelionę ↓</a></div></header>
    <nav class="rulers-navigation" aria-label="Parodos chronologija"><a href="#ldk">LDK</a><a href="#atr">ATR</a><label class="sr-only" for="ruler-jump">Pasirinkti valdovą</label><select id="ruler-jump" data-ruler-jump><option value="">Pereiti prie valdovo</option>{rulers.map((ruler) => <option value={ruler.id}>{ruler.name}</option>)}</select><a href="/parodos">Visos parodos ↗</a></nav>
    <section class="museum-section exhibition-chronology" aria-label="Visų valdymų chronologija"><p class="museum-eyebrow">Valdymų chronologija</p><p>Pasirinkite valdovą ir pereikite tiesiai prie jo istorijos. Persidengiantys ir pakartotiniai valdymai palikti matomi.</p><ol>{rulers.flatMap((ruler) => ruler.reigns.map((reign) => ({ ruler, reign }))).sort((a,b) => a.reign.start-b.reign.start).map(({ruler,reign}) => <li><a href={`#${ruler.id}`}><span>{reign.start}–{reign.end}</span><strong>{ruler.name}</strong>{ruler.notice && <small>Datos su pastaba</small>}</a></li>)}</ol></section>
    {rulerEras.map((era) => <section class="museum-section" id={era.id}><header class="rulers-era-intro"><p class="museum-eyebrow">{era.dates}</p><h2>{era.title}</h2><p>{era.introduction}</p>{era.id === "atr" && <p class="ruler-note">Pirmasis ATR valdovas — <a href="#zygimantas-augustas">Žygimantas Augustas</a>. Jo pasakojimas užbaigia LDK skyrių ir jungia abi epochas.</p>}</header>
      {rulers.filter((ruler) => ruler.eras[0] === era.id).map((ruler) => {
        const item = items.get(ruler.id)
        return <article class="ruler-story" id={ruler.id} data-ruler-id={ruler.id}><figure><a href={ruler.media.canonicalUrl || `/${ruler.objectSlug}/galerija`}><Portrait ruler={ruler} full /></a><figcaption>{ruler.imageNote}<br />{ruler.media.creator && <span>{ruler.media.creator}. </span>}{ruler.media.license && <span>{ruler.media.license}. </span>}<a href={ruler.media.canonicalUrl}>Atvaizdo šaltinis ↗</a></figcaption></figure><div><p class="museum-eyebrow">{era.id === "ldk" ? "Lietuvos valdovai" : "Respublikos valdovai"}</p><h3>{ruler.name}</h3><p class="ruler-reign">Valdymas · {ruler.years}</p><div class="ruler-narrative">{(item?.narrativeParagraphs ?? [item?.descriptionLt || ""]).map((paragraph) => <p>{paragraph}</p>)}</div>{ruler.notice && <p class="ruler-note">{ruler.notice}</p>}<nav class="ruler-sources" aria-label={`${ruler.name}: pasakojimo šaltiniai`}>{ruler.sources.map((source) => <a href={source.url}>{source.title} ↗</a>)}</nav><a class="museum-text-link internal" href={`/${ruler.objectSlug}`}>Plačiau apie valdovą ↗</a></div></article>
      })}
    </section>)}
  </main>
}
