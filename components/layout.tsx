import NavBar from './NavBar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main className='mx-auto max-w-full md:max-w-6xl min-h-screen px-5 py-20'>
        {children}
      </main>
      {/* <Footer /> */}
    </>
  )
}
