interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params: _params }: BlogPostPageProps) {
  return null
}
