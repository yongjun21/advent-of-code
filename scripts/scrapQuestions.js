const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const cheerio = require('cheerio')

const questionsDir = path.join(__dirname, '..', 'questions')

dotenv.config({ path: path.join(__dirname, '..', '.env') })

function getSessionCookie() {
  return process.env.AOC_SESSION_COOKIE || ''
}

async function fetchAoCDay(year = 2025, day = 1) {
  const sessionCookie = getSessionCookie()
  if (!sessionCookie) {
    throw new Error('Missing AOC_SESSION_COOKIE in .env or process.env')
  }

  const url = `https://adventofcode.com/${year}/day/${day}`
  const response = await fetch(url, {
    headers: {
      cookie: `session=${sessionCookie}`,
      'user-agent': 'Mozilla/5.0 (compatible; AoC scraper/1.0)',
      accept: 'text/html,application/xhtml+xml',
    },
  })

  if (!response.ok) {
    throw new Error(`AoC request failed: ${response.status} ${response.statusText}`)
  }

  return response.text()
}

function renderInlineText(text) {
  return text
    .replace(/\r/g, '')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

function renderBlock($, element) {
  const $element = $(element)
  const tagName = (element.tagName || element.name || '').toLowerCase()

  if (tagName === 'pre') {
    const codeText = $element.text().replace(/\r/g, '').replace(/\n$/, '')
    return '```\n' + codeText + '\n```'
  }

  if (tagName === 'ul' || tagName === 'ol') {
    const items = $element
      .children('li')
      .toArray()
      .map((li) => `- ${renderInlineText($(li).text())}`)
    return items.join('\n')
  }

  if (tagName === 'p' || tagName === 'div' || tagName === 'blockquote') {
    return renderInlineText($element.text())
  }

  if (tagName === 'br') {
    return ''
  }

  const text = renderInlineText($element.text())
  return text
}

function renderArticle($, article) {
  const blocks = []

  for (const child of article.children || []) {
    if (child.type === 'text') {
      const text = renderInlineText(child.data || '')
      if (text) blocks.push(text)
      continue
    }

    if (child.type !== 'tag') continue

    const rendered = renderBlock($, child)
    if (rendered) blocks.push(rendered)
  }

  return blocks.join('\n\n').trim()
}

function parseAoCPage(html) {
  const $ = cheerio.load(html)
  const title = $('article.day-desc h2').first().text().trim().replace(/^---\s*/, '').replace(/\s*---$/, '')
  const articles = $('article.day-desc').toArray().map((article, index) => {
    const $article = $(article)
    const heading = $article.find('h2').first().text().trim()
    const $copy = $article.clone()
    $copy.find('h2').remove()
    const body = renderArticle($, $copy[0])

    return {
      index: index + 1,
      heading,
      text: body,
    }
  })

  if (articles.length < 2) {
    throw new Error('Part 2 was not found. Make sure AOC_SESSION_COOKIE is set in .env.')
  }

  return {
    title,
    articleCount: articles.length,
    hasPart2: true,
    articles,
  }
}

function toMarkdown(year, day, result) {
  const lines = []
  lines.push(`# Advent of Code ${year} Day ${day}`)
  lines.push('')
  lines.push(`<source>`)
  lines.push(`https://adventofcode.com/${year}/day/${day}`)
  lines.push(`</source>`)
  lines.push('')
  lines.push(`<title>`)
  lines.push(result.title)
  lines.push(`</title>`)
  lines.push('')

  for (const article of result.articles) {
    lines.push(`<section data-part="${article.index}">`)
    lines.push(article.text)
    lines.push('')
    lines.push(`</section>`)
    lines.push('')
  }

  return `${lines.join('\n').trimEnd()}\n`
}

function getOutputPath(year, day) {
  return path.join(questionsDir, String(year), `day${day}.md`)
}

function getMaxDayForYear(year) {
  return year >= 2025 ? 12 : 25
}

function writeMarkdownFile(year, day, result) {
  const outputPath = getOutputPath(year, day)
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, toMarkdown(year, day, result), 'utf8')
  return outputPath
}

async function main() {
  const [yearArg, dayArg] = process.argv.slice(2)
  const year = yearArg ? Number(yearArg) : new Date().getFullYear() - 1
  if (dayArg) {
    const day = Number(dayArg)
    const html = await fetchAoCDay(year, day)
    const result = parseAoCPage(html)
    const outputPath = writeMarkdownFile(year, day, result)

    console.log(JSON.stringify({ ...result, outputPath }, null, 2))
    return
  }

  const maxDay = getMaxDayForYear(year)
  const results = []

  for (let day = 1; day <= maxDay; day += 1) {
    const html = await fetchAoCDay(year, day)
    const result = parseAoCPage(html)
    const outputPath = writeMarkdownFile(year, day, result)
    results.push({
      day,
      articleCount: result.articleCount,
      hasPart2: result.hasPart2,
      outputPath,
    })
  }

  console.log(JSON.stringify({ year, maxDay, results }, null, 2))
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}

module.exports = {
  getSessionCookie,
  fetchAoCDay,
  parseAoCPage,
  toMarkdown,
  writeMarkdownFile,
}
