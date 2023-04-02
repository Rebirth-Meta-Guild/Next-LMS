import { ThirdwebProvider } from '@thirdweb-dev/react'
import Head from 'next/head'
import NavBar from './NavBar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Project GodJira (PG) - Powered by Rebirth Labs</title>
        <meta name="description" content="Powered by Rebirth Labs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <main className='mx-auto max-w-full md:max-w-6xl min-h-screen px-5 py-20'>
        {children}
      </main>
      {/* <Footer /> */}
    </>
  )
}
