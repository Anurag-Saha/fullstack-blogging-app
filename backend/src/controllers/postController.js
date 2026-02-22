const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: "Post creation failed" });
  }
};

exports.getAllPosts = async (req, res) => {
  const posts = await Post.find()
    .populate('author', 'username')
    .sort({ createdAt: -1 });

  res.json(posts);
};

exports.getSinglePost = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'username');

  if (!post) return res.status(404).json({ error: "Post not found" });

  res.json(post);
};

exports.updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post)
    return res.status(404).json({ error: "Post not found" });

  if (post.author.toString() !== req.user.id)
    return res.status(403).json({ error: "Unauthorized" });

  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;

  await post.save();

  res.json(post);
};

exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post)
    return res.status(404).json({ error: "Post not found" });

  if (post.author.toString() !== req.user.id)
    return res.status(403).json({ error: "Unauthorized" });

  await post.deleteOne();

  res.json({ message: "Post deleted" });
};

exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post)
      return res.status(404).json({ error: "Post not found" });

    const userId = req.user.id;

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(
        id => id.toString() !== userId
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({ likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: "Like failed" });
  }
};