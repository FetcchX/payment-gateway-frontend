import { PublicKey } from "@solana/web3.js";

export interface Transaction {
	to: string | PublicKey
	value: string | number
	fields: any
	price: number
	page?: any
	id?: any
} 