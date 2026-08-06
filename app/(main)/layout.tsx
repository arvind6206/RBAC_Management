import React from 'react'
import Header from '../components/layout/Header'
import { getCurrentUSer } from '../lib/auth'

const MainLayout = async ({children}: {children: React.ReactNode}) => {
  const user = await getCurrentUSer()
  return (
    <div>
      <Header user={user ?? null}/>
      <main className='container mx-auto px-4 py-8'>{children}</main>
    </div>
  )
}

export default MainLayout
