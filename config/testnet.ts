import { Config } from "../types/config.type"

const ethereum: Config = {
	name: 'ethereum',
	symbol: 'ETHEREUM',
	chainId: 4
}

const usdceth: Config = {
	name: 'usdceth',
	symbol: 'USDC (Ethereum)',
	chainId: 4,
	tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
}

const solana: Config = {
	name: 'solana',
	symbol: 'SOLANA',
	chainId: 'devnet'
}

const usdcsol: Config = {
	name: 'usdcsol',
	symbol: 'USDC (Solana)',
	chainId: 'devnet',
	tokenAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
}

const matic: Config = {
	name: 'matic',
	symbol: 'MATIC',
	chainId: 80001
}

const usdcmatic: Config = {
	name: 'usdcmatic',
	symbol: 'USDC (Matic)',
	chainId: 80001,
	tokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
}

const BACKEND_URL = '${process.env.NEXT_BACKEND_URL}'

export default {
	currencies: {
		ethereum: {
			ethereum,
			usdceth
		},
		solana: {
			solana,
			usdcsol
		},
		matic: {
			matic,
			usdcmatic
		},
	},
	BACKEND_URL
}