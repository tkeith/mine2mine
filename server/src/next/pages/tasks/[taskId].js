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
  <p><span>{sub.creator}</span><span>{sub.ipfsHash}</span></p>)

  return (
    <div className='bg-gradient-to-t from-cyan-900 to-zinc-700 h-screen text-white'>

        <div className=' text-center'>
            <h1>Task Number: {taskId}</h1>
            {rows}
        </div>

    </div>

  )
}

export default TaskPage
