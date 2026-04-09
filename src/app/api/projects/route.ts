import { NextResponse } from 'next/server'
import { getAllProjects } from '@/lib/mdx'

export const revalidate = 3600

export async function GET() {
  const projects = getAllProjects()
  const titles = projects.map((p) => p.title)
  return NextResponse.json({ titles })
}
