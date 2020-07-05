const express = require('express');
const router = express.Router();

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');

// GET api/posts/
// public
// fetch posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    if (!posts) res.status(404).json({ noposts: 'No posts found!' });

    res.json(posts);
  } catch (err) {
    res.status(404).json({ err: 'Something went wrong' });
  }
});

// GET api/posts/:id
// public
// fetch post by id
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) res.status(404).json({ noposts: 'No post found!' });

    return res.json(post);
  } catch (err) {
    return res.status(404).json({ err: 'Something went wrong' });
  }
});

// POST api/posts/
// private
// create post
router.post('/', auth, async (req, res) => {
  const newPost = new Post({
    user: req.user.id,
    ingridients: req.body.ingridients,
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
  });
  const post = await newPost.save();
  return res.json(post);
});

// POST api/posts/like/:id
// private
// toggle like
router.post('/like/:id', auth, async (req, res) => {
  try {
    await Profile.findOne({ user: req.user.id });
    const post = await Post.findById(req.params.id);

    // filter likes array and find req.user.id in it
    const filteredLikes = post.likes.filter(
      (like) => like.user.toString() === req.user.id
    );

    if (filteredLikes.length > 0) {
      const removeIndex = post.likes.indexOf(filteredLikes[0]);
      post.likes.splice(removeIndex, 1);
    } else {
      post.likes.unshift({ user: req.user.id });
    }

    const savedPost = await post.save();
    return res.json(savedPost);
  } catch (err) {
    return res.status(404).json({ err: 'Post not found' });
  }
});

// POST api/posts/comment/:id
// private
// leave a comment to post
router.post('/comment/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const newComment = {
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    };

    post.comments.unshift(newComment);
    const savedPost = await post.save();
    return res.json(savedPost);
  } catch (err) {
    return res.status(404).json({ err: 'Post not found' });
  }
});

// DELETE api/posts/comment/:id/:comment_id
// private
// delete a comment from post
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const tmp = post.comments.filter(
      (comment) => comment._id.toString() === req.params.comment_id
    );
    if (tmp.length === 0) {
      return res.status(404).json({ commenterr: 'Comment does not exist' });
    }

    const removeIndex = post.comments
      .map((item) => item._id.toString())
      .indexOf(req.params.comment_id);

    post.comments.splice(removeIndex, 1);
    const savedPost = await post.save();
    return res.json(savedPost);
  } catch (err) {
    return res.status(404).json({ err: 'Post not found' });
  }
});

// DELETE api/posts/:id
// private
// delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    await Profile.findOne({ user: req.user.id });
    const post = await Post.findById(req.params.id);

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ notauthorized: 'User not authorized' });
    }

    await post.remove();
    return res.json({ success: true });
  } catch (err) {
    return res.status(404).json({ err: 'Post not found' });
  }
});

module.exports = router;
