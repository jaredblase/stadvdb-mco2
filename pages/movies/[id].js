import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'

export default function Post({ postData }) {
  return ( 
    <Layout>
      {postData.title}
      <br />
      {postData.id}
      <br />
      {postData.date}
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const postData = getPostData(params.id)
  return {
    props: {
      postData,
    }
  }
}