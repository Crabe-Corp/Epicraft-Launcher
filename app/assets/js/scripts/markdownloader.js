const MarkdownIt = require('markdown-it')
const DOMPurify = require('dompurify')
const md = new MarkdownIt({ html: true, linkify: true, breaks: true })

async function loadMarkdown(url) {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Impossible de charger le markdown: ' + res.status)
    const raw = await res.text()
    
    // Fix relative image paths
    const baseUrl = url.substring(0, url.lastIndexOf('/') + 1)
    const fixedRaw = raw.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, imgUrl) => {
        if (!imgUrl.startsWith('http') && !imgUrl.startsWith('//')) {
            return `![${alt}](${baseUrl}${imgUrl})`
        }
        return match
    })

    const html = md.render(fixedRaw)
    const clean = DOMPurify.sanitize(html)
    const container = document.getElementById('md-container')
    if (container) {
        container.innerHTML = clean
    }
}

loadMarkdown('https://raw.githubusercontent.com/Crabe-Corp/Epicraft-Launcher/dev/README.md').catch(console.error)
