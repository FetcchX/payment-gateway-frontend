import { useEffect, useState } from "react"
import { Product } from "../pages/api/product"
import { supabase } from "../supabase"
import { Page, Pages } from "../types/Pages"

const useProducts = () => {
	const [products, setProducts] = useState<Product[]>([])
	const [totalSold, setTotalSold] = useState<number>(0)

	async function getProducts(cursor?: number) {
		if(!cursor) {
			const data = await fetch('${process.env.NEXT_BACKEND_URL}/api/products/all/', {
				headers: {
					'bearer-token': supabase.auth.session()?.access_token as string,
				},
			})
			const res = await data.json()
			console.log(res, "RES")
			setProducts(res)
		} else {
			const data = await fetch(`${process.env.NEXT_BACKEND_URL}/api/products/all?cursor=${cursor.toString()}`, {
				headers: {
					'bearer-token': supabase.auth.session()?.access_token as string,
				},
			})
			const res = await data.json()
			setProducts(res)
		}
	}

	async function total_sold() {
		var data = await fetch('${process.env.NEXT_BACKEND_URL}/api/products/total_sold', {
			headers: {
				'bearer-token': supabase.auth.session()?.access_token as string,
				'Content-Type': 'application/json'
			},
		})

		const res = await data.json()
		
		setTotalSold(res._sum.sold + 1)

		return res
	}

	async function createProducts(page: Page) {
		var data = await fetch('${process.env.NEXT_BACKEND_URL}/api/products/', {
			method: 'POST',
			body: JSON.stringify(page),
			headers: {
				'bearer-token': supabase.auth.session()?.access_token as string,
				'Content-Type': 'application/json'
			},
		})

		const res = await data.json()

		return res
	}

	return [products, getProducts, createProducts, total_sold, totalSold] as any
}

export default useProducts