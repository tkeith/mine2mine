import { useRouter } from 'next/router'
import { taskInfo } from '..'

const TaskPage = () => {
  const router = useRouter()
  const { taskId } = router.query
  
  async function getSubmissionData() {
    const userData = await fetch( 'express/tasks/'+{taskId}+'/submissions', {
      method: 'GET'
    })
    console.log(userData)
    return await userData
  }

  return (
    <div className='bg-gradient-to-t from-cyan-900 to-zinc-700 h-screen text-white'>

        <div className=' text-center'>
            <h1>Task Number: {taskId}</h1>
            <h1>Audio Submissions:{}</h1>
        </div>
      
    </div>
  
  )
}

export default TaskPage
