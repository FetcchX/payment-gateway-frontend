import Head from 'next/head'
import Product from '../../components/Product'
import PaymentCard from '../../components/PaymentCard'
import { ChangeEvent, useLayoutEffect, useRef, useState } from 'react'
import { useEffect } from 'react'
import { supabase } from '../../supabase'
import { useRouter } from 'next/router'
import { Product as ProductInterface } from '../api/product'
import useTransactions from '../../hooks/useTransactions'
import { useAccountContext } from '../_context'

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
  visits: number
  products: ProductInterface[]
  fields: any[]
  webhook_urls: string[]
}

interface Props {
  store: Page
}

export const getServerSideProps = async (context: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_BACKEND_URL}/api/pages/get?slug=${context.params.store}&username=${context.params.username}`
    )
    const store: Page = await res.json()
    return {
      props: {
        store: store,
      },
    }
  } catch (e) {
    console.log(e)
  }
}

const Store = ({ store }: Props) => {
  const { query } = useRouter()
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

  const updateVisit = async () => {
    console.log(store.id)
    let data = await fetch(
      `${process.env.NEXT_BACKEND_URL}/api/pages`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          id: store.id,
          visits: store.visits + 1
        }),
        headers: {
          'Content-Type': 'application/json',
          'bearer-token': supabase.auth.session()?.access_token as string
        }
      }
    )
  }
  
  const [transactions, getTransactions, createTransaction] = useTransactions()

  useEffect(() => {
    updateVisit()
  }, [])

  useEffect(() => {
    if(query && query.price) {
      setTotalPrice(Number(query.price))
      setSelectProducts(true)
    }
  }, [])

  const [selectedProducts, setSelectedProducts] = useState<ProductInterface[]>(
    []
  )
  const [totalPrice, setTotalPrice] = useState(0)
  const [selectProducts, setSelectProducts] = useState(false)

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

  

  return (
    <div className="w-full min-h-screen bg-gray-900 font-inter">
      <Head>
        <title>{store.title} - WagPay</title>
      </Head>
      <main className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex justify-center items-start flex-col space-y-3">
          <h1 className="text-white font-jakarta text-3xl font-extrabold tracking-tight sm:text-4xl">
            {store.title}
          </h1>
          <p className='text-white'>{store.description}</p>
        </div>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <ul
              role="list"
              className="divide-y divide-gray-200 border-t border-b border-gray-200"
            >
              {store && store.products.map((product, productIdx) => (
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
            <PaymentCard
              accepted_currencies={store.accepted_currencies}
              setURL={setUrl}
              updateTransaction={updateTransaction}
              createTransaction={createTransaction}
              storeId={store.id}
              fields={store.fields}
              totalPrice={totalPrice}
              merchantETH={store.eth_address as string}
              merchantSOL={store.sol_address as string}
              setIsModalOpen={setIsModalOpen}
              setQrCode={setQrCode}
              selectedProducts={selectedProducts}
            />
          </section>
        </div>
      </main>
    </div>
  )
}

export default Store
