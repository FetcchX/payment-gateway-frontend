import { createQR, encodeURL, findTransactionSignature, FindTransactionSignatureError, validateTransactionSignature } from "@solana/pay"
import useTransactions from "../../../hooks/useTransactions"
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js"
import WalletConnectProvider from "@walletconnect/web3-provider"
import { ethers } from "ethers"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import Authereum from 'authereum'
import Web3Modal from 'web3modal'
import toast from "react-hot-toast"
import BigNumber from "bignumber.js"
import {
  getAccount,
  getAssociatedTokenAddress,
  transfer,
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
} from '@solana/spl-token'
import useEthereum from "../../../hooks/useEthereum"
import { useAccountContext } from "../../_context"
import useSolana from "../../../hooks/useSolana"
import { Transaction as TInterface } from "transaction.type"

const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad'

type supported_currencies = 'ethereum' | 'solana' | 'usdceth' | 'usdcsol' | 'matic' | 'usdcmatic'

const currencies = [
	{
		symbol: 'ethereum',
		name: 'Ethereum',
		wallets: ['Metamask', 'WalletConnect', 'Coinbase Wallet']
	},
	{
		symbol: 'usdceth',
		name: 'USDC (Ethereum)',
		wallets: ['Metamask', 'WalletConnect', 'Coinbase Wallet']
	},
	{
		symbol: 'solana',
		name: 'Solana',
		wallets: ['Phantom']
	},
	{
		symbol: 'usdcsol',
		name: 'USDC (Solana)',
		wallets: ['Phantom']
	},
  {
    symbol: 'matic',
    name: 'MATIC',
    wallets: ['Metamask', 'WalletConnect', 'Coinbase Wallet']
  }
]

