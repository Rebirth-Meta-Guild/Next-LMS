import Head from 'next/head'
import Link from 'next/link'
import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"
import { Navbar } from "@nextui-org/react"

const Nav = () => {
  const { data: session } = useSession()

  return (
    <>
      <Head>
        <title>Project GodJira (PG) - Powered by Rebirth Labs</title>
        <meta name="description" content="Powered by Rebirth Labs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className='p-4 mb-6 flex items-center space-x-3'>
        <div className='flex-1 flex'>
          <Link href="/" passHref>
            <a className="flex">
              <Image alt="Project GodJira" src="/images/logo.png" height={30} width={30}/>
            </a>
          </Link>
        </div>
        <ul className='flex gap-2'>
          <li>
            <Link href="/">
              <a className='underline'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </a>
            </Link>
          </li>
          {session && session?.user.role == "admin" && (
            <li>
              <Link href="/admin">
                <a className='underline'>Admin</a>
              </Link>
            </li>
          )}
        </ul>
        <div className='text-right text-sm'>
          {session ? (
            <div className='text-slate-700'>
              Signed in as {session.user?.email} <br />
              <button className='underline' onClick={() => signOut()}>Sign out</button>
            </div>
          ) : (
            <p>
              <button onClick={() => signIn()}>Sign in with GitHub</button>
            </p>
          )}
        </div>
      </nav>
    </>
  )
}

export default Nav;
