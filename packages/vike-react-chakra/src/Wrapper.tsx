export { Wrapper }

import React, { type ReactNode } from 'react'
import { ChakraProvider, LocaleProvider, defaultSystem } from '@chakra-ui/react'
import { usePageContext } from 'vike-react/usePageContext'

function Wrapper({ children }: { children: ReactNode }) {
  const pageContext = usePageContext()
  const { chakra } = pageContext.config

  if (chakra === null) {
    return <>{children}</>
  }

  return (
    <ChakraProvider value={chakra?.system ?? defaultSystem}>
      <ChakraLocaleProvider locale={chakra?.locale}>{children}</ChakraLocaleProvider>
    </ChakraProvider>
  )
}

function ChakraLocaleProvider({ locale, children }: { locale?: string; children: ReactNode }) {
  if (locale) {
    return <LocaleProvider locale={locale}>{children}</LocaleProvider>
  }
  return <>{children}</>
}
