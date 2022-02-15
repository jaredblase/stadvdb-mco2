import { db2, db3, query1, query2, query3 } from './lib/dbs.js'
import promiseHandler from './lib/promiseHandler.js'

const queries = [
    'SELECT COUNT(*) FROM movies',
    'SELECT COUNT(*), SUM(`rank`) FROM movies WHERE `rank` IS NOT NULL',
    'SELECT COUNT(*) FROM movies GROUP BY `year` DIV 10',
    'SELECT COUNT(*), SUM(`rank`) FROM movies WHERE `rank` IS NOT NULL;'
]

const queryString = queries.join(';\n')

export default async function getReport(req, res) {
    try {
        if (!req.app.get('node1')) throw Error('Node 1 is down')

        const results = await query1(queryString, [], 'READ')
        console.log(results)
        res.json({ result: true })
    } catch (e) {
        console.log(e)

        const tasks = [ query2(queryString, [], 'READ'), query3(queryString, [], 'READ') ]
        const [ { data: data1 }, { data: data2 }] = await Promise.all(tasks.map(promiseHandler))
        console.log(data1)
        console.log(data2)
        res.json({ result: true })
    }
}