import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import { Invoice, Invoices } from "../types/Invoice"

const useInvoices = () => {
	const [invoices, setInvoices] = useState<Invoices>({ cursor: 0, data: [] } as Invoices)

	async function getInvoices(cursor?: number) {
		if(!cursor) {
			const data = await fetch('${process.env.NEXT_BACKEND_URL}/api/invoices/', {
				headers: {
					'bearer-token': supabase.auth.session()?.access_token as string,
				},
			})
			const res = await data.json()
			setInvoices(res)
		} else {
			const data = await fetch(`${process.env.NEXT_BACKEND_URL}/api/invoices?cursor=${cursor.toString()}`, {
				headers: {
					'bearer-token': supabase.auth.session()?.access_token as string,
				},
			})
			const res = await data.json()
			setInvoices(res)
		}
	}

	async function createInvoices(invoice: Invoice) {
		var data = await fetch('${process.env.NEXT_BACKEND_URL}/api/invoices/', {
			method: 'POST',
			body: JSON.stringify(invoice),
			headers: {
			'bearer-token': supabase.auth.session()?.access_token as string,
			'Content-Type': 'application/json'
			},
		})

		const res = await data.json()

		getInvoices()

		return res
	}

	useEffect(() => getInvoices() as any, [])

	return [invoices, getInvoices, createInvoices] as any
}

export default useInvoices