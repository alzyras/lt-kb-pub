async (page) => {
  const results=[]
  for(const slug of ['valancius-nuo-sakyklos-iki-skaitytojo','valancius-laiskai-imperijos-seselyje']) {
    for(const width of [390,1440]) {
      await page.setViewportSize({width,height:900})
      await page.goto(`http://127.0.0.1:8098/parodos/${slug}`)
      const first=page.locator('.exhibition-item-image').first()
      await first.scrollIntoViewIfNeeded()
      await first.focus()
      const scrollBefore=await page.evaluate(()=>scrollY)
      const gallery=await first.getAttribute('href')
      const itemId=await first.evaluate(e=>e.closest('.exhibition-item').id)
      await page.keyboard.press('Enter')
      await page.locator('.pswp--open').waitFor()
      await page.waitForFunction(()=>document.activeElement?.classList.contains('pswp'))
      await page.waitForTimeout(400) // PhotoSwipe's opening transition suppresses early arrow keys.
      const before=await page.locator('.pswp__counter').textContent()
      await page.keyboard.press('ArrowRight')
      await page.waitForFunction(before=>document.querySelector('.pswp__counter')?.textContent!==before,before)
      const after=await page.locator('.pswp__counter').textContent()
      await page.waitForTimeout(400)
      await page.keyboard.press('Tab')
      const focusInside=await page.evaluate(()=>!!document.activeElement.closest('.pswp'))
      await page.keyboard.press('Escape')
      await page.locator('.pswp--open').waitFor({state:'detached'})
      const scrollAfter=await page.evaluate(()=>scrollY)
      const galleryResponse=await page.goto('http://127.0.0.1:8098'+gallery)
      const returnLink=page.locator(`a[href="/parodos/${slug}/#${itemId}"]`)
      const returnCount=await returnLink.count()
      await returnLink.first().click()
      await page.waitForFunction(id=>location.hash==='#'+id,itemId)
      await page.locator('#'+itemId).waitFor()
      await page.waitForTimeout(500) // Existing return-anchor scroll settles after navigation.
      const target=await page.locator('#'+itemId).evaluate(e=>({top:e.getBoundingClientRect().top,height:e.getBoundingClientRect().height}))
      results.push({slug,width,enterOpened:true,before,after,focusInside,scrollBefore,scrollAfter,
        scrollPreserved:Math.abs(scrollAfter-scrollBefore)<5,galleryStatus:galleryResponse.status(),returnCount,itemId,hash:await page.evaluate(()=>location.hash),target})
    }
  }
  return results
}
