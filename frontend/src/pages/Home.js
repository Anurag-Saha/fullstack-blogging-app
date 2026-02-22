import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/posts')
      .then(res => setPosts(res.data));
  }, []);

  return (
    <div>
      <h1>All Posts</h1>
      {posts.map(post => (
        <div key={post._id}>
          <Link to={`/post/${post._id}`}>
            <h3>{post.title}</h3>
          </Link>
          <p>By {post.author.username}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;