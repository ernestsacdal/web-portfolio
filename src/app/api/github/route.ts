export async function GET(): Promise<Response> {
  return new Response(JSON.stringify({ message: 'not implemented' }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' },
  })
}
