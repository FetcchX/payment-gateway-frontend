import Link from 'next/link'
import { useState } from 'react'

import ConnectWallet from '../Wallet'

import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'

// const navigation = [
//   // { name: 'Dashboard', href: '#' },
//   // { name: 'Use Cases', href: '#' },
//   // { name: 'Help', href: '#' },
// ]

const Navbar = () => {
  return (
    <Popover as="header" className="relative">
      <div className="bg-gray-900 py-6">
        <nav
          className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6"
          aria-label="Global"
        >
          <div className="flex flex-1 items-center">
            <div className="flex w-full items-center justify-between md:w-auto">
              <Link href="/">
                <a className="font-edds text-xl font-bold text-white">WagPay</a>
              </Link>
              <div className="-mr-2 flex items-center md:hidden">
                <Popover.Button className="focus-ring-inset inline-flex items-center justify-center rounded-md bg-gray-900 p-2 text-gray-400 hover:bg-gray-800 focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  <MenuIcon className="h-6 w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
            {/* <div className="hidden space-x-8 md:ml-10 md:flex">
              {navigation.map((item) => (
                <Link href={item.href}>
                  <a
                    key={item.name}
                    className="text-base font-medium text-gray-500 hover:text-gray-300"
                  >
                    {item.name}
                  </a>
                </Link>
              ))}
            </div> */}
          </div>
          <div className="hidden md:flex md:items-center md:space-x-6">
            {/* <Link href='/'>
              <a
                className="text-base font-medium text-white hover:text-gray-300"
              >
                Log in
              </a>
            </Link> */}
            <a
              href="https://0yesqjuxu6v.typeform.com/to/uRmp246z"
              className="inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white hover:bg-gray-700"
            >
              Join Waitlist
            </a>
          </div>
        </nav>
      </div>

      <Transition
        as={Fragment}
        enter="duration-150 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute inset-x-0 top-0 origin-top transform p-2 transition md:hidden"
        >
          <div className="overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-black ring-opacity-5">
            <div className="flex items-center justify-between px-5 pt-4">
              <div>
                <h1 className="text-xl font-bold">WagPay</h1>
              </div>
              <div className="-mr-2">
                <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 focus:outline-none">
                  <span className="sr-only">Close menu</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
            <div className="pt-5 pb-6">
              {/* <div className="space-y-1 px-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div> */}
              <div className="mt-6 px-5">
                <a
                  href="https://0yesqjuxu6v.typeform.com/to/uRmp246z"
                  className="hover:to-indigo-600s block w-full rounded-md bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 py-3 px-4 text-center font-medium text-white shadow hover:from-rose-500 hover:via-fuchsia-600"
                >
                  Join Waitlist
                </a>
              </div>
              {/* <div className="mt-6 px-5">
                <p className="text-center text-base font-medium text-gray-500">
                  Existing customer?{' '}
                  <Link href="/">
                    <a className="text-gray-900 hover:underline">
                      Login
                    </a>
                  </Link>
                </p>
              </div> */}
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}

export default Navbar