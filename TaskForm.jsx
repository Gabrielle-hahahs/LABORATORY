import { useEffect, useState } from 'react'

export default function TaskForm({ groups, onAdd, defaultGroup }) {
  const [title, setTitle] = useState('')
  const [groupId, setGroupId] = useState(defaultGroup || groups[0]?.id || '')

  useEffect(() => {
    if (defaultGroup) setGroupId(defaultGroup)
    else if (!groups.some((group) => group.id === groupId)) setGroupId(groups[0]?.id || '')
  }, [defaultGroup, groups, groupId])

  const submit = (event) => {
    event.preventDefault()
    if (!title.trim() || !groupId) return
    onAdd(title, groupId)
    setTitle('')
  }

  return (
    <form onSubmit={submit} className="mb-5 flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-white p-4 sm:flex-row">
      <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What do you need to do?" aria-label="Task name" maxLength={120} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
      <select value={groupId} onChange={(event) => setGroupId(event.target.value)} aria-label="Task group" className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-500" disabled={!groups.length}>
        {groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
      </select>
      <button type="submit" disabled={!title.trim() || !groupId} className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40">＋ Add task</button>
    </form>
  )
}
