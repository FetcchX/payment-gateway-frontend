import Head from 'next/head'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider, chain, defaultChains } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WalletLinkConnector } from 'wagmi/connectors/walletLink'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { AppContext, useAccountContext } from './_context'
// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css')
import mainnet from '../config/mainnet'
import testnet from '../config/testnet'
import QRCodeStyling, {
  DrawType,
  TypeNumber,
  Mode,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
  CornerDotType,
  Options,
} from 'qr-code-styling'
import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress
import ReactGA from 'react-ga';

const infuraId = 'a618bb907c2f4670a721be9cd51f388e'

// Chains for connectors to support
const chains = defaultChains

// Set up connectors
const connectors = ({ chainId }: any) => {
  const rpcUrl =
    chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
    chain.mainnet.rpcUrls[0]
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
    new WalletConnectConnector({
      options: {
        infuraId,
        qrcode: true,
      },
    }),
    new WalletLinkConnector({
      options: {
        appName: 'WagPay',
        jsonRpcUrl: `${rpcUrl}/${infuraId}`,
      },
    }),
  ]
}

declare global {
  interface Window {
    solana: any
  }
}

Router.events.on('routeChangeStart', () => NProgress.start()); 
Router.events.on('routeChangeComplete', () => NProgress.done()); 
Router.events.on('routeChangeError', () => NProgress.done());


function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    ReactGA.initialize('UA-226967881-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, [])
  
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  )

  const [config, setConfig] = useState<any>(mainnet)

  useEffect(() => {
    const { NEXT_PUBLIC_ENV } = process.env
    console.log(mainnet, testnet)
    if(NEXT_PUBLIC_ENV == 'mainnet') {
      setConfig(mainnet)
    } else {
      setConfig(testnet)
    }
  }, [])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [qrCode, setQrCode] = useState(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png'
  )
  const [url, setUrl] = useState('https://qr-code-styling.com')

  const [options, setOptions] = useState<Options>({
    width: 300,
    height: 300,
    type: 'svg' as DrawType,
    data: '',
    image: '/spay.svg',
    margin: 10,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: 'Byte' as Mode,
      errorCorrectionLevel: 'Q' as ErrorCorrectionLevel,
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.3,
      margin: 10,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      color: '#222222',
      // gradient: {
      //   type: 'linear', // 'radial'
      //   rotation: 0,
      //   colorStops: [{ offset: 0, color: '#8688B2' }, { offset: 1, color: '#77779C' }]
      // },
      type: 'rounded' as DotType,
    },
    backgroundOptions: {
      color: '#fff',
      // gradient: {
      //   type: 'linear', // 'radial'
      //   rotation: 0,
      //   colorStops: [{ offset: 0, color: '#ededff' }, { offset: 1, color: '#e6e7ff' }]
      // },
    },
    cornersSquareOptions: {
      color: '#222222',
      type: 'extra-rounded' as CornerSquareType,
      // gradient: {
      //   type: 'linear', // 'radial'
      //   rotation: 180,
      //   colorStops: [{ offset: 0, color: '#25456e' }, { offset: 1, color: '#4267b2' }]
      // },
    },
    cornersDotOptions: {
      color: '#222222',
      type: 'dot' as CornerDotType,
      // gradient: {
      //   type: 'linear', // 'radial'
      //   rotation: 180,
      //   colorStops: [{ offset: 0, color: '#00266e' }, { offset: 1, color: '#4060b3' }]
      // },
    },
  })

  const [qrCodes, setQrCodes] = useState<QRCodeStyling>()
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const QRCodeStyling = require('qr-code-styling')
      setQrCodes(new QRCodeStyling(options))
    }
  }, [])

  useEffect(() => {
    if (!qrCodes) return
    if (ref.current) {
      qrCodes.append(ref.current)
    }
  }, [qrCodes, ref])

  useEffect(() => {
    if (!qrCodes) return
    qrCodes.update(options)
  }, [qrCodes, options])

  const onDataChange = (url: string) => {
    if (!qrCodes) return
    setOptions((options) => ({
      ...options,
      data: url,
    }))
  }

  useEffect(() => {
    console.log(isModalOpen)
    console.log(url)
    onDataChange(url)
  }, [url])

  let sharedState = {
    config,
    qrCode,
    qrCodes,
    url,
    setUrl,
    isModalOpen,
    setIsModalOpen,
    setQrCode,
    ref
  }

  return (
    <AppContext.Provider value={sharedState}>
      <Provider autoConnect connectors={connectors}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets}>
            <WalletModalProvider>
              <Toaster />
              <div className={(isModalOpen ? "" : "hidden") + "w-full h-full backdrop-blur-sm absolute z-50"} onClick={() => setIsModalOpen(false)}>
                <div className={(isModalOpen ? "" : "hidden") + " absolute bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-transparent w-64 h-64"}>
                  <p className='text-white'>Scan this code to pay with any solana mobile wallet</p>
                  <div ref={ref}></div>
                </div>
              </div>
              <Component {...pageProps} />
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </Provider>
    </AppContext.Provider>
  )
}

export default MyApp
