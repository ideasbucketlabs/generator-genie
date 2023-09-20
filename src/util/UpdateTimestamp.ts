import * as fs from 'fs'
import * as path from 'path'

const current = new Date()
const currentUtcTimestamp = current.toISOString()
const regex = /@@DO_NOT_CHANGE@@/gm

fs.writeFileSync(
    path.join('dist', 'sitemap.xml'),
    (() => {
        const data = fs.readFileSync(path.join('dist', 'sitemap.xml'), 'utf8')
        return data.replace(regex, currentUtcTimestamp)
    })()
)

fs.writeFileSync(
    path.join('dist', 'sitemap_pages.xml'),
    (() => {
        const data = fs.readFileSync(path.join('dist', 'sitemap_pages.xml'), 'utf8')
        return data.replace(regex, currentUtcTimestamp)
    })()
)

console.log(
    `Changed timestamp to ${current.toLocaleString('en-US', { timeZone: 'America/New_York' })} ${
        current.toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2]
    } - UTC ${currentUtcTimestamp}`
)
