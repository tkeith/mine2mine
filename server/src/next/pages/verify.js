import Router from 'next/router'
import { useEffect, useState } from "react";
import { TextButton } from "../components/misc";

export default function VerifyPage() {

  let [info, setInfo] = useState(null)

  useEffect(function () {
    (async () => {
      const res = await (await fetch('/express/getVerifyTask', {
        method: 'GET'
      })).json()
      const taskId = res.taskId
      const submissionId = res.submissionId
      const options = res.options
      const ipfsHash = res.ipfsHash
      setInfo({ taskId: taskId, submissionId: submissionId, options: options, ipfsHash: ipfsHash })
    })()
  }, [])

  async function complete(taskId, submissionId, option) {
    setInfo(null)
    const res = await (await fetch('/express/verifyTask', {
      body: JSON.stringify({
        taskId: taskId,
        submissionId: submissionId,
        option: option
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })).json()
    alert(res)
    Router.reload()
  }

  return (
    info ? (
      <div className='bg-gradient-to-t from-cyan-900 to-zinc-700 h-screen text-white'>
      <div style={{ width: '200px', margin: '0 auto', border: 'solid 1px gray', padding: '20px' }}><div>
        <a href={'https://ipfs.io/ipfs/' + info.ipfsHash}>Audio file</a>
        <div style={{ height: '20px' }} />
        <div> <TextButton onClick={() => complete(info.taskId, info.submissionId, info.options[0])}>{info.options[0]}</TextButton> </div>
        <div style={{ height: '20px' }} />
        <div> <TextButton onClick={() => complete(info.taskId, info.submissionId, info.options[1])}>{info.options[1]}</TextButton> </div>
        <div style={{ height: '20px' }} />
        <div> <TextButton onClick={() => complete(info.taskId, info.submissionId, info.options[2])}>{info.options[2]}</TextButton> </div>
        <div style={{ height: '20px' }} />
        <div> <TextButton onClick={() => complete(info.taskId, info.submissionId, info.options[3])}>{info.options[3]}</TextButton> </div>
        </div></div></div>
    ) :
      <div className='bg-gradient-to-t from-cyan-900 to-zinc-700 h-screen text-white'>
        <div style={{ width: '100px', margin: '0 auto', padding: '50px' }} > <div>Loading...</div></div>
      </div>
    )
}
