import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Dashboard() {
  const { mongoUser, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    const { data } = await api.get('/api/posts');
    setPosts(data);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await api.put(`/api/posts/${editId}`, form);
        setEditId(null);
      } else {
        await api.post('/api/posts', form);
      }
      setForm({ title: '', content: '' });
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/api/posts/${id}`);
    fetchPosts();
  };

  const startEdit = (post) => {
    setEditId(post._id);
    setForm({ title: post.title, content: post.content });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">My MERN App</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">Hello, {mongoUser?.name}</span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">{editId ? 'Edit Post' : 'New Post'}</h2>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Title"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Content"
              rows={3}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
              >
                {editId ? 'Update' : 'Post'}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => { setEditId(null); setForm({ title: '', content: '' }); }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {posts.length === 0 && (
            <p className="text-center text-gray-400">No posts yet. Create one above!</p>
          )}
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">by {post.author?.name}</p>
                </div>
                {post.author?._id === mongoUser?.id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(post)}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-3 text-gray-600">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
