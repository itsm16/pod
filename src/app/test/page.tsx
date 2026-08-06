import React from 'react'
import { api } from '~/trpc/server'

async function page() {
    const {message, status} = await api.test.hello()
  return (
    <div>{message} - {status}</div>

  )
}

export default page