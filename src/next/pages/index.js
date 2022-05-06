import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { getText } from '../../lib/misc.js'
import Router from 'next/router'

function Form({ startingText }) {
  const saveText = async event => {
    event.preventDefault()

    const res = await fetch('/express/save', {
      body: JSON.stringify({
        text: event.target.text.value
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    Router.reload()
  }

  return (
    <form onSubmit={saveText}>
      <div className="form-group mb-6">
        <label htmlFor="text" className="form-label inline-block mb-2 text-gray-700">text</label>
        <input type="text" className="form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="text" aria-describedby="textHelp" placeholder="enter text" defaultValue={startingText} />
        <small id="textHelp" className="block mt-1 text-xs text-gray-600">some text to save</small>
      </div>
      <button type="submit" className="
        px-6
        py-2.5
        bg-blue-600
        text-white
        font-medium
        text-xs
        leading-tight
        uppercase
        rounded
        shadow-md
        hover:bg-blue-700 hover:shadow-lg
        focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
        active:bg-blue-800 active:shadow-lg
        transition
        duration-150
        ease-in-out">save</button>
    </form>
  )
}

export default function Home({ text }) {
  return (
    <>
      <p className="text-3xl font-bold underline">hello world.text: {text}</p>
      <Form startingText={text} />
    </>
  )
}

export async function getServerSideProps() {
  return {
    props: {
      text: await getText()
    }
  }
}
