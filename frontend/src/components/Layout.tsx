import React from 'react'
import { Toaster } from './ui/toaster'
import Footer from './Footer'
import Navbar from './Navbar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 text-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 md:p-6">{children}</main>
      <Footer />
      <Toaster />
    </div>
  )
}

export default Layout
