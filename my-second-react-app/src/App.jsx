import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/todos')
      .then((res) => setTodos(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Todos</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={th}>ID</th>
              <th style={th}>User ID</th>
              <th style={th}>Title</th>
              <th style={th}>Completed</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id} style={{ background: todo.completed ? '#f0fff4' : '#fff' }}>
                <td style={td}>{todo.id}</td>
                <td style={td}>{todo.userId}</td>
                <td style={td}>{todo.title}</td>
                <td style={{ ...td, textAlign: 'center' }}>
                  {todo.completed ? '✅' : '❌'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const th = {
  border: '1px solid #ccc',
  padding: '8px 12px',
  textAlign: 'left',
}

const td = {
  border: '1px solid #ccc',
  padding: '8px 12px',
}

export default App
