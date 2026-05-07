import SessionNavbar from './SessionNavbar'

export default function SessionLayout({ children, params }) {
  const { id: sessionId } = params

  return (
    <div className="min-h-screen flex flex-col">
      <SessionNavbar sessionId={sessionId} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
