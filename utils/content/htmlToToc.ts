import * as cheerio from "cheerio"

export const htmlToToc = (html: any) => {
    const $ = cheerio.load(html)
    const headings = $('h2, h3, h4, h5, h6')
    let toc = []
    headings.each((i, el) => {
        const $el = $(el)
        const slug = $el.attr('id')
        const content = $el.text()
        const lvl = +$el[0].name.slice(1)
        toc.push({ slug, content, lvl })
    })
    
    return toc    
}