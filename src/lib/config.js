import { promises } from 'fs'

const reacConfig = async () => {
  const data = await promises.readFile('/opt/config.json')
  const cfg = JSON.parse(data)
  return cfg
}

let cfgPromise

const getConfig = () => {
  if (!cfgPromise) {
    cfgPromise = reacConfig()
  }
  return cfgPromise
}

export default getConfig
