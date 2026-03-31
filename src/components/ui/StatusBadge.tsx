import type { Project } from '@/types'

interface StatusBadgeProps {
  status: Project['status']
}

export default function StatusBadge({ status: _status }: StatusBadgeProps) {
  return null
}
