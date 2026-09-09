/** Search box + tag chips (US-4.1/4.2). Both filters combine with AND. */
export default function TaskFilters({ allTags, searchQuery, onSearchChange, selectedTags, onToggleTag }) {
  if (allTags.length === 0 && !searchQuery) return (
    <input
      type="search"
      className="search-input"
      placeholder="Search tasks…"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  )

  return (
    <div className="task-filters">
      <input
        type="search"
        className="search-input"
        placeholder="Search tasks…"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {allTags.length > 0 && (
        <div className="tag-filter-chips">
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
      )}
    </div>
  )
}
