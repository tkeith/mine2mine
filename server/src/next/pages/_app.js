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
    <div className='bg-gradient-to-t from-cyan-900 to-zinc-700 h-screen'>
      <div className='justify-center  items-center flex'>
          <div className='border-3 border-gray-100 bg-gray-100 rounded-2xl ml-10 mr-10 w-fit m-12'>
            <DAppProvider config={dappConfig}>
              <Component {...pageProps} />
            </DAppProvider>
          </div>
          <div className='border-3 border-gray-100 bg-gray-100 rounded-2xl ml-10 mr-10 w-fit m-12'>
              <h1>Tasks</h1>
              <TasksTable />
          </div>
      </div>
    </div>
   
  )
  
}

export default MyApp
