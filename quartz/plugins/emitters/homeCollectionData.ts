import { QuartzEmitterPlugin } from "../types"
import { FullSlug } from "../../util/path"
import { write } from "./helpers"
import { buildHomeCollectionSpotlight } from "../../components/HomeCollection"

/** The home page reads this only after it is interactive; it must not inflate first HTML. */
export const HomeCollectionData: QuartzEmitterPlugin = () => ({
  name: "HomeCollectionData",
  async *emit(ctx, content) {
    const spotlight = buildHomeCollectionSpotlight(content.map(([, file]) => file.data))
    yield write({
      ctx,
      content: JSON.stringify(spotlight),
      slug: "static/collectionSpotlight" as FullSlug,
      ext: ".json",
    })
  },
  async *partialEmit() {},
})
