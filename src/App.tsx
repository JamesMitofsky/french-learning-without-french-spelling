import { useEffect, useState } from 'react'
import { PlayerView } from './components/PlayerView'
import { StudioView } from './components/StudioView'

type Route = 'player' | 'studio'

function currentRoute(): Route {
  return window.location.hash === '#/studio' ? 'studio' : 'player'
}

export default function App() {
  const [route, setRoute] = useState<Route>(currentRoute)

  useEffect(() => {
    const onHash = () => setRoute(currentRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col px-4 pt-6 pb-24">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">
          {route === 'studio' ? 'Studio' : 'Sounds'}
        </h1>
        {route === 'studio' && (
          <a
            href="#/"
            className="text-sm text-neutral-400 underline underline-offset-4"
          >
            Back to sounds
          </a>
        )}
      </header>

      <main className="flex-1">
        {route === 'studio' ? <StudioView /> : <PlayerView />}
      </main>
    </div>
  )
}
