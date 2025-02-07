import '../styles/globals.css'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import { SessionProvider } from "next-auth/react"
import { createTheme, NextUIProvider } from "@nextui-org/react"
import Layout from 'components/layout'
import { Toaster } from 'react-hot-toast'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThirdwebProvider } from '@thirdweb-dev/react'

import { WagmiConfig, createClient, configureChains } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { mainnet, polygon, optimism } from 'wagmi/chains'

export const { chains, provider } = configureChains(
  [mainnet, polygon, optimism],
  [publicProvider()]
)

const client = createClient({
  autoConnect: true,
  provider,
})

const queryClient = new QueryClient()

const theme = createTheme({
  type: "dark", // it could be "light" or "dark"
  theme: {
    colors: {
      // brand colors
      primary: '#ef4130',
    },
    space: {},
    fonts: {
      sans: "proxima-nova,sans-serif",
      mono: "proxima-nova,sans-serif"
    }
  }
})

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>)

  return (
    <NextUIProvider theme={theme}>
      <WagmiConfig client={client}>
        <ThirdwebProvider activeChain="polygon">
          <SessionProvider session={session}>
            <QueryClientProvider client={queryClient}>
              {getLayout(<Component {...pageProps} />)}
              <div><Toaster /></div>
            </QueryClientProvider>
          </SessionProvider>
        </ThirdwebProvider>
      </WagmiConfig>
    </NextUIProvider>
  );
}

export default MyApp
