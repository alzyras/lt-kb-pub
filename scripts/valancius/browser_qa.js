async (page) => {
  const origin=await page.evaluate(()=>location.origin)
  if (!/^http:\/\/127\.0\.0\.1:809[89]$/.test(origin)) throw new Error('Local review only')
  const root = '/Users/tomas/Documents/important/lt/lt-kb-pub-valancius/scripts/valancius/review'
  const pages = [
    ['article-b', 'straipsniai/kaip-valancius-keite-kasdienybe'],
    ['exhibition-b', 'parodos/valancius-nuo-sakyklos-iki-skaitytojo'],
    ['article-a', 'straipsniai/motiejus-valancius-ir-rusijos-imperija'],
    ['exhibition-a', 'parodos/valancius-laiskai-imperijos-seselyje'],
  ]
  const results = []
  for (const [name, slug] of pages) {
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({width, height: width === 390 ? 844 : 1000})
      const response = await page.goto(origin+'/' + slug)
      await page.evaluate(() => document.fonts.ready)
      const contentImages = page.locator('article img, .exhibition-page img')
      for (let i = 0; i < await contentImages.count(); i++) {
        const image = contentImages.nth(i)
        await image.scrollIntoViewIfNeeded()
        await image.evaluate(async img => { await img.decode().catch(() => {}) })
      }
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => {
          localStorage.setItem('theme', theme)
          document.documentElement.setAttribute('saved-theme', theme)
          document.dispatchEvent(new CustomEvent('themechange', {detail: {theme}}))
          window.scrollTo({top: 0, behavior: 'instant'})
        }, theme)
        const report = await page.evaluate(() => {
          const checked = [...document.querySelectorAll('h1, .exhibition-item, .exhibition-hero-content, .article-figure')]
          const overflow = checked.filter(e => {const r=e.getBoundingClientRect();return r.width && (r.left < -1 || r.right > innerWidth+1)}).map(e=>({class:e.className, text:e.textContent.slice(0,90)}))
          return {title:document.title,h1:document.querySelector('h1')?.textContent,overflow,
            brokenImages:[...document.querySelectorAll('article img, .exhibition-page img')].filter(i=>!i.complete || !i.naturalWidth).map(i=>i.getAttribute('src')),
            documentWidth:document.documentElement.scrollWidth, viewport:innerWidth,
            noindex:document.querySelector('meta[name="robots"]')?.content}
        })
        const screenshot = `${root}/b-revision-${name}-${width}-${theme}.png`
        await page.screenshot({path:screenshot})
        if (name.endsWith('-b') && theme==='light' && width!==768) {
          // Chromium skips off-screen img painting under content-visibility:auto.
          // Disable that optimization only while capturing a full-page review image.
          const captureStyle=await page.addStyleTag({content:'img { content-visibility: visible !important; }'})
          await page.screenshot({path:`${root}/b-revision-${name}-${width}-full.png`,fullPage:true})
          await captureStyle.evaluate(e=>e.remove())
        }
        results.push({name,slug,width,theme,status:response.status(),screenshot,...report})
      }
    }
  }
  return {cases:results.length,results,failures:results.filter(r=>r.status!==200 || r.overflow.length || r.brokenImages.length || r.documentWidth>r.viewport+1)}
}
