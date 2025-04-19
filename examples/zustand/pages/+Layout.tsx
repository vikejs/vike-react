import React from 'react'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div id="page-content">
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
      {children}
    </div>
  )
}
