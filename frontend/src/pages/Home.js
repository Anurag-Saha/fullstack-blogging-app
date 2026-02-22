import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    api.get('/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="home-container">
      <nav className="navbar">
        <h2 className="logo">BlogSphere</h2>
        <div>
          {user ? (
            <>
              <Link to="/create" className="btn primary">Create</Link>
              <button onClick={logout} className="btn danger">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn primary">Login</Link>
          )}
        </div>
      </nav>

      <div className="hero">
        <h1>Share Your Thoughts With The World</h1>
        <p>Create, explore, and connect through powerful blogging.</p>
      </div>

      <div className="posts-grid">
        {posts.map(post => (
          <div key={post._id} className="post-card">
            <Link to={`/post/${post._id}`} className="post-link">
              <h3>{post.title}</h3>
            </Link>
            <p className="author">By {post.author?.username}</p>
            <p className="content-preview">
              {post.content.substring(0, 100)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
