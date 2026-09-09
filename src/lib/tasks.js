import {
  collection,
  addDoc,
  updateDoc,
  deleteField,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

export function tasksRef(uid) {
  return collection(db, 'users', uid, 'tasks')
}

function taskDoc(uid, taskId) {
  return doc(db, 'users', uid, 'tasks', taskId)
}

/**
 * Subscribes to the user's tasks, newest first. Returns the unsubscribe fn.
 * Soft-deleted tasks are still delivered (deletedAt set) — callers filter for
 * display so an undo window can restore them.
 */
export function subscribeToTasks(uid, onChange) {
  const q = query(tasksRef(uid), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    onChange(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

function buildSubtasks(subtasks) {
  return (subtasks || [])
    .map((s) => ({ ...s, title: s.title.trim() }))
    .filter((s) => s.title)
    .map((s) => ({ id: s.id || crypto.randomUUID(), title: s.title, done: !!s.done }))
}

function deriveCompleted(subtasks, manualCompleted) {
  return subtasks.length > 0 ? subtasks.every((s) => s.done) : !!manualCompleted
}

/** Priority lives only on the parent — subtasks carry title/done only (US-2.1). */
export async function addTask(uid, { title, details, endDate, taskPriority, subtasks }) {
  const finalSubtasks = buildSubtasks(subtasks)
  return addDoc(tasksRef(uid), {
    title: title.trim(),
    details: details?.trim() || '',
    endDate: endDate ? new Date(endDate) : null,
    taskPriority: Number(taskPriority),
    pinned: false,
    createdAt: serverTimestamp(),
    subtasks: finalSubtasks,
    completed: deriveCompleted(finalSubtasks, false),
  })
}

/** Full edit: parent fields + subtask set (add/remove/rename), used by US-2.3. */
export async function editTask(uid, taskId, { title, details, endDate, taskPriority, subtasks }) {
  const finalSubtasks = buildSubtasks(subtasks)
  return updateDoc(taskDoc(uid, taskId), {
    title: title.trim(),
    details: details?.trim() || '',
    endDate: endDate ? new Date(endDate) : null,
    taskPriority: Number(taskPriority),
    subtasks: finalSubtasks,
    completed: deriveCompleted(finalSubtasks, false),
  })
}

/** Toggle one subtask's done state; parent `completed` is re-derived (US-2.5). */
export async function toggleSubtask(uid, task, subtaskId) {
  const subtasks = task.subtasks.map((s) =>
    s.id === subtaskId ? { ...s, done: !s.done } : s,
  )
  return updateDoc(taskDoc(uid, task.id), {
    subtasks,
    completed: deriveCompleted(subtasks, task.completed),
  })
}

/** Persist new subtask order after drag-reorder — array order is the order (ADR-0001). */
export async function reorderSubtasks(uid, taskId, subtasks) {
  return updateDoc(taskDoc(uid, taskId), { subtasks })
}

/**
 * Manually toggle completion — only valid for tasks with zero subtasks (US-2.5 AC).
 * Callers must not offer this control when task.subtasks.length > 0.
 */
export async function toggleTaskCompleted(uid, task) {
  if (task.subtasks?.length > 0) return
  return updateDoc(taskDoc(uid, task.id), { completed: !task.completed })
}

/** Manual override (US-3.3): pinned tasks sort above gross-priority ranking. */
export async function togglePin(uid, task) {
  return updateDoc(taskDoc(uid, task.id), { pinned: !task.pinned })
}

export async function softDeleteTask(uid, taskId) {
  return updateDoc(taskDoc(uid, taskId), { deletedAt: serverTimestamp() })
}

export async function restoreTask(uid, taskId) {
  return updateDoc(taskDoc(uid, taskId), { deletedAt: deleteField() })
}
