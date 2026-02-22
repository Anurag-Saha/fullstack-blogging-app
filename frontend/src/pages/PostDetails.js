import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './PostDetails.css';

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: '', content: '' });

  useEffect(() => {
  const fetchData = async () => {
    try {
      const postRes = await api.get(`/posts/${id}`);
      setPost(postRes.data);
      setLikes(postRes.data.likes.length);
      setEditData({
        title: postRes.data.title,
        content: postRes.data.content
      });

      const commentRes = await api.get(`/comments/${id}`);
      setComments(commentRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  fetchData();
}, [id]);

  const fetchPost = async () => {
    const res = await api.get(`/posts/${id}`);
    setPost(res.data);
    setLikes(res.data.likes.length);
    setEditData({
      title: res.data.title,
      content: res.data.content
    });
  };

  const fetchComments = async () => {
    const res = await api.get(`/comments/${id}`);
    setComments(res.data);
  };

  const handleLike = async () => {
    const res = await api.post(`/posts/${id}/like`);
    setLikes(res.data.likes);
  };

  const handleDelete = async () => {
    await api.delete(`/posts/${id}`);
    navigate('/');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await api.put(`/posts/${id}`, editData);
    setIsEditing(false);
    fetchPost();
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

  if (!post) return <div className="loading">Loading...</div>;

  const isAuthor = user && post.author?._id === user._id;

  return (
    <div className="post-page">
      <div className="post-card">
        {isEditing ? (
          <form onSubmit={handleUpdate}>
            <input
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
            />
            <textarea
              value={editData.content}
              onChange={(e) =>
                setEditData({ ...editData, content: e.target.value })
              }
            />
            <button className="btn primary">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="btn">
              Cancel
            </button>
          </form>
        ) : (
          <>
            <h1>{post.title}</h1>
            <p className="author">By {post.author?.username}</p>
            <p className="content">{post.content}</p>

            <div className="actions">
              {user && (
                <button onClick={handleLike} className="like-btn">
                  ❤️ {likes}
                </button>
              )}

              {isAuthor && (
                <>
                  <button onClick={() => setIsEditing(true)} className="btn">
                    Edit
                  </button>
                  <button onClick={handleDelete} className="btn danger">
                    Delete
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <div className="comment-section">
        <h3>Comments</h3>

        {user && (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <input
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="btn primary">Post</button>
          </form>
        )}

        {comments.map(comment => (
          <div key={comment._id} className="comment-card">
            <strong>{comment.author?.username}</strong>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostDetails;
