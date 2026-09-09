import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SubtaskRow({ subtask, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: subtask.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <li ref={setNodeRef} style={style} className={subtask.done ? 'done' : ''}>
      <span className="drag-handle" {...attributes} {...listeners} aria-label="Drag to reorder">
        ⠿
      </span>
      <label>
        <input type="checkbox" checked={subtask.done} onChange={() => onToggle(subtask.id)} />
        {subtask.title}
      </label>
    </li>
  )
}

/** Drag-reorderable subtask checklist (BACKLOG US-2.1 AC: reorder persists). */
export default function SubtaskList({ subtasks, onToggle, onReorder }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = subtasks.findIndex((s) => s.id === active.id)
    const newIndex = subtasks.findIndex((s) => s.id === over.id)
    onReorder(arrayMove(subtasks, oldIndex, newIndex))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={subtasks.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <ul className="subtask-checklist">
          {subtasks.map((s) => (
            <SubtaskRow key={s.id} subtask={s} onToggle={onToggle} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
