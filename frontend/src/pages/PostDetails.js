import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, []);

  const fetchPost = async () => {
    const res = await api.get(`/posts/${id}`);
    setPost(res.data);
  };

  const fetchComments = async () => {
    const res = await api.get(`/comments/${id}`);
    setComments(res.data);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    await api.post('/comments', {
      content: newComment,
      postId: id
    });

    setNewComment('');
    fetchComments();
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{post.title}</h2>
      <p>By {post.author?.username}</p>
      <p>{post.content}</p>

      <hr />

      <h3>Comments</h3>

      {user && (
        <form onSubmit={handleCommentSubmit}>
          <input
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit">Post</button>
        </form>
      )}

      {comments.map(comment => (
        <div key={comment._id} style={{ marginTop: '10px' }}>
          <strong>{comment.author?.username}</strong>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default PostDetails;