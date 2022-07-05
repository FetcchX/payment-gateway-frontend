import Head from 'next/head'
import Product from '../../../components/Product'
import PaymentCard from '../../../components/PaymentCard'
import { ChangeEvent, useLayoutEffect, useRef, useState } from 'react'
import { useEffect } from 'react'
import { supabase } from '../../../supabase'
import { useRouter } from 'next/router'
import { Product as ProductInterface } from '../../api/product'
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

import {
  PlusIcon,
  MinusIcon
} from '@heroicons/react/solid'
import useTransactions from '../../../hooks/useTransactions'
import { Invoice } from 'Invoice'

interface Page {
  id: number
  title: string
  logo: string
  description: string
  social_links: Object
  accepted_currencies: string[]
  terms_conditions: string[]
  slug: string
  eth_address?: string
  sol_address?: string
  user: number
  products: ProductInterface[]
  fields: any[]
}

interface Props {
  invoice: Invoice
}

export const getServerSideProps = async (context: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_BACKEND_URL}/api/invoices/${context.params.invoice}`
    )
    const invoice: Invoice = await res.json()
    console.log(invoice)
    return {
      props: {
        invoice: invoice,
      },
    }
  } catch (e) {
    console.log(e)
  }
}

const Store = ({ invoice }: Props) => {
  console.log(invoice)
  const { query } = useRouter()

  const updateVisit = async () => {
    console.log(invoice.id)
    let data = await fetch(
      `https://wagpay.xyz/api/pages/updateVisits?id=${invoice.id}`,
      {
        method: 'PATCH',
      }
    )
  }
  
  const [transactions, getTransactions, createTransaction] = useTransactions()

  useEffect(() => {
    updateVisit()
  }, [])

  useEffect(() => {
    if (query.products) {
      const products = query.products as string[]
      (async () => {
        let ids: ProductInterface[] = []
        const promise = await products.map(async (v) => {
          let data = await fetch(`https://wagpay.xyz/api/products/${v}`)
          let product = (await data.json()) as ProductInterface
          console.log(product)
          ids.push(product)
        })
        await Promise.all(promise)
        addNewProduct(ids)
      })()
    }
  }, [])

  useEffect(() => {
    if(query && query.price) {
      setTotalPrice(Number(query.price))
      setSelectProducts(true)
    }
  }, [])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [qrCode, setQrCode] = useState(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png'
  )
  const [selectedProducts, setSelectedProducts] = useState<ProductInterface[]>(
    []
  )
  const [totalPrice, setTotalPrice] = useState(0)
  const [selectProducts, setSelectProducts] = useState(false)
  const [url, setUrl] = useState('https://qr-code-styling.com')

  useEffect(() => console.log(qrCode), [qrCode])

  const addNewProduct = async (productId: ProductInterface[]) => {
    let unique: ProductInterface[] = [...selectedProducts, ...productId]

    let totalValue = 0
    const promise = await unique.map(
      (value) => (totalValue += value.discounted_price)
    )
    await Promise.all(promise)
    setTotalPrice(totalValue)
    setSelectedProducts(unique)
  }

  useEffect(() => console.log(selectedProducts), [selectedProducts])

  const removeProduct = async (productId: ProductInterface[]) => {
    let unique: ProductInterface[] = selectedProducts
    for (let i = 0; i < unique.length; i++) {
      if (unique[i].id === productId[0].id) {
        unique.splice(i, 1)
        break
      }
    }
    console.log(unique)
    let totalValue = 0
    const promise = await unique.map(
      (value) => (totalValue += value.discounted_price)
    )
    await Promise.all(promise)
    setTotalPrice(totalValue)
    setSelectedProducts(unique)
  }

  const updateTransaction = async (
    transactionId: number,
    successful: boolean,
    transactionHash: string
  ) => {
    const transaction = {
      id: transactionId,
      transaction_hash: transactionHash,
    }
    console.log(transaction)
    const data = await fetch('/api/submissions/update', {
      method: 'POST',
      body: JSON.stringify(transaction),
    })
    const res = await data.json()

    console.log(res)
  }

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

  return (
    <div className="w-full min-h-screen bg-gray-900 font-inter">
      <Head>
        <title>{invoice.name} - WagPay</title>
      </Head>
      <div className={(isModalOpen ? "" : "hidden") + "w-full h-full backdrop-blur-sm absolute z-50"} onClick={() => setIsModalOpen(false)}>
        <div className={(isModalOpen ? "" : "hidden") + " absolute bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-transparent w-64 h-64"}>
				  <p className='text-white'>Scan this code to pay with any solana mobile wallet</p>
          <div ref={ref}></div>
				</div>
			</div>
      <main className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex justify-center items-start flex-col space-y-3">
          <h1 className="text-white font-jakarta text-3xl font-extrabold tracking-tight sm:text-4xl">
            {invoice.name}
          </h1>
          <p className='text-white'>{invoice.notes}</p>
        </div>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <ul
              role="list"
              className="divide-y divide-gray-200 border-t border-b border-gray-200"
            >
              {invoice && invoice.products.map((product, productIdx) => (
                <>
                <Product selectProducts={selectProducts} product={product} add={addNewProduct} remove={removeProduct} productIds={query.products as any[]} />
                </>
              ))}
              {invoice && invoice.extra_products.map((product, productIdx) => (
                <>
                <Product selectProducts={selectProducts} product={product} add={addNewProduct} remove={removeProduct} productIds={query.products as any[]} />
                </>
              ))}
            </ul>
          </section>

          {/* Payment Card */}
          <section
            aria-labelledby="payment-card"
            className="lg:fixed lg:right-20 2xl:right-80 lg:w-1/3 xl:w-1/3 2xl:w-1/4 mt-16 rounded-lg  lg:col-span-5 lg:mt-0"
          >
          </section>
        </div>
      </main>
    </div>
  )
}

export default Store
