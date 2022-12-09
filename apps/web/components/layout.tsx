import Navbar from './navbar'
import Footer from './footer'
import { AppProps } from 'next/app'

export default function Layout({ children }: any) {
  return (
    <>
        <div className="w-full bg-neutral-900 bp4-dark">
            <div className="mx-auto p-1">
            <Navbar />


        <main>{children}</main>

        </div>

        </div>
    </>
  )
}