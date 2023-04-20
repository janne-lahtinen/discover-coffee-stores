import { useRouter } from "next/router"
import Link from "next/link"
import Head from 'next/head'

const DynamicRoute = () => {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>{router.query.dynamicRoute}</title>
      </Head>
      <div>
        <p>Page {router.query.dynamicRoute}</p>
        <p><Link href="/">Back to home</Link></p>
      </div>
    </>
  )
}

export default DynamicRoute