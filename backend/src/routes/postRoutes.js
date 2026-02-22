const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost
} = require('../controllers/postController');

router.get('/', getAllPosts);
router.get('/:id', getSinglePost);

router.post('/', auth, createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);

module.exports = router;