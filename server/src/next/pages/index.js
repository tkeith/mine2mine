import { useEtherBalance, useEthers } from '@usedapp/core'
import { formatEther } from '@ethersproject/units'
import { TextButton } from '../components/misc.js'

export default function DAppPage() {
  const { activateBrowserWallet, account } = useEthers()
  const etherBalance = useEtherBalance(account)
  return (
    <div>
      {account || <div>
        <TextButton onClick={() => activateBrowserWallet()}>Connect wallet</TextButton>
      </div>}
      {account && <p>Account: {account}</p>}
    </div>
  )
}
