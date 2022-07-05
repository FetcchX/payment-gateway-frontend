import { useEffect, useState } from 'react'
import { PlusIcon, XIcon } from '@heroicons/react/solid'
import { supabase } from '../../supabase'
import toast from 'react-hot-toast'

import StoreSuccess from './StoreSuccess'
import { uploadFile } from '../../pages/api/pages/create'
import usePages from '../../hooks/usePage'

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

const supported_currencies = [{name: 'Ethereum', symbol: 'ETH'}, {name: 'Solana', symbol: "SOL"}, {name: 'USDC (Solana)', symbol: 'usdcsol'}, {name: 'USDC (Ethereum)', symbol: 'usdceth'}]

const supported_types = ['text', 'number']

const NewStore = (props: Props) => {
  const [pages, getPages, createPage] = usePages()
  
  const [products, setProducts] = useState<Product[]>([])
  const [fields, setFields] = useState<Field[]>([])

  const [storeSuccess, setStoreSuccess] = useState(false)
  const [tweet, setTweet] = useState('')

  const [title, setTitle] = useState('')
  const [logo, setLogo] = useState<File>()
  const [description, setDescription] = useState('')
  const [socialLinks, setSocialLinks] = useState<object>({})
  const [currencies, setCurrencies] = useState<string[]>([])
  const [slug, setSlug] = useState<string>('')
  const [eth, setETH] = useState<string>('')
  const [sol, setSOL] = useState<string>('')
  const [showCurrencies, setShowCurrencies] = useState<string[]>([])

  const changeField = async (field: _fields, value: any | null, idx: number) => {
    console.log(field, value, idx, fields.length)
    await setFields((previousState) => {
      let field_values = [...fields]
      console.log(field_values, fields.length)
      field_values[idx][field] = value
      console.log(field_values, fields.length)
      return field_values
    })
  }

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
    if (typeof fields === 'undefined' || fields.length <= 0) {
      toast.error('Add Fields')
      return
    }

    const toastId = toast.loading('Creating Store')
    try {
      await createPage({
        title: title,
        logo: logo,
        description: description,
        social_links: socialLinks,
        accepted_currencies: currencies,
        slug: slug,
        eth_address: eth,
        sol_address: sol,
        visits: 0,
        products: {create: products},
        fields: fields,
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
    setTweet(`https://wagpay.xyz/${props.username}/${slug}`)
    setStoreSuccess(true)
  }

  const removeField = (idx: number) => {
    setFields((ps) => {
      let newFields = [...fields]
      newFields.splice(idx, 1)
      return newFields
    })
  }

  const removeProduct = (idx: number) => {
    setProducts((ps) => {
      let newProducts = [...products]
      newProducts.splice(idx, 1)
      return newProducts
    })
  }

  useEffect(() => console.log(products), [products])

  return (
    <div
      className={
        (props.isOpen ? '' : 'hidden ') +
        'absolute top-0 right-0 z-50 h-screen w-11/12 lg:w-1/3 space-y-5 overflow-y-scroll bg-indigo-500 px-16 pt-10 text-white'
      }
    >
      <h1 className="text-3xl font-black">Create a New Store</h1>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">Store Name</label>
        <input
          type="text"
          name="Store"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">Store Logo</label>
        <div className="block h-full w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <input
            type="file"
            name="store_logo"
            onChange={(e) => handleImage(e.target.files, setLogo)}
            className="m-0 h-full w-full cursor-pointer rounded-full p-0 outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">
          Store Description (What you sell? Who you are?)
        </label>
        <textarea
          name="Store"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        ></textarea>
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Store">Store Slug (/store-name)</label>
        <input
          type="text"
          name="Store"
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase())}
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
        <label htmlFor="Store">Form Fields</label>
        {fields.map((field, idx) => {
          return (
            <div key={idx} className="flex flex-col space-y-2">
              <div className='w-full flex justify-between items-center'>
                <h3>Field {field.name}</h3>
                <span className='text-3xl cursor-pointer' onClick={() => removeField(idx)}>-</span>
              </div>
              <div className="flex space-x-2">
                <input
                  value={field.name}
                  onChange={(e) => changeField('name', e.target.value, idx)}
                  type="text"
                  name="Store"
                  placeholder="Field Name"
                  className="w-1/2 rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                />
                <div className="bg-white w-1/2 rounded-xl border-none text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                  <select
                    className="relative block w-full rounded-md border-gray-300 bg-transparent focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    aria-label="Default select example"
                    value={field.type}
                    onChange={(e) =>
                      changeField('type', e.target.value, idx)
                    }
                  >
                    {supported_types.map(value => {
                      return <option value={value}>{value}</option>
                    })}
                  </select>
                </div>
              </div>
            </div>
          )
        })}
        <button
          onClick={() => {
            setFields(() => [...fields, { name: '', type: '', value: '' }])
          }}
          type="button"
          className="flex items-center justify-center space-x-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <span>New Field</span>
          <span className="h-5 w-5">
            <PlusIcon />
          </span>
        </button>
      </div>
      <div className="flex flex-col space-y-2">
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

export default NewStore