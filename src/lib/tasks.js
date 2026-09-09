import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

export function tasksRef(uid) {
  return collection(db, 'users', uid, 'tasks')
}

/**
 * Subscribes to the user's tasks, newest first. Returns the unsubscribe fn.
 */
export function subscribeToTasks(uid, onChange) {
  const q = query(tasksRef(uid), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    onChange(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

/**
 * Adds a task. Priority lives only on the parent — subtasks carry title/done only
 * (per BACKLOG US-2.1). `subtasks` is an array of title strings from the form.
 */
export async function addTask(uid, { title, details, endDate, taskPriority, subtasks }) {
  const doc_ = {
    title: title.trim(),
    details: details?.trim() || '',
    endDate: endDate ? new Date(endDate) : null,
    taskPriority: Number(taskPriority),
    pinned: false,
    createdAt: serverTimestamp(),
    subtasks: (subtasks || [])
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => ({ id: crypto.randomUUID(), title: t, done: false })),
    completed: false,
  }
  return addDoc(tasksRef(uid), doc_)
}
