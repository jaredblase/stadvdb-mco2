import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'

export default function Report() {
  return (
    <Layout>
      <Head>
        <title>{siteTitle} Data</title>
      </Head>
    </Layout>
  )
}
