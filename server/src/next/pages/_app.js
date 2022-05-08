import React from 'react'
import '../styles/globals.css'
import { Ropsten, DAppProvider, useEtherBalance, useEthers, Config } from '@usedapp/core'
import { TasksTable } from '.'

const dappConfig = {
  readOnlyChainId: Ropsten.chainId,
  readOnlyUrls: {
    [Ropsten.chainId]: 'https://ropsten.infura.io/v3/51eeb67768ac4350add3fa2acd66fa67',
  },
}

function MyApp({ Component, pageProps }) {
  return(
    <DAppProvider config={dappConfig}>
      <Component {...pageProps} />
    </DAppProvider>
  )
  
}

export default MyApp
