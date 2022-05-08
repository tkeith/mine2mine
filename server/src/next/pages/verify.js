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

  function complete(option) {
    alert(option)
  }

  return (
    info ? (

      <div>
        <a href={'https://ipfs.io/ipfs/' + info.ipfsHash}>Audio file</a>
        <div> <TextButton onClick={() => complete(info.options[0])}>{info.options[0]}</TextButton> </div>
        <div> <TextButton onClick={() => complete(info.options[0])}>{info.options[1]}</TextButton> </div>
        <div> <TextButton onClick={() => complete(info.options[0])}>{info.options[2]}</TextButton> </div>
        <div> <TextButton onClick={() => complete(info.options[0])}>{info.options[3]}</TextButton> </div>
      </div>
    ) : <div>Loading...</div>
  )
}
