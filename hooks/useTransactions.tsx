import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import { Transactions } from "../types/Transaction"

const useTransactions = () => {
	const [transactions, setTransactions] = useState<Transactions>({ cursor: 0, data: [] } as Transactions)
	const [totalEarned, setTotalEarned] = useState(0)

	async function getTransactions(cursor?: number) {
		const data = await fetch(`${process.env.NEXT_BACKEND_URL}/api/submissions/?cursor=${cursor?.toString()}`, {
			headers: {
				'bearer-token': supabase.auth.session()?.access_token as string,
			},
		})
		const res = await data.json()

		console.log(res, "RES")

		if(res.data.length <= 0) {console.log('dsa');setTransactions({ cursor: 0, data: [{}] } as Transactions)}
		else setTransactions(res)
	}

	async function createTransaction(
		email: string,
		fields: any,
		eth: string,
		sol: string,
		currency: string,
		txHash: string,
		page_id: number,
		selectedProducts: any,
		total_prices: number
	) {
		console.log(total_prices)
		let transaction: any = {
		  email: email,
		  fields: fields,
		  eth_address: eth,
		  sol_address: sol,
		  currency: currency,
		  products: {connect: selectedProducts.map((value: any) => {return {id: value.id}})},
		  transaction_hash: txHash,
		  total_prices: total_prices
		}

		if(page_id !== 0) {
			transaction.pagesId = page_id
		}

		const data = await fetch(`https://wagpay.club/api/submissions/`, {
		  method: 'POST',
		  body: JSON.stringify(transaction),
		  headers: {
			  'Content-Type': 'application/json'
		  }
		})

		let res = await data.json()

		return res.id
	}

	async function getTotalEarned() {
		const data = await fetch(`${process.env.NEXT_BACKEND_URL}/api/submissions/total_earned`, {
		  headers: {
			'bearer-token': supabase.auth.session()?.access_token as string,
			'Content-Type': 'application/json'
		  }
		})
		let res = await data.json()

		setTotalEarned(res._sum.total_prices)
	}

	useEffect(() => getTotalEarned() as any, [])

	return [transactions, getTransactions, createTransaction, totalEarned] as any
}

export default useTransactions