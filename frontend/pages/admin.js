import Head from 'next/head'
import useSWR from 'swr'
import Layout, { siteTitle } from '../components/layout'
import app from '../lib/axiosConfig'
import { Switch } from '@headlessui/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toastServerError, toastSuccess } from '../components/toasts'

const fetcher = (url) => app.get(url)

function useConfig() {
  const { data, error, mutate } = useSWR(`/config`, fetcher)

  return {
    data: data?.data,
    isLoading: !data && !error,
    isError: error,
    mutate,
  }
}

export default function AdminPage() {
  const { data, isLoading, isError, mutate } = useConfig()
  const [node1, setNode1] = useState(false)
  const [node2, setNode2] = useState(false)
  const [node3, setNode3] = useState(false)
  const [crashTransactions, setCrashTransactions] = useState(false)
  const [loading, setLoading] = useState(false)

  const updateConfig = async () => {
    setLoading(true)
    const tasks = [axios.post(process.env.NEXT_PUBLIC_RECOVERY_BASE_URL.replace(/\/$/, "") + '/config', { node1, node2, node3 }),
    app.post('/config', { node1, node2, node3, crashTransactions })]
    const res = await Promise.all(tasks)
    console.log(res)
    setLoading(false)

    if (res[0].status == 200 && res[1].status == 200) {
      toastSuccess('Configuration updated!')
    } else {
      toastServerError()
      mutate()
    }
  }

  useEffect(() => {
    if (data) {
      setNode1(data.node1)
      setNode2(data.node2)
      setNode3(data.node3)
      setCrashTransactions(data.crashTransactions)
    }
  }, [data])

  useEffect(() => { if (isError) toastServerError() }, [isError])

  return (
    <Layout>
      <Head>
        <title>{siteTitle} Configuration</title>
      </Head>
      {!isLoading && !isError &&
        <div className="grid grid-cols-1 place-items-center gap-y-3 max-w-xs mx-auto">
          <h1 className="font-bold text-2xl mb-4">Node Settings</h1>
          <Switch.Group>
            <div className="flex justify-between my-2 w-full">
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
            <div className="flex justify-between w-full my-2">
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
            <div className="flex w-full justify-between my-2">
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
          <Switch.Group>
            <div className="flex w-full justify-between my-2">
              <Switch.Label className="mr-24">Force Crash Transactions</Switch.Label>
              <Switch
                checked={crashTransactions}
                onChange={setCrashTransactions}
                className={`${crashTransactions ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex items-center h-6 rounded-full w-11`}
              >
                <span
                  className={`${crashTransactions ? 'translate-x-6' : 'translate-x-1'
                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform ease-in-out duration-200`}
                />
              </Switch>
            </div>
          </Switch.Group>
          <button onClick={updateConfig} disabled={loading} className="inline-flex justify-center py-2 px-4 border my-2
          border-transparent shadow-sm text-sm font-medium rounded-md text-white w-full max-w-full
          bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">Update</button>
        </div>
      }

      {isLoading &&
        <div className="flex justify-center items-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>}
    </Layout>
  )
}
