export default Page

import React from 'react'
import { Counter } from '../../components/Counter'
import image from '../../assets/logo-new.svg'
import { Config } from 'vike-react/Config'
import { Button, Flex } from 'antd'

function Page() {
  // Will be printed on the server and in the browser:
  console.log('Rendering the landing page')

  return (
    <>
      <Config image={image}></Config>
      <h1>My Vike + React app</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
      <Flex gap="small" wrap>
        <Button type="primary">Primary Button</Button>
        <Button>Default Button</Button>
      </Flex>
    </>
  )
}
