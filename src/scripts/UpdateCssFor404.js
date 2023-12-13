import * as fs from 'fs'
import * as path from 'path'

const files = fs.readdirSync(path.join('dist', 'assets')).filter((fn) => fn.endsWith('.css') && fn.startsWith('index'))
const regex = /@@DO_NOT_CHANGE@@/gm

if (files.length === 1) {
    const file = files[0]

    fs.writeFileSync(
        path.join('dist', '404.html'),
        (() => {
            const data = fs.readFileSync(path.join('dist', '404.html'), 'utf8')
            return data.replace(regex, file)
        })()
    )
}