const expiredHTML = () => {
  return (
    <div className='w-full min-h-screen space-y-3 flex flex-col text-white justify-center items-center bg-[#09101A] font-inter'>
      <h1 className="text-3xl font-bold">Link Already Expired :(</h1>
      <h3 className="text-xl">Want to integrate crypto payments in your website? choose <a className="bg-white/30 text-white p-2" href="https://wagpay.xyz/">wagpay.xyz</a></h3>
    </div>
  )
}

export const getServerSideProps = async (context: any) => {
	const data = await fetch(`${process.env.NEXT_BACKEND_URL}/api/paymentIntents/${context.params.id}`)
	if(data.status == 400) {
		return {
			props: {
				intent: {}
			}
		}
	}

	const res = await data.json()

  console.log()
  
  if((res.is_paid && res.transaction_hash) || (res.time !== 0 && new Date().getMinutes() - new Date(res.created_at).getMinutes() <= 10 && new Date().getHours() - new Date(res.created_at).getHours())) {
    toast.error('Already invalid')
    return {
      props: {
        intent: {},
        expired: true
      }
    }
  }

	return {
		props: {
			intent: res,
      expired: false
		}
	}
}

interface Props {
	intent: any
  expired: boolean
}

const Intent = ({ intent, expired }: Props) => {
  if(expired) {
    return expiredHTML()
  }
  
  const {
    qrCode,
    qrCodes,
    url,
    setUrl,
    isModalOpen,
    setIsModalOpen,
    setQrCode,
    ref
  } = useAccountContext()

  const [transactions, getTransactions, createTransaction] = useTransactions()
  const [signer, address, connectETH, payETH, payERC20] = useEthereum()
  const [publicKey, connectSOL, paySOL, paySPL, qrCodeSOL, qrCodeSPL] = useSolana()
  const { config } = useAccountContext()

	const { query } = useRouter()
	useEffect(() => {
		if(query && query.email) {
      console.log(query)
      setEmail(query.email as string)
    }
	}, [])

  const [tooltipStatus, setTooltipStatus] = useState(0);
  const [sol, setSOL] = useState('')
  const [ethGas, setEthGas] = useState<any>()
  const [solGas, setSolGas] = useState<any>()

  const [username, setUsername] = useState(intent.from_data.email)
  const [email, setEmail] = useState(intent.from_data?.email)
  const [option, setOption] = useState<supported_currencies>(intent.currency[0])
  const [wallet, setWallet] = useState(currencies.find(currency => currency.name.toLowerCase() === intent.currency[0])?.wallets[0])
  const [price, setPrice] = useState(0)

  const seeQrCode = async () => {
    if (!email) {
      toast.error('Fill all Fields')
      return
    }

    if (intent.value <= 0) {
      toast.error('Select a Product')
      return
    }

    let transaction: TInterface = {
      to: intent.sol_address,
      value: price,
      price: intent.value,
      fields: {},
      id: intent.id
    }

    let store_data = {
      title: intent.title,
      description: intent.description
    }

    if (option.toLowerCase() === 'solana') {
      qrCodeSOL(transaction, store_data, price, email, config.currencies['solana']['solana'], setUrl, setQrCode, setIsModalOpen)
    } else if (option.toLowerCase() === 'usdcsol') {
      qrCodeSPL(transaction, store_data, price, email, config.currencies['solana']['usdcsol'], setUrl, setQrCode, setIsModalOpen)
    }
  }

  const pay = async () => {
    // e.preventDefault()
    if (!email) {
      toast.error('Fill all Fields')
      return
    }

    if (intent.value <= 0) {
      toast.error('Select a Product')
      return
    }

    let transaction: TInterface = {
      to: "",
      value: price,
      price: intent.value,
      fields: {},
      id: intent.id
    }

    let store_data = {
      title: intent.title,
      description: intent.description
    }

    if (option.toLowerCase() === 'solana') {
      transaction.to = intent.sol_address
      paySOL(transaction, price, email, config.currencies['solana']['solana'])
    } else if (option.toLowerCase() === 'ethereum') {
      transaction.to = intent.eth_address
      payETH(transaction, price, email, config.currencies['ethereum']['ethereum'])
    } else if (option.toLowerCase() === 'usdceth') {
      transaction.to = intent.eth_address
      payERC20(transaction, price, email, config.currencies['ethereum']['usdceth'])
    } else if (option.toLowerCase() == 'usdcsol') {
      transaction.to = intent.sol_address
      paySPL(transaction, price, email, config.currencies['solana']['usdcsol'])
    } else if (option.toLowerCase() === 'matic') {
      transaction.to = intent.eth_address
      payETH(transaction, price, email, config.currencies['matic']['matic'])
    }
  }

  useEffect(() => {
    if (option.toLowerCase() == 'ethereum') {
      fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      )
        .then((data) => data.json())
        .then((res) => setPrice(intent.value / Number(res.ethereum.usd)))
    } else if (option.toLowerCase() == 'solana') {
      fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
      )
        .then((data) => data.json())
        .then((res) => setPrice(intent.value / Number(res.solana.usd)))
    } else {
      setPrice(intent.value)
    }
  }, [intent.value, option])

  useEffect(() => {
    (async () => {
      const provider = new ethers.providers.InfuraProvider(1, INFURA_ID)
      const gas = await provider.estimateGas({
        to: '0x4e7f624C9f2dbc3bcf97D03E765142Dd46fe1C46',
        value: ethers.utils.parseEther('44')
      })
      const ethgas = ethers.utils.formatUnits(gas.toString(), 9)
      console.log(ethgas)
      fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      )
        .then((data) => data.json())
        .then((res) => setEthGas(Number(ethgas) * Number(res.ethereum.usd)))
      fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
      )
          .then((data) => data.json())
          .then((res) => setSolGas(0.00005 * Number(res.solana.usd)))
    })()
  }, [intent.value])
  
	return (
		<div className='w-full min-h-screen flex justify-center items-center bg-[#09101A] font-inter'>
			<div className="w-1/2 flex justify-center items-center">
        <div className="w-1/2 h-full flex justify-center items-center flex-col bg-[#141C28] border-2 border-white/20 p-10 text-white rounded-xl relative wagpay">
          <h1 className="font-jakarta text-4xl">{intent.title}</h1>
          <p>{intent.description}</p>
          <div className="w-full p-5 space-y-4">
            <input 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="sk1122@wagpay.xyz" 
              type="email" 
              name="email" 
              className="border border-white/20 p-2 w-full text-white bg-transparent" 
            />
          </div>

          <div className="w-full px-5 flex justify-between items-center">
            <select
              className="relativ block w-1/2 rounded-md border-gray-300 bg-transparent focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              aria-label="Default select example"
              value={option}
              onChange={(e) =>
                setOption(e.target.value as supported_currencies)
              }
            >
              {Object.keys(config?.currencies).map((currency_data: any) => {
                return Object.keys(config.currencies[currency_data]).map((currency: any) => {
                  if(!intent.currency.includes(config.currencies[currency_data][currency].name)) return <div></div>
                  return <option className="text-black" value={config.currencies[currency_data][currency].name}>{config.currencies[currency_data][currency].symbol}</option>	
                })
              })}
            </select>
            <div>
              <h2 className="font-bold text-xl">${intent.value} {' '} ~{price.toFixed(2)} 
              {' '}{option.toLowerCase() === 'ethereum'
                        ? 'ETH'
                        : option.toLowerCase() === 'solana'
                        ? 'SOL'
                        : 'USDC'}</h2>
            </div>
          </div>

          {(option.toLowerCase() === 'solana' || option.toLowerCase() === 'usdcsol') && (
            <div
              onClick={() => seeQrCode()}
              className="cursor-pointer rounded-md bg-black px-3 py-2 text-white"
            >
              <svg width="60" height="22" viewBox="0 0 60 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M53.7996 15.3534L50.3357 7.78491H47.4607L52.4091 17.997L52.32 18.3045C52.1961 18.7132 51.9345 19.0662 51.5798 19.3032C51.2252 19.5402 50.7995 19.6465 50.3753 19.6039C49.8788 19.5993 49.3917 19.4679 48.9601 19.222L48.4999 21.4093C49.164 21.6836 49.8747 21.8267 50.5931 21.8308C52.5724 21.8308 53.7699 21.1017 54.7596 18.9542L60 7.78491H57.2239L53.7996 15.3534Z" fill="white"/>
                <path d="M29.3187 4.1792H21.0153V18.0912H23.7369V12.9777H29.3187C32.3521 12.9777 34.3463 11.4452 34.3463 8.57847C34.3463 5.71175 32.3521 4.1792 29.3187 4.1792ZM29.1702 10.5425H23.727V6.57474H29.1702C30.7438 6.57474 31.6445 7.2939 31.6445 8.55863C31.6445 9.82336 30.7438 10.5425 29.1702 10.5425Z" fill="white"/>
                <path d="M45.7249 15.4526V11.2617C45.7249 8.78182 43.9484 7.49725 40.9002 7.49725C38.426 7.49725 36.2586 8.65287 35.6499 10.4284L37.8866 11.222C38.2182 10.3342 39.3711 9.67953 40.8062 9.67953C42.5084 9.67953 43.226 10.3739 43.226 11.222V11.4948L39.1782 11.9412C36.8475 12.1891 35.3134 13.2356 35.3134 15.1055C35.3134 17.1538 37.0701 18.2549 39.4008 18.2549C40.9031 18.3018 42.3661 17.7692 43.4882 16.767C43.894 17.7589 44.3097 18.4235 47.0758 18.0714V15.9982C45.9674 16.266 45.7249 15.9982 45.7249 15.4526ZM43.2507 14.1234C43.2507 15.4725 41.3654 16.1867 39.7868 16.1867C38.5843 16.1867 37.8619 15.7998 37.8619 15.0311C37.8619 14.2623 38.4557 13.9846 39.6037 13.8506L43.2606 13.4241L43.2507 14.1234Z" fill="white"/>
                <path d="M15.8678 14.8277C15.8871 14.8856 15.8871 14.9483 15.8678 15.0062C15.8566 15.064 15.8292 15.1174 15.7886 15.16L13.1709 17.9126C13.1132 17.9721 13.0442 18.0193 12.968 18.0515C12.8916 18.0851 12.809 18.102 12.7256 18.1011H0.309983C0.252484 18.1016 0.195969 18.0862 0.146685 18.0565C0.0974336 18.0229 0.0581183 17.9766 0.0328714 17.9226C0.015435 17.8677 0.015435 17.8088 0.0328714 17.7539C0.0431328 17.6968 0.0688042 17.6437 0.107097 17.6002L2.72976 14.8475C2.78744 14.7881 2.85643 14.7409 2.93264 14.7087C3.00891 14.6747 3.09166 14.6577 3.17512 14.6591H15.5709C15.6307 14.6579 15.6895 14.6752 15.7391 14.7087C15.7948 14.7317 15.8405 14.7739 15.8678 14.8277ZM13.1759 9.60015C13.1169 9.54228 13.0482 9.49527 12.973 9.46128C12.8958 9.43008 12.8137 9.41328 12.7305 9.41168H0.309983C0.251765 9.41254 0.194951 9.42972 0.145975 9.46127C0.0969987 9.49283 0.057818 9.5375 0.0328714 9.59023C0.0157557 9.64513 0.0157557 9.70396 0.0328714 9.75886C0.0412052 9.81656 0.0671307 9.87026 0.107097 9.91261L2.72976 12.6702C2.78873 12.7281 2.8574 12.7751 2.93264 12.8091C3.00965 12.8407 3.0919 12.8575 3.17512 12.8587H15.5709C15.6307 12.8598 15.6895 12.8425 15.7391 12.8091C15.7891 12.7799 15.8275 12.7344 15.848 12.6801C15.8734 12.6274 15.8818 12.568 15.872 12.5103C15.8623 12.4525 15.8349 12.3992 15.7936 12.3578L13.1759 9.60015ZM0.146685 7.56667C0.195969 7.59636 0.252484 7.6118 0.309983 7.6113H12.7305C12.8139 7.61217 12.8966 7.59527 12.973 7.56171C13.0492 7.52948 13.1182 7.48226 13.1759 7.42284L15.7936 4.67019C15.8341 4.6276 15.8616 4.57423 15.8728 4.51644C15.8899 4.46154 15.8899 4.40271 15.8728 4.34781C15.8523 4.29359 15.8139 4.24807 15.7639 4.21886C15.7142 4.18544 15.6555 4.16812 15.5956 4.16926H3.15532C3.07186 4.16793 2.98912 4.18485 2.91285 4.21886C2.83664 4.25109 2.76765 4.29831 2.70997 4.35773L0.0922528 7.12029C0.0507444 7.16218 0.0231013 7.21586 0.0130773 7.27404C-0.00435908 7.3289 -0.00435908 7.38782 0.0130773 7.44267C0.0451946 7.49569 0.0914761 7.53864 0.146685 7.56667Z" fill="url(#paint0_linear_306_215)"/>
                <defs>
                <linearGradient id="paint0_linear_306_215" x1="1.34093" y1="18.4332" x2="14.0922" y2="3.77438" gradientUnits="userSpaceOnUse">
                <stop offset="0.08" stop-color="#9945FF"/>
                <stop offset="0.3" stop-color="#8752F3"/>
                <stop offset="0.5" stop-color="#5497D5"/>
                <stop offset="0.6" stop-color="#43B4CA"/>
                <stop offset="0.72" stop-color="#28E0B9"/>
                <stop offset="0.97" stop-color="#19FB9B"/>
                </linearGradient>
                </defs>
              </svg>

            </div>
          )}

          <div className="w-full p-5">
            <button onClick={() => pay()} className="w-full rounded-xl text-xl font-bold tracking-wider p-5 bg-gradient-to-r from-[#3C43EE] to-[#5055DA]">
              PAY
            </button>
          </div>
        </div>
      </div>
			<div className="w-1/2 flex flex-col justify-center items-start text-white space-y-2">
        <h1 className="font-jakarta text-4xl">{intent.title}</h1>
        <p>{intent.description}</p>
        <div className="w-1/2 flex flex-col justify-center items-start space-y-3 font-inter pt-10">
          {intent.products.map((product: any) => (
            <div>
              <div className="w-1/2 flex justify-between items-center">
                <h3 className="font-bold text-xl">{product.name}</h3>
                <p>{' '}|{" "}</p>
                <h3>${product.value}</h3>
              </div>
              <h3>{product.description}</h3>
            </div>
          ))}
        </div>
      </div>
		</div>
	)
}

export default Intent