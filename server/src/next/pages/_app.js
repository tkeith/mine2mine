import React from 'react'
import '../styles/globals.css'
import { Ropsten, DAppProvider, useEtherBalance, useEthers, Config } from '@usedapp/core'
import { TasksTable } from '.'

const dappConfig = {}

function MyApp({ Component, pageProps }) {
  return(
    <DAppProvider config={dappConfig}>
      <Component {...pageProps} />
    </DAppProvider>
  )

}

export default MyApp
