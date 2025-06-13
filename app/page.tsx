'use client'
import { useEffect, useRef, useState } from 'react'

type CounterMap = {
  [key: string]: { count: number }
}

export default function HomePage() {
  const [counters, setCounters] = useState<CounterMap>({})
  const [lastUpdatedKey, setLastUpdatedKey] = useState('')
  const [soundEnabled, setSoundEnabled] = useState(false)
  const previousData = useRef<CounterMap>({})
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000/ws/counters')

    ws.onmessage = (msg) => {
      const parsed: CounterMap = JSON.parse(msg.data)
      delete parsed.admin

      for (const [key, val] of Object.entries(parsed)) {
        if (previousData.current[key]?.count !== val.count) {
          setLastUpdatedKey(key)
          if (soundEnabled) {
            audioRef.current?.play().catch(() => {})
          }
          break
        }
      }

      previousData.current = parsed
      setCounters(parsed)
    }

    return () => ws.close()
  }, [soundEnabled])

  useEffect(() => {
    if (!lastUpdatedKey) return
    const timeout = setTimeout(() => setLastUpdatedKey(''), 10000)
    return () => clearTimeout(timeout)
  }, [lastUpdatedKey])

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-indigo-100 to-blue-50 p-6">
      <h1 className="text-4xl font-bold mb-10 text-center text-indigo-700 drop-shadow-sm">
        Live Queue Counter
      </h1>

      <audio ref={audioRef} src="/ding.mp3" preload="auto" />

      <div className="grid gap-6 justify-center grid-cols-[repeat(auto-fit,minmax(250px,1fr))] max-w-screen-xl mx-auto px-2">
        {Object.entries(counters).map(([key, val]) => {
          const isUpdated = key === lastUpdatedKey
          return (
            <div
              key={key}
              className={`rounded-2xl shadow-xl p-6 border text-center transition-all duration-300 ${
                isUpdated
                  ? 'bg-yellow-50 border-yellow-400 scale-[1.02]'
                  : 'bg-white border-gray-200'
              }`}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-3 capitalize tracking-wide">
                {key}
              </h2>
              <p
                className={`text-6xl font-extrabold tracking-tight ${
                  isUpdated ? 'text-yellow-600' : 'text-indigo-600'
                }`}
              >
                {val.count}
              </p>
            </div>
          )
        })}
      </div>

      {/* Floating Sound Button */}
      {!soundEnabled && (
        <button
          onClick={() => {
            audioRef.current?.play().catch(() => {})
            setSoundEnabled(true)
          }}
          className="fixed bottom-6 right-6 size-9 opacity-30 hover:opacity-100 transition-opacity backdrop-blur-sm rounded-full shadow-md bg-white/80 p-2"
          title="Enable Sound"
        >
          <img src="/MaterialSymbolsVolumeUpOutlineRounded.svg" alt="Enable Sound" className="w-full h-full" />
        </button>
      )}
    </main>
  )
}
