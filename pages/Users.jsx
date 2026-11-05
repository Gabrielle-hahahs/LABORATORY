import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Users() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadUser = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get('https://dummyjson.com/users/1')
      setUser(response.data)
    } catch {
      setError('Unable to retrieve user information. Please check your internet connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUser() }, [])

  return (
    <>
      <PageHeading />
      <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        {loading ? (
          <div className="flex min-h-52 flex-col items-center justify-center gap-3 text-slate-500">
            <span className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
            <p className="text-sm font-semibold">Loading user information...</p>
          </div>
        ) : error ? (
          <div className="py-10 text-center"><p role="alert" className="text-sm text-rose-600">{error}</p><button onClick={loadUser} className="mt-4 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white">Try again</button></div>
        ) : user && (
          <div className="mx-auto max-w-xl">
            <div className="flex flex-col items-center gap-4 border-b border-slate-100 pb-6 text-center sm:flex-row sm:text-left">
              <img src={user.image} alt={`${user.firstName} ${user.lastName}`} className="h-24 w-24 rounded-full bg-slate-100 object-cover" />
              <div><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Sample API Profile</p><h2 className="mt-2 text-2xl font-black">{user.firstName} {user.lastName}</h2><p className="text-sm text-slate-500">@{user.username}</p></div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Info label="Full name" value={`${user.firstName} ${user.lastName}`} />
              <Info label="Email address" value={user.email} />
              <Info label="Username" value={user.username} />
              <Info label="Age / Gender" value={`${user.age} / ${user.gender}`} />
            </div>
            <p className="mt-5 text-center text-xs text-slate-400">Retrieved using Axios · DummyJSON API · GET /users/1</p>
          </div>
        )}
      </section>
      <Link to="/home" className="mt-5 inline-flex text-sm font-bold text-emerald-700 hover:underline">← Back to dashboard</Link>
    </>
  )
}

function PageHeading() {
  return <div className="mb-7"><p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-emerald-600">API integration</p><h1 className="text-3xl font-black tracking-tight sm:text-4xl">User Information</h1><p className="mt-2 text-sm leading-6 text-slate-600">Sample user information retrieved from DummyJSON using Axios.</p></div>
}
function Info({ label, value }) {
  return <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-2 break-all text-sm font-semibold text-slate-700">{value}</p></div>
}
