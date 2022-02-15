import { db2, db3, query1, query2, query3 } from './lib/dbs.js'
import promiseHandler from './lib/promiseHandler.js'
import genres from './lib/genres.js'

const queries = [
    'SELECT COUNT(*) AS cnt FROM movies',
    'SELECT COUNT(*) AS cnt, SUM(`rank`) AS val FROM movies WHERE `rank` IS NOT NULL',
    'SELECT COUNT(*) AS cnt, `year` DIV 10 * 10 AS decade FROM movies GROUP BY `year` DIV 10',
    'SELECT COUNT(*) AS cnt, SUM(`rank`) AS val, `year` DIV 10 * 10 AS decade FROM movies' + 
        ' WHERE `rank` IS NOT NULL GROUP BY `year` DIV 10 ORDER BY decade ASC'
]

genres.forEach((genre) => {
    queries.push(`SELECT COUNT(*) AS cnt, '${genre}' AS genre FROM movies WHERE genre1 = '${genre}' OR genre2 = '${genre}'`)
    queries.push(`SELECT COUNT(*) AS cnt, SUM(\`rank\`) AS val, '${genre}' AS genre FROM movies WHERE \`rank\` IS NOT NULL AND 
        (genre1 = '${genre}' OR genre2 = '${genre}')`)
})

const queryString = queries.join(';\n')

export default async function getReport(req, res) {
    try {
        if (!req.app.get('node1')) throw Error('Node 1 is down')

        const results = await query1(queryString, [], 'READ')
        console.log(results)
        res.json({ results })
    } catch (e) {
        console.log(e)

        const tasks = [ query2(queryString, [], 'READ'), query3(queryString, [], 'READ') ]
        const [ { data: data1 }, { data: data2 }] = await Promise.all(tasks.map(promiseHandler))

        let results = null
        if (data1 && data2) {
            results = data1
            for (let i = 0; i < 46; i++) {
                if (i < 2 || i > 3) {
                    results[i][0].cnt += data2[i][0].cnt
                    if (i % 2 === 1) {
                        results[i][0].val += data2[i][0].val
                    }
                } else {
                    data2.forEach((packet) => results[i].push(packet[0]))
                }
            }
        } else if (data1) {
            results = data1
        } else if (data2) {
            results = data2
        }
        console.log(results)

        res.json({ results })
    }
}