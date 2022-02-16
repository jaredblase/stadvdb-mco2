import Head from 'next/head'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Layout, { siteTitle } from '../components/layout'
import Table from '../components/table'
import app from '../lib/axiosConfig'

const fetcher = (url) => app.get(url)

function useReports() {
  const { data, error } = useSWR(`/api/report`, fetcher)

  return {
    data: data?.data.results,
    isLoading: !data && !error,
    isError: error,
  }
}

function processDecades(counts, avgs) {
  // balance array
  while (counts[0].decade < avgs[0].decade) {
    avgs.unshift({ cnt: 1, val: 0, decade: avgs[0].decade - 10 })
  }

  return counts.map((c, i) => {
    return {
      label: `${c.decade}-${c.decade + 9}`,
      cnt: c.cnt,
      avg: avgs[i].val ? (avgs[i].val / avgs[i].cnt).toFixed(2) : 'N/A'
    }
  })
}

function processGenres(data) {
  const genres = []
  for (let i = 0; i < data.length; i += 2) {
    genres.push({
      label: data[i][0].genre,
      cnt: data[i][0].cnt,
      avg: data[i + 1][0].cnt ? (data[i + 1][0].val / data[i + 1][0].cnt).toFixed(2) : 0
    })
  }

  return genres
}

export default function Report() {
  const { data, isLoading, isError } = useReports()
  const [decades, setDecades] = useState()
  const [genres, setGenres] = useState()

  useEffect(() => {
    if (data) {
      console.log(data)
      setDecades(processDecades(data[2], data[3]))
      setGenres(processGenres(data.slice(4)))
    }
  }, [data])

  return (
    <Layout>
      <Head>
        <title>{siteTitle} Data</title>
      </Head>
      {isLoading &&
        <div className="flex justify-center items-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }
      {data &&
        <>
          <Table headers={['', 'Count', 'Average Rating']} data={[{ label: 'All Movies', cnt: data[0][0].cnt, avg: (data[1][0].val / data[1][0].cnt).toFixed(2) }]} />
          <Table headers={['Decade', 'Count', 'Average Rating']} data={decades} />
          <Table headers={['Genre', 'Count', 'Average Rating']} data={genres} />
        </>
      }
      { !isLoading && !data && <p>An error has occured!</p>}
    </Layout>
  )
}
