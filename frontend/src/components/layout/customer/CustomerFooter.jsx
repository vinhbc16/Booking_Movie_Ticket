import React from 'react'
import { Ticket } from 'lucide-react'

export function CustomerFooter() {
  return (
    <footer className="w-full bg-gray-900 text-gray-400">
      <div className="container mx-auto grid grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        {/* Column 1: Logo */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            {/* <Ticket className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-white">MyTicket</span> */}
            <div className="flex items-center gap-2 mb-4">
            <img 
              src="/logo.png" 
              alt="Logo" 
              // Add bg-white to make logo stand out on dark footer background
              className="h-14 w-auto object-contain bg-white rounded-md px-2 py-1" 
            />
          </div>
          </div>
          <p className="mt-4 text-sm">
            Vietnam's leading movie ticket booking platform.
          </p>
        </div>

        {/* Column 2: Movies */}
        <div>
          <h3 className="font-bold uppercase text-white">Movies</h3>
          <nav className="mt-4 flex flex-col gap-2">
            <a href="#" className="hover:text-white">Now Showing</a>
            <a href="#" className="hover:text-white">Coming Soon</a>
          </nav>
        </div>

        {/* Column 3: Support */}
        <div>
          <h3 className="font-bold uppercase text-white">Support</h3>
          <nav className="mt-4 flex flex-col gap-2">
            <a href="#" className="hover:text-white">FAQ</a>
            <a href="#" className="hover:text-white">Policies</a>
            <a href="#" className="hover:text-white">Contact</a>
          </nav>
        </div>

        {/* Column 4: Social */}
        <div>
          <h3 className="font-bold uppercase text-white">Connect</h3>
          {/* (Add social media icons here if desired) */}
        </div>
      </div>
      <div className="border-t border-gray-800 bg-gray-950 py-6">
        <p className="text-center text-sm">
          © 2025 MyTicket. All rights reserved.
        </p>
      </div>
    </footer>
  )
}