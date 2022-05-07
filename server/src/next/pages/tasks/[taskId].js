import { useRouter } from 'next/router'

const TaskPage = () => {
  const router = useRouter()
  const { taskId } = router.query

  return <p>Task: {taskId}</p>
}

export default TaskPage
