import React from 'react'
import { Outlet } from 'react-router'
import { CustomerHeader } from './CustomerHeader'
import { CustomerFooter } from './CustomerFooter'

export function CustomerLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <CustomerHeader />
      <main className="flex-1 bg-background-secondary">
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  )
}