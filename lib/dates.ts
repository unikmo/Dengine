export function calculateSuggestedStart(eventDate: string, planningWeeks: number): string {
  const d = new Date(eventDate)
  d.setDate(d.getDate() - planningWeeks * 7)
  return d.toISOString().split('T')[0]
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

export function weeksBeforeToDate(eventDate: string, weeksBefore: number): string {
  const d = new Date(eventDate)
  d.setDate(d.getDate() - weeksBefore * 7)
  return d.toISOString().split('T')[0]
}
