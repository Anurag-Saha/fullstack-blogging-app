import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './CreatePost.css';

const CreatePost = () => {
  const [form, setForm] = useState({ title: '', content: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/posts', form);
    navigate('/');
  };

  return (
    <div className="create-page">
      <div className="create-card">
        <h1>Create New Post</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="Enter post title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />
          </div>

          <div className="input-group">
            <label>Content</label>
            <textarea
              placeholder="Write your thoughts..."
              value={form.content}
              onChange={(e) =>
                setForm({ ...form, content: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" className="create-btn">
            Publish Post 🚀
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;