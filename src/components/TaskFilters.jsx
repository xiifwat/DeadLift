/** Tag filter chips (US-4.1). Search lives in the app header now — this is
 * just the "View" row: All + every tag in use. Combines with search via AND. */
export default function TaskFilters({ allTags, selectedTags, onToggleTag, onClearTags }) {
  if (allTags.length === 0) return null

  return (
    <div className="tag-filter-chips">
      <span className="filter-label">View</span>
      <button
        type="button"
        className={`tag-chip filter${selectedTags.length === 0 ? ' active' : ''}`}
        onClick={onClearTags}
      >
        All
      </button>
      {allTags.map((tag) => (
        <button
          key={tag}
          type="button"
          className={`tag-chip filter${selectedTags.includes(tag) ? ' active' : ''}`}
          onClick={() => onToggleTag(tag)}
          aria-pressed={selectedTags.includes(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
