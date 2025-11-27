require('markdown-it')
const DOMPurify = require('dompurify')
const md = window.markdownit()

async function loadMarkdown(url) {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Impossible de charger le markdown: ' + res.status)
    const raw = await res.text()
    const html = md.render(raw)
    const clean = DOMPurify.sanitize(html)
    const container = document.getElementById('md-container')
    if (container) {
        container.innerHTML = clean
    }
}

loadMarkdown('https://github.com/Crabe-Corp/Epicraft-Launcher/blob/dev/README.md').catch(console.error)
