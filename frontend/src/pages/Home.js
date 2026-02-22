import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    api.get('/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>All Posts</h1>

      {user ? (
        <div style={{ marginBottom: '20px' }}>
          <Link to="/create">
            <button>Create Post</button>
          </Link>

          <button onClick={logout} style={{ marginLeft: '10px' }}>
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login">
          <button>Login</button>
        </Link>
      )}

      {posts.map(post => (
        <div key={post._id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
          <Link to={`/post/${post._id}`} style={{ textDecoration: 'none', color: 'black' }}>
            <h3>{post.title}</h3>
          </Link>

          <p><strong>By:</strong> {post.author?.username}</p>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;