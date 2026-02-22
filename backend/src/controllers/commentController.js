const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  const comment = await Comment.create({
    content: req.body.content,
    post: req.body.postId,
    author: req.user.id,
    parentComment: req.body.parentComment || null
  });

  res.status(201).json(comment);
};

exports.getCommentsByPost = async (req, res) => {
  const comments = await Comment.find({
    post: req.params.postId
  })
    .populate('author', 'username')
    .sort({ createdAt: -1 });

  res.json(comments);
};