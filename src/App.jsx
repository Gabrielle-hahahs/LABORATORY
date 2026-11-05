import { useState } from 'react'
import { Link, NavLink, Route, Routes, useParams, Navigate } from 'react-router-dom'
import { useTaskStore } from './store/useTaskStore'
import TaskItem from './components/TaskItem'
import TaskForm from './components/TaskForm'
import Users from './pages/Users'

const navClass = ({ isActive }) => `rounded-xl px-3 py-2 transition ${isActive ? 'bg-emerald-100 text-emerald-900' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'}`

function App() {
  return <div className="min-h-screen bg-[#f5fbf7] text-[#173b32]">
    <header className="sticky top-0 z-10 border-b border-emerald-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/home" className="flex items-center gap-2 font-black tracking-tight text-emerald-800"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-100 text-xl">✓</span><span className="text-xl">GroupPorToDoList<span className="text-emerald-500">.</span><small className="block text-xs font-medium tracking-normal text-slate-500">your day, a little greener</small></span></Link>
        <nav className="flex flex-wrap items-center justify-end gap-1 text-sm font-semibold sm:gap-2">
          <NavLink to="/home" className={navClass}>Home</NavLink><NavLink to="/tasks" className={navClass}>Tasks</NavLink><NavLink to="/groups" className={navClass}>Groups</NavLink><NavLink to="/guide" className={navClass}>Guide</NavLink><NavLink to="/users" className={navClass}>Users</NavLink><NavLink to="/developers" className={navClass}>Developers</NavLink>
        </nav>
      </div>
    </header>
    <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/:groupId" element={<GroupTasks />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/users" element={<Users />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer className="mt-12 border-t border-emerald-100 pt-5 text-center text-xs text-slate-500">Laboratory 4 · DCIT 26 · Application Development and Emerging Technologies</footer>
    </main>
  </div>
}

function PageHeading({ eyebrow, title, description, children }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-emerald-600">{eyebrow}</p><h1 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>}</div>{children}</div>
}
function StatCard({ label, value, icon, hint }) {
  return <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-500">{label}</span><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-xl">{icon}</span></div><p className="mt-3 text-3xl font-black">{value}</p><p className="mt-1 text-xs text-slate-500">{hint}</p></div>
}
function CompletionCount({ tasks, groupId }) {
  const items = tasks.filter((task) => !groupId || task.groupId === groupId)
  const completed = items.filter((task) => task.done).length
  return <span className="text-sm font-bold text-emerald-700">{completed} out of {items.length} completed</span>
}

function Home() {
  const groups = useTaskStore((state) => state.groups)
  const tasks = useTaskStore((state) => state.tasks)
  const completed = tasks.filter((task) => task.done).length
  const pending = tasks.length - completed
  return <>
    <PageHeading eyebrow="Your personal planner" title="A fresh start, every day." description="Keep your tasks organized, track your progress, and take things one step at a time."><Link to="/tasks" className="rounded-xl bg-emerald-700 px-5 py-3 text-center text-sm font-bold text-white shadow-sm hover:bg-emerald-800">＋ Add a task</Link></PageHeading>
    <div className="grid gap-4 sm:grid-cols-3"><StatCard label="All tasks" value={tasks.length} icon="📝" hint="Everything on your list"/><StatCard label="Completed" value={completed} icon="✅" hint="Small wins count"/><StatCard label="Still to do" value={pending} icon="🌱" hint="One task at a time"/></div>
    <section className="mt-8 rounded-3xl bg-emerald-800 p-6 text-white sm:p-8"><p className="text-sm font-semibold text-emerald-200">A LITTLE REMINDER</p><h2 className="mt-2 text-2xl font-black">Progress over perfection.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50">Choose one thing to finish next. Mark it complete when you’re done, or move it back to pending if plans change.</p><Link to="/groups" className="mt-5 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-emerald-900 hover:bg-emerald-50">Explore task groups →</Link></section>
    <section className="mt-8"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-extrabold">Your task groups</h2><Link to="/groups" className="text-sm font-bold text-emerald-700 hover:underline">View all →</Link></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{groups.map((group) => <Link key={group.id} to={`/groups/${group.id}`} className="rounded-2xl border border-emerald-100 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"><span className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${group.color}`}>{group.emoji}</span><h3 className="mt-4 font-bold">{group.name}</h3><p className="mt-2"><CompletionCount tasks={tasks} groupId={group.id}/></p></Link>)}</div></section>
  </>
}

function TaskList({ tasks, groups, toggleTask, deleteTask }) {
  if (!tasks.length) return <div className="rounded-2xl border border-dashed border-emerald-200 bg-white p-8 text-center"><span className="text-3xl">🌿</span><p className="mt-2 font-bold">Nothing here yet</p><p className="mt-1 text-sm text-slate-500">Add a task above to get started.</p></div>
  return <div className="space-y-3">{tasks.map((task) => <TaskItem key={task.id} task={task} group={groups.find((item) => item.id === task.groupId)} onToggle={() => toggleTask(task.id)} onDelete={() => deleteTask(task.id)} />)}</div>
}
function TaskPage() {
  const groups = useTaskStore((state) => state.groups)
  const tasks = useTaskStore((state) => state.tasks)
  const addTask = useTaskStore((state) => state.addTask)
  const toggleTask = useTaskStore((state) => state.toggleTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const [filter, setFilter] = useState('all')
  const visible = tasks.filter((task) => filter === 'all' || (filter === 'done' ? task.done : !task.done))
  return <><PageHeading eyebrow="Task manager" title="Make room for what matters." description="Add tasks, update their status, or remove tasks you no longer need."/><TaskForm groups={groups} onAdd={addTask}/><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-extrabold">Your tasks <span className="text-sm font-medium text-slate-500">({visible.length})</span></h2><div className="flex gap-2">{[['all','All'],['pending','Not Done'],['done','Done']].map(([value,label]) => <button key={value} onClick={() => setFilter(value)} className={`rounded-xl px-3 py-2 text-xs font-bold ${filter === value ? 'bg-emerald-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-emerald-50'}`}>{label}</button>)}</div></div><TaskList tasks={visible} groups={groups} toggleTask={toggleTask} deleteTask={deleteTask}/></>
}
function Groups() {
  const groups = useTaskStore((state) => state.groups)
  const tasks = useTaskStore((state) => state.tasks)
  const addGroup = useTaskStore((state) => state.addGroup)
  const deleteGroup = useTaskStore((state) => state.deleteGroup)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const submit = (event) => {
    event.preventDefault()
    if (!name.trim()) { setError('Please enter a group name.'); return }
    if (groups.some((group) => group.name.toLowerCase() === name.trim().toLowerCase())) { setError('That group already exists. Choose another name.'); return }
    addGroup(name)
    setName('')
    setError('')
  }
  return <><PageHeading eyebrow="Stay organized" title="Task groups" description="Create categories and keep related tasks together."/><form onSubmit={submit} className="mb-6 rounded-2xl border border-emerald-100 bg-white p-4"><label htmlFor="groupName" className="mb-2 block text-sm font-bold">Create a new group</label><div className="flex flex-col gap-3 sm:flex-row"><input id="groupName" value={name} onChange={(event) => { setName(event.target.value); setError('') }} placeholder="e.g. Capstone Tasks" maxLength={45} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"/><button className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800">＋ Create group</button></div>{error && <p role="alert" className="mt-2 text-sm text-rose-600">{error}</p>}</form><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{groups.map((group) => { const groupTasks = tasks.filter((task) => task.groupId === group.id); const completed = groupTasks.filter((task) => task.done).length; return <div key={group.id} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><span className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${group.color}`}>{group.emoji}</span><button onClick={() => { if (window.confirm(`Delete "${group.name}" and all its tasks?`)) deleteGroup(group.id) }} className="rounded-lg px-2 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50">Delete</button></div><h2 className="mt-4 text-lg font-extrabold">{group.name}</h2><p className="mt-2 text-sm font-bold text-emerald-700">{completed} out of {groupTasks.length} completed</p><p className="mt-1 text-xs text-slate-500">{groupTasks.length - completed} pending</p><Link to={`/groups/${group.id}`} className="mt-5 inline-flex rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-800 hover:bg-emerald-100">Open task list →</Link></div> })}</div></>
}
function GroupTasks() {
  const { groupId } = useParams()
  const groups = useTaskStore((state) => state.groups)
  const tasks = useTaskStore((state) => state.tasks)
  const addTask = useTaskStore((state) => state.addTask)
  const toggleTask = useTaskStore((state) => state.toggleTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const group = groups.find((item) => item.id === groupId)
  if (!group) return <NotFound message="We couldn't find that task group."/>
  const groupTasks = tasks.filter((task) => task.groupId === groupId)
  const completed = groupTasks.filter((task) => task.done).length
  return <><div className="mb-5"><Link to="/groups" className="text-sm font-bold text-emerald-700 hover:underline">← All groups</Link></div><PageHeading eyebrow="Selected task group" title={`${group.emoji} ${group.name}`} description="Only tasks assigned to this group are shown here."/><div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><p className="text-lg font-black text-emerald-900">{completed} out of {groupTasks.length} tasks completed</p><p className="mt-1 text-sm text-emerald-800">{groupTasks.length - completed} task(s) still pending</p></div><TaskForm groups={groups} onAdd={addTask} defaultGroup={groupId}/><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-extrabold">Tasks in this group</h2><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">{groupTasks.length} total</span></div><TaskList tasks={groupTasks} groups={groups} toggleTask={toggleTask} deleteTask={deleteTask}/></>
}
function Guide() {
  const steps = [
    ['Create a task group', 'Open Task Groups from the navigation. Type a category name, then select Create group. Duplicate group names are not accepted.'],
    ['Add a task to a selected group', 'Open a group using Open task list. Enter a task name, choose the correct group if needed, and press Add task.'],
    ['Mark a task Done or Not Done', 'Press the square check button beside a task. A checked task is marked Done. Press it again to return it to Not Done.'],
    ['Delete a task', 'Press Delete on the task you want to remove. The task disappears and the dashboard and group counts update.'],
    ['Navigate between pages and groups', 'Use the navigation links at the top to move between Home, Tasks, Groups, Guide, Users, and Developers. Use the back link to return to all groups.'],
    ['Retrieve user information using Axios', 'Open User Information. The page sends an HTTP GET request to https://dummyjson.com/users/1 using Axios. A loading indicator appears while waiting and an error message appears if the request fails.'],
    ['How Zustand shares task data', 'Zustand stores groups and tasks in one shared global store. When a task is added, completed, or deleted, all pages using the store show the updated information. Persist middleware saves the data in browser local storage.'],
  ]
  return <><PageHeading eyebrow="Help center" title="Instructions / User Guide" description="Learn how to use GroupPorToDoList and demonstrate the required features."/><div className="space-y-4">{steps.map(([title,body],index) => <section key={title} className="flex gap-4 rounded-2xl border border-emerald-100 bg-white p-5"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 font-black text-emerald-800">{index+1}</span><div><h2 className="font-extrabold">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{body}</p></div></section>)}</div></>
}
function Developers() {
  const defaultNames = ['NEPUNAN, PAULA GABRIELLE', 'MAGAYANES, ASHLEE NICOLE', 'CANE, SEAN ANDREI', 'LISING, CARLOS']
  const [names, setNames] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mintlist-developer-names')) || defaultNames } catch { return defaultNames }
  })
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(names.join('\n'))
  const save = (event) => {
    event.preventDefault()
    const clean = draft.split('\n').map((name) => name.trim()).filter(Boolean).slice(0,4)
    setNames(clean)
    localStorage.setItem('mintlist-developer-names', JSON.stringify(clean))
    setEditing(false)
  }
  return <><PageHeading eyebrow="The people behind GroupPorToDoList" title="Developers"><button onClick={() => { setDraft(names.join('\n')); setEditing(!editing) }} className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50">{editing ? 'Cancel edit' : 'Edit member names'}</button></PageHeading>{editing && <form onSubmit={save} className="mb-6 rounded-2xl border border-emerald-100 bg-white p-4"><label htmlFor="members" className="mb-2 block text-sm font-bold">Enter one complete name per line (up to 4)</label><textarea id="members" value={draft} onChange={(event) => setDraft(event.target.value)} rows={4} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500"/><button className="mt-3 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white">Save names</button></form>}<div className="grid gap-4 sm:grid-cols-2">{names.map((name,index) => <div key={`${name}-${index}`} className="rounded-2xl border border-emerald-100 bg-white p-6"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-2xl">👩‍💻</span><h2 className="mt-4 font-extrabold">{name}</h2><p className="mt-1 text-sm text-emerald-700">Project Developer · Member {index+1}</p></div>)}</div></>
}
function NotFound({ message = 'That page does not exist.' }) {
  return <div className="rounded-3xl border border-emerald-100 bg-white p-10 text-center"><p className="text-4xl">🌱</p><h1 className="mt-3 text-2xl font-black">Page not found</h1><p className="mt-2 text-sm text-slate-600">{message}</p><Link to="/home" className="mt-5 inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white">Back to Home</Link></div>
}

export default App
