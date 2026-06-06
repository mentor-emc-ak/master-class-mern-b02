
import { useState, useRef, useMemo, useCallback } from 'react'

export default function Counter() {
  // const [count, setCount] = useState(0)
  const [simplyChange, setSimplyChange] = useState(0)

  const count = useRef(0)

  const setCount = useCallback((newCount) => {
    count.current = newCount
    console.log('Count updated:', count.current)
    if (count.current % 5 === 0) {
      setSimplyChange(simplyChange + 1) // Trigger re-render every 5 increments
    }
  }, [simplyChange])

  // usage of useMemo and useCallback would be more relevant in a more complex component with expensive calculations or functions that depend on props/state. In this simple counter example, they are not necessary.

  const expensiveCalculation = useMemo(() => {
    console.log('Running expensive calculation...')
    console.log('simplyChange value:', simplyChange)
    const start = Date.now()
    let result = 0
    for (let i = 0; i < 100000000; i++) {
      result += 1000000 * i
    }
    const end = Date.now()
    console.log('Expensive calculation took', end - start, 'ms')
    return result
  }, [simplyChange])

  return (
    <div>
      {expensiveCalculation}
      <h1 className="text-2xl font-bold text-blue-500">Counter: {count.current}</h1>
      <button className="px-4 py-2 bg-green-500 text-white rounded-lg" onClick={() => setCount(count.current + 1)}>Increment</button>
      <button className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={() => setCount(count.current - 1)}>Decrement</button>
    </div>
  )
}
