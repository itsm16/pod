
import React from 'react'
import { api } from '~/trpc/server'

export default async function TestPage() {
    const data = await api.test.test.query()
  return (
    <div>{JSON.stringify(data)}</div>
  )
}
