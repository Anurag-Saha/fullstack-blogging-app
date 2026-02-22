const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      content: req.body.content,
      post: req.body.postId,
      author: req.user.id,
      parentComment: req.body.parentComment || null
    });

    const populatedComment = await comment.populate('author', 'username');

    res.status(201).json(populatedComment);
  } catch (err) {
    console.error("Add Comment Error:", err);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

exports.getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId
    })
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.error("Fetch Comments Error:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};