import { useRouter } from 'next/router'
import { taskInfo } from '..'
import { useEffect, useState } from "react";


const TaskPage = () => {
  const router = useRouter()
  const { taskId } = router.query

  let [info, setInfo] = useState({subs: []})
  useEffect(function () {
    if (!router.isReady) return;
    (async () => {
      //alert('getting taskId: ' + taskId)
      const res = await (await fetch('https://mine2mine.tk.co/express/tasks/'+ taskId + '/submissions', {
        method: 'GET'
      })).json()
      // const taskId = res.taskId
      // const submissionId = res.submissionId
      // const creator = res.creator
      // const ipfsHash = res.ipfsHash

      setInfo({subs: res})
    })()
  }, [router.isReady])

  const rows = info.subs.map((sub) =>
    <tr><td className='p-4'>{sub.submissionId}</td><td className='p-4'>{sub.creator}</td><td className='p-4'><a href={'https://ipfs.io/ipfs/' + sub.ipfsHash}>IPFS Audio File</a></td></tr>)

  return (

    <div className='bg-gradient-to-t from-cyan-900 to-zinc-700 h-screen text-white'>
      <div style={{ width: '800px', margin: '0 auto', padding: '100px', border: 'solid 1px gray', padding: '20px' }}>

            <h1>Task Number: {taskId}</h1>
        <table>
          <thead>
            <tr>
              <th className='p-4'>ID</th>
              <th className='p-4'>Creator</th>
              <th className='p-4'>IPFS Audio File</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
        </div>
    </div>

  )
}

export default TaskPage
