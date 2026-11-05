export default function TaskItem({ task, group, onToggle, onDelete }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
      <button
        onClick={onToggle}
        aria-label={task.done ? 'Mark as not done' : 'Mark as done'}
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 text-xs font-black transition ${task.done ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 hover:border-emerald-500'}`}
      >{task.done ? '✓' : ''}</button>
      <div className="min-w-0 flex-1">
        <p className={`break-words font-semibold ${task.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</p>
        {group && <p className="mt-1 text-xs text-slate-500">{group.emoji} {group.name}</p>}
      </div>
      <span className={`hidden rounded-full px-3 py-1 text-xs font-bold sm:inline-block ${task.done ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{task.done ? 'Done' : 'Not Done'}</span>
      <button onClick={onDelete} className="rounded-lg px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50" aria-label={`Delete ${task.title}`}>Delete</button>
    </div>
  )
}
