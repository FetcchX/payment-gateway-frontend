import {
  CollectionIcon,
  CogIcon,
  CreditCardIcon,
  HomeIcon,
  MenuAlt1Icon,
  QuestionMarkCircleIcon,
  ShoppingCartIcon,
  ScaleIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  XIcon,
} from '@heroicons/react/outline'
import {
  CashIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  OfficeBuildingIcon,
  SearchIcon,
  PlusIcon,
  XCircleIcon,
} from '@heroicons/react/solid'
import { useState, useEffect } from 'react'
import * as blockies from 'ethereum-blockies-png'
import NewStore from './NewStore'
import NewInvoice from './NewInvoice'

interface Props {
  user: any
  currentTab: string
}

const PageHeader = ({ user, currentTab }: Props) => {
  const [img, setImg] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)

  useEffect(() => {
    const dataURL = blockies.createDataURL({ seed: user.username })
    setImg(dataURL)
  }, [user])

  useEffect(() => console.log(isInvoiceOpen), [isInvoiceOpen])

  return (
    <div className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
        <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
          <div className="min-w-0 flex-1">
            <div className="flex items-center">
              <img
                className="hidden h-16 w-16 rounded-full sm:block"
                src={img}
                alt=""
              />
              <div>
                <div className="flex items-center">
                  <img
                    className="h-16 w-16 rounded-full sm:hidden"
                    src={img}
                    alt=""
                  />
                  <h1 className="ml-3 font-inter text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                    Good morning, {user.username}
                  </h1>
                </div>
                <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                  <dt className="sr-only">Company</dt>
                  <dd className="flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6">
                    <OfficeBuildingIcon
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    India
                  </dd>
                  <dt className="sr-only">Account status</dt>
                  <dd className="mt-3 flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6 sm:mt-0">
                    <CheckCircleIcon
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400"
                      aria-hidden="true"
                    />
                    Verified account
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Edit Profile
            </button>
            {currentTab === 'invoices' ?
              <button
                onClick={() => setIsInvoiceOpen(true)}
                type="button"
                className="flex items-center space-x-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span>New Invoices</span>
                <span className="h-5 w-5">
                  <PlusIcon />
                </span>
              </button>
            :
              <button
                onClick={() => setIsOpen(true)}
                type="button"
                className="flex items-center space-x-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span>New Store</span>
                <span className="h-5 w-5">
                  <PlusIcon />
                </span>
              </button>
            }
            
          </div>
        </div>
      </div>

      <div
        className={
          (isInvoiceOpen || isOpen ? '' : 'hidden ') +
          'absolute top-1/2 left-1/2 z-50 h-full w-full -translate-x-1/2 -translate-y-1/2 transform backdrop-blur-sm'
        }
      >
        <XCircleIcon
          onClick={() => {setIsInvoiceOpen(false); setIsOpen(false)}}
          className="absolute top-10 right-1/3 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer"
        />
        
        <NewInvoice
          isOpen={isInvoiceOpen}
          setIsOpen={setIsInvoiceOpen}
          username={user.username}
        />
        <NewStore
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          username={user.username}
        />
      </div>
    </div>
  )
}

export default PageHeader
