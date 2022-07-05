import { useEffect, useState } from 'react'
import { PlusIcon, XIcon } from '@heroicons/react/solid'
import { supabase } from '../../supabase'
import toast from 'react-hot-toast'

import StoreSuccess from './StoreSuccess'
import { uploadFile } from '../../pages/api/pages/create'
import usePages from '../../hooks/usePage'
import useProducts from '../../hooks/useProducts'
import { Product as ProductInterface } from "../../pages/api/product"
import useInvoices from '../../hooks/useInvoices'

type supported_currencies = 'Ethereum' | 'Solana'

interface Props {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  username: string
}

interface Product {
  discounted_price: number
  price: number
  name: string
  description: string
  links: string[]
}

interface Field {
  name: string
  type: string
  value: string
}

type _fields = 'name' | 'type'
type _products = 'discounted_price' | 'price' | 'name' | 'description' | 'links' | 'image'

const supported_currencies = [{name: 'Ethereum', symbol: 'ethereum'}, {name: 'Solana', symbol: "solana"}, {name: 'USDC (Solana)', symbol: 'usdcsol'}, {name: 'USDC (Ethereum)', symbol: 'usdceth'}]

const supported_types = ['text', 'number']

const NewInvoice = (props: Props) => {
  const [invoice, getInvoice, createInvoice] = useInvoices()
  const [_products, getProducts] = useProducts()

  useEffect(() => getProducts(), [])
  
  const [products, setProducts] = useState<Product[]>([])

  const [storeSuccess, setStoreSuccess] = useState(false)
  const [tweet, setTweet] = useState('')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [value, setvalue] = useState(0)
  const [discount, setDiscount] = useState(0.00)
  const [tax, setTax] = useState(0.00)
  const [address, setAddress] = useState('')
  const [eth, setETH] = useState<string>('')
  const [sol, setSOL] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [dueDate, setDueDate] = useState<Date>(new Date())
  const [currencies, setCurrencies] = useState<string[]>([])
  const [showCurrencies, setShowCurrencies] = useState<string[]>([])
  const [selectProducts, setSelectProducts] = useState<string[]>([])
  const [selectedPage, setSelectedPage] = useState<string[]>([])
  const [showProducts, setShowProducts] = useState<string[]>([])

  const changeProduct = async (field: _products, value: any, idx: number) => {
    console.log(field, value, idx)
    if (field === 'discounted_price') {
      setProducts((prevState) => {
        let product_values = [...products]
        product_values[idx].discounted_price = Number(value)
        product_values[idx].price = Number(value)
        return product_values
      })
    } else if (field === 'price') {
      setProducts((prevState) => {
        let product_values = [...products]
        product_values[idx].price = Number(value)
        return product_values
      })
    } else if (field === 'description') {
      setProducts((prevState) => {
        let product_values = [...products]
        product_values[idx].description = value as string
        return product_values
      })
    } else if (field === 'name') {
      console.log('1')
      setProducts((prevState) => {
        let product_values = [...products]
        product_values[idx].name = value as string
        return product_values
      })
    } else if (field === 'links') {
      setProducts((prevState) => {
        let product_values = [...products]
        product_values[idx].links = String(value).split(',')
        return product_values
      })
    }
  }

  // @ts-ignore
  const handleImage = (file, setImg: Function) => {
    console.log(file[0], "FILE")
    setImg(file[0])
  }

  const submit = async () => {
    if (typeof products === 'undefined' || products.length <= 0) {
      console.log('dsa')

      toast.error('Add Products')
      return
    }

    const toastId = toast.loading('Creating Store')
    try {
      await createInvoice({
        value: value,
        discount: discount,
        Tax: tax,
        name: name,
        address: address,
        supported_currencies: currencies,
        page: selectedPage,
        products: {connect: selectProducts},
        extra_products: products,
        due_date: dueDate,
        notes: description,
        email: email,
      })
    } catch (e) {
      props.setIsOpen(false)
      toast.dismiss(toastId)
      toast.error("Can't create a store")
      return
    }

    // uploadFile(logo as File, `${res.id}/logo.png`)

    toast.dismiss(toastId)
    toast.success('Successfully Created Store')
    props.setIsOpen(false)
    setStoreSuccess(true)
  }

  const removeProduct = (idx: number) => {
    setProducts((ps) => {
      let newProducts = [...products]
      newProducts.splice(idx, 1)
      return newProducts
    })
  }

  useEffect(() => console.log(dueDate), [dueDate])

  return (
    <div
      className={
        (props.isOpen ? '' : 'hidden ') +
        'absolute top-0 right-0 z-50 h-screen w-11/12 lg:w-1/3 space-y-5 overflow-y-scroll bg-indigo-500 px-16 pt-10 text-white'
      }
    >
      <h1 className="text-3xl font-black">Create a New Invoice</h1>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">Name</label>
        <input
          type="text"
          name="Store"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">
          Note
        </label>
        <textarea
          name="Store"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        ></textarea>
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">Invoice Value</label>
        <input
          type="number"
          name="Store"
          value={value}
          onChange={(e) => setvalue(Number(e.target.value))}
          className="rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">Discount (discount should be less than value)</label>
        <input
          type="number"
          name="Store"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          className="rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">Tax Rate %</label>
        <input
          type="number"
          name="Store"
          value={tax}
          onChange={(e) => setTax(Number(e.target.value))}
          className="rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">
          Address
        </label>
        <input
          type="text"
          name="Store"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">
          email
        </label>
        <input
          type="text"
          name="Store"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">
          due date
        </label>
        <input
          type="date"
          name="Store"
          value={dueDate.toISOString().split('T')[0]}
          onChange={(e) => setDueDate(new Date(e.target.value))}
          className="rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">
          Ethereum Address (If its blank, user's ethereum address will be user)
        </label>
        <input
          type="text"
          name="Store"
          value={eth}
          onChange={(e) => setETH(e.target.value)}
          className="rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">
          Solana Address (If its blank, user's solana address will be user)
        </label>
        <input
          type="text"
          name="Store"
          value={sol}
          onChange={(e) => setSOL(e.target.value)}
          className="rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">Supported Currenices</label>
        <p className='space-x-2'>
          {showCurrencies.map((v) => (
            <span>{v}</span>
          ))}
        </p>
        <select
          className="form-select block
						w-1/3
						appearance-none
						rounded-xl
						border
						border-solid
						border-gray-300
						bg-white
						bg-clip-padding bg-no-repeat px-3
						py-1.5 text-base font-normal
						text-gray-700
						transition
						ease-in-out
						focus:border-indigo-600 focus:bg-white focus:text-gray-700 focus:outline-none"
          aria-label="Default select example"
          onChange={(e) => {if(currencies.includes(e.target.value)) {return}; setCurrencies(() => [...currencies, e.target.value]); setShowCurrencies(() => [...showCurrencies, supported_currencies[e.target.selectedIndex].name])}}
        >
          {supported_currencies.map((value) => {
            return <option value={value.symbol}>{value.name}</option>
          })}
        </select>
      </div>
      <div className="flex flex-col space-y-2">
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">Select Products</label>
        <p className='space-x-2'>
          {showProducts.map((v) => (
            <span>{v}</span>
          ))}
        </p>
        <select
          className="form-select block
						w-1/3
						appearance-none
						rounded-xl
						border
						border-solid
						border-gray-300
						bg-white
						bg-clip-padding bg-no-repeat px-3
						py-1.5 text-base font-normal
						text-gray-700
						transition
						ease-in-out
						focus:border-indigo-600 focus:bg-white focus:text-gray-700 focus:outline-none"
          aria-label="Default select example"
          onChange={(e) => {if(selectProducts.includes(e.target.value)) {return}; setSelectProducts(() => [...selectProducts, e.target.value]); setShowProducts(() => [...showProducts, _products[e.target.selectedIndex].name])}}
        >
          {_products && _products.map((value: ProductInterface) => {
            return <option value={value.id}>{value.name}</option>
          })}
        </select>
      </div>
        <label htmlFor="Store">Products</label>
        {products.map((product, idx) => {
          return (
            <div key={idx} className="flex flex-col space-y-2">
              <div className='w-full flex justify-between items-center'>
                <h3>Product {product.name}</h3>
                <span className='text-3xl cursor-pointer' onClick={() => removeProduct(idx)}>-</span>
              </div>
              <div className="flex space-x-2">
                <input
                  value={product.name}
                  onChange={(e) => changeProduct('name', e.target.value, idx)}
                  type="text"
                  name="Store"
                  placeholder="Name"
                  className="w-1/2 rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                />
                <input
                  value={product.discounted_price}
                  onChange={(e) =>
                    changeProduct('discounted_price', e.target.value, idx)
                  }
                  type="text"
                  name="Store"
                  placeholder="Price"
                  className="w-1/2 rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                />
              </div>
              <input
                value={product.links.join()}
                onChange={(e) => changeProduct('links', e.target.value, idx)}
                type="text"
                name="Store"
                placeholder="Links"
                className="w-full rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
              <textarea
                value={product.description}
                onChange={(e) =>
                  changeProduct('description', e.target.value, idx)
                }
                name="Store"
                placeholder="description"
                className="rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              ></textarea>
            </div>
          )
        })}
        <button
          onClick={() =>
            setProducts(() => [
              ...products,
              {
                discounted_price: 0,
                price: 0,
                name: '',
                description: '',
                links: [],
                sold: 0
              },
            ])
          }
          type="button"
          className="flex items-center justify-center space-x-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <span>New Product</span>
          <span className="h-5 w-5">
            <PlusIcon />
          </span>
        </button>
      </div>
      <button
        onClick={() => submit()}
        type="button"
        className="flex items-center justify-center space-x-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Submit
      </button>
      {storeSuccess && <StoreSuccess tweet_text={tweet} />}
    </div>
  )
}

export default NewInvoice