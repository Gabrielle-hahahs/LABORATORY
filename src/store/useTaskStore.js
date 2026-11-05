import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const starterGroups = [
  { id: 'school', name: 'School Activities', emoji: '📚', color: 'bg-violet-100' },
  { id: 'personal', name: 'Personal Tasks', emoji: '🌿', color: 'bg-emerald-100' },
  { id: 'projects', name: 'Projects', emoji: '💻', color: 'bg-amber-100' },
  { id: 'daily', name: 'Daily Tasks', emoji: '☀️', color: 'bg-sky-100' },
]

const starterTasks = [
  { id: 'task-1', title: 'Review Laboratory 4 instructions', groupId: 'school', done: false, createdAt: Date.now() },
  { id: 'task-2', title: 'Organize project files', groupId: 'projects', done: true, createdAt: Date.now() - 1000 },
  { id: 'task-3', title: 'Prepare tomorrow’s to-do list', groupId: 'daily', done: false, createdAt: Date.now() - 2000 },
]

export const useTaskStore = create(
  persist(
    (set) => ({
      groups: starterGroups,
      tasks: starterTasks,
      addTask: (title, groupId) => set((state) => ({
        tasks: [...state.tasks, {
          id: `task-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          title: title.trim(), groupId, done: false, createdAt: Date.now(),
        }],
      })),
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task),
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      })),
      addGroup: (name) => set((state) => {
        const cleanName = name.trim()
        if (!cleanName || state.groups.some((group) => group.name.toLowerCase() === cleanName.toLowerCase())) return state
        return { groups: [...state.groups, { id: `group-${Date.now()}`, name: cleanName, emoji: '🗂️', color: 'bg-emerald-100' }] }
      }),
      deleteGroup: (id) => set((state) => ({
        groups: state.groups.filter((group) => group.id !== id),
        tasks: state.tasks.filter((task) => task.groupId !== id),
      })),
    }),
    { name: 'mintlist-task-data' },
  ),
)
