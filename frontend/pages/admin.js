import Head from 'next/head'
import useSWR from 'swr'
import Layout, { siteTitle } from '../components/layout'
import app from '../lib/axiosConfig'
import { Switch } from '@headlessui/react'
import { useState } from 'react'

const fetcher = (url) => app.get(url)

function useReports() {
  const { data, error } = useSWR(`/api/movies/report`, fetcher)

  return {
    data: data?.data,
    isLoading: !data && !error,
    isError: error,
  }
}

export default function AdminPage() {
  const [node1, setNode1] = useState(true)
  const [node2, setNode2] = useState(true)
  const [node3, setNode3] = useState(true)

  const updateConfig = () => {
    console.log('Hello World')
  }

  return (
    <Layout>
      <Head>
        <title>{siteTitle} Configuration</title>
      </Head>
      <div className="grid grid-cols-1 place-items-center gap-y-3">
        <h1 className="font-bold text-2xl mb-4">Node Settings</h1>
        <Switch.Group>
          <div className="flex items-center my-2">
            <Switch.Label className="mr-24">Enable Node 1</Switch.Label>
            <Switch
              checked={node1}
              onChange={setNode1}
              className={`${node1 ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex items-center h-6 rounded-full w-11`}
            >
              <span
                className={`${node1 ? 'translate-x-6' : 'translate-x-1'
                  } inline-block w-4 h-4 transform bg-white rounded-full transition-transform ease-in-out duration-200`}
              />
            </Switch>
          </div>
        </Switch.Group>
        <Switch.Group>
          <div className="flex items-center my-2">
            <Switch.Label className="mr-24">Enable Node 2</Switch.Label>
            <Switch
              checked={node2}
              onChange={setNode2}
              className={`${node2 ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex items-center h-6 rounded-full w-11`}
            >
              <span
                className={`${node2 ? 'translate-x-6' : 'translate-x-1'
                  } inline-block w-4 h-4 transform bg-white rounded-full transition-transform ease-in-out duration-200`}
              />
            </Switch>
          </div>
        </Switch.Group>
        <Switch.Group>
          <div className="flex items-center my-2">
            <Switch.Label className="mr-24">Enable Node 3</Switch.Label>
            <Switch
              checked={node3}
              onChange={setNode3}
              className={`${node3 ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex items-center h-6 rounded-full w-11`}
            >
              <span
                className={`${node3 ? 'translate-x-6' : 'translate-x-1'
                  } inline-block w-4 h-4 transform bg-white rounded-full transition-transform ease-in-out duration-200`}
              />
            </Switch>
          </div>
        </Switch.Group>
        <button onClick={updateConfig} className="inline-flex justify-center py-2 px-4 border my-2
          border-transparent shadow-sm text-sm font-medium rounded-md text-white w-full max-w-[15.5rem]
          bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">Update</button>
      </div>
    </Layout>
  )
}
