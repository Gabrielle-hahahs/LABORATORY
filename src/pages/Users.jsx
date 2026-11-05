import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const PROFILE_STORAGE_KEY = 'mintlist-user-profile'

export default function Users() {
  const [user, setUser] = useState(null)
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadUser = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get('https://dummyjson.com/users/1')
      const apiUser = response.data
      let savedProfile = null
      try {
        savedProfile = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || 'null')
      } catch {
        localStorage.removeItem(PROFILE_STORAGE_KEY)
      }
      const profile = savedProfile ? { ...apiUser, ...savedProfile } : apiUser
      setUser(profile)
      setForm(toForm(profile))
    } catch {
      setError('Unable to retrieve user information. Please check your internet connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUser() }, [])

  const startEditing = () => {
    setForm(toForm(user))
    setNotice('')
    setEditing(true)
  }

  const cancelEditing = () => {
    setForm(toForm(user))
    setEditing(false)
    setNotice('')
  }

  const updateField = (field, value) => {
    setForm(current => ({ ...current, [field]: value }))
  }

  const handleImageChange = event => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setNotice('Please choose an image file.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setNotice('Please choose an image smaller than 2 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => updateField('image', reader.result)
    reader.readAsDataURL(file)
  }

  const saveChanges = event => {
    event.preventDefault()
    const firstName = form.firstName.trim()
    const lastName = form.lastName.trim()
    const username = form.username.trim()
    const email = form.email.trim()
    const age = Number(form.age)

    if (!firstName || !lastName || !username || !email || !form.age || !Number.isFinite(age) || age < 1 || age > 120) {
      setNotice('Please complete all fields and enter a valid age (1–120).')
      return
    }

    const updatedProfile = {
      ...user,
      firstName,
      lastName,
      username,
      email,
      age,
      gender: form.gender,
      image: form.image || user.image,
    }

    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile))
      setUser(updatedProfile)
      setForm(toForm(updatedProfile))
      setEditing(false)
      setNotice('Profile updated successfully!')
    } catch {
      setNotice('Unable to save your profile. The selected image may be too large.')
    }
  }

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
          <div className="py-10 text-center">
            <p role="alert" className="text-sm text-rose-600">{error}</p>
            <button onClick={loadUser} className="mt-4 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white">Try again</button>
          </div>
        ) : user && form && (
          <div className="mx-auto max-w-xl">
            <div className="flex flex-col items-center gap-4 border-b border-slate-100 pb-6 text-center sm:flex-row sm:text-left">
              <div className="relative">
                <img
                  src={editing ? (form.image || user.image) : user.image}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-24 w-24 rounded-full border-4 border-emerald-50 bg-slate-100 object-cover"
                />
                {editing && (
                  <label className="absolute -bottom-1 -right-1 grid h-9 w-9 cursor-pointer place-items-center rounded-full border-2 border-white bg-emerald-700 text-white shadow" title="Change profile picture">
                    ✎
                    <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                  </label>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">User Profile</p>
                <h2 className="mt-2 text-2xl font-black">{user.firstName} {user.lastName}</h2>
                <p className="text-sm text-slate-500">@{user.username}</p>
                {editing && <p className="mt-2 text-xs text-slate-400">Upload a profile photo (maximum 2 MB).</p>}
              </div>
              {!editing && (
                <button onClick={startEditing} className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800">Edit Profile</button>
              )}
            </div>

            {editing ? (
              <form onSubmit={saveChanges} className="mt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="First name"><input value={form.firstName} onChange={e => updateField('firstName', e.target.value)} className={inputClass} required /></Field>
                  <Field label="Last name"><input value={form.lastName} onChange={e => updateField('lastName', e.target.value)} className={inputClass} required /></Field>
                  <Field label="Username"><input value={form.username} onChange={e => updateField('username', e.target.value)} className={inputClass} required /></Field>
                  <Field label="Email address"><input type="email" value={form.email} onChange={e => updateField('email', e.target.value)} className={inputClass} required /></Field>
                  <Field label="Age"><input type="number" min="1" max="120" value={form.age} onChange={e => updateField('age', e.target.value)} className={inputClass} required /></Field>
                  <Field label="Gender">
                    <select value={form.gender} onChange={e => updateField('gender', e.target.value)} className={inputClass}>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </Field>
                </div>
                {notice && <p role="status" className="mt-4 text-sm text-amber-700">{notice}</p>}
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button type="button" onClick={cancelEditing} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800">Save Changes</button>
                </div>
              </form>
            ) : (
              <>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Info label="Full name" value={`${user.firstName} ${user.lastName}`} />
                  <Info label="Email address" value={user.email} />
                  <Info label="Username" value={user.username} />
                  <Info label="Age" value={user.age} />
                  <Info label="Gender" value={capitalize(user.gender)} />
                </div>
                {notice && <p role="status" className="mt-4 text-center text-sm font-medium text-emerald-700">{notice}</p>}
              </>
            )}
            <p className="mt-5 text-center text-xs text-slate-400">Initial user information retrieved using Axios · DummyJSON API · GET /users/1</p>
          </div>
        )}
      </section>
      <Link to="/home" className="mt-5 inline-flex text-sm font-bold text-emerald-700 hover:underline">← Back to dashboard</Link>
    </>
  )
}

const inputClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'

function toForm(user) {
  return {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    username: user.username || '',
    email: user.email || '',
    age: String(user.age ?? ''),
    gender: (user.gender || 'other').toLowerCase(),
    image: user.image || '',
  }
}

function capitalize(value = '') {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Not specified'
}

function Field({ label, children }) {
  return <label className="block text-sm font-semibold text-slate-600">{label}{children}</label>
}

function PageHeading() {
  return <div className="mb-7"><p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-emerald-600">API integration</p><h1 className="text-3xl font-black tracking-tight sm:text-4xl">User Information</h1><p className="mt-2 text-sm leading-6 text-slate-600">View and customize your profile information.</p></div>
}

function Info({ label, value }) {
  return <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-2 break-all text-sm font-semibold text-slate-700">{value}</p></div>
}
