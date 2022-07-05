import { Page } from "../types/Pages"
import { Product } from "../pages/api/product"

export interface Invoice {
	id?: string
	value: number
	discount: number
	Tax: number
	submissionId?: number
	name: string
	address?: string
	supported_currencies: string[]
	pageId: number
	products: Product[]
	page?: Page
	extra_products: any[]
	due_date: Date
	notes?: string
	email?: string
	created_at?: Date
}

export interface Invoices {
	cursor: number
	data: Invoice[]
}