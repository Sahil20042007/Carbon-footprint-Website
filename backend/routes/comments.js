const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');

// @route   GET /api/comments
// @desc    Get all comments
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;
    
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    const comments = await Comment.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments'
    });
  }
});

// @route   POST /api/comments
// @desc    Create new comment
// @access  Private
router.post('/',
  protect,
  [
    body('content').trim().notEmpty().isLength({ max: 500 }).withMessage('Comment must be 1-500 characters'),
    body('category').isIn(['Tips', 'Success Story', 'Question', 'General']).withMessage('Invalid category')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { content, category } = req.body;

      const comment = await Comment.create({
        userId: req.user.id,
        userName: req.user.name,
        content,
        category
      });

      res.status(201).json({
        success: true,
        data: comment
      });
    } catch (error) {
      console.error('Create comment error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating comment'
      });
    }
  }
);

// @route   PUT /api/comments/:id/like
// @desc    Like/Unlike a comment
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const alreadyLiked = comment.likedBy.includes(req.user.id);

    if (alreadyLiked) {
      // Unlike
      comment.likes -= 1;
      comment.likedBy = comment.likedBy.filter(
        id => id.toString() !== req.user.id.toString()
      );
    } else {
      // Like
      comment.likes += 1;
      comment.likedBy.push(req.user.id);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking comment'
    });
  }
});

// @route   POST /api/comments/:id/reply
// @desc    Reply to a comment
// @access  Private
router.post('/:id/reply',
  protect,
  [
    body('content').trim().notEmpty().isLength({ max: 300 }).withMessage('Reply must be 1-300 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const comment = await Comment.findById(req.params.id);

      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Comment not found'
        });
      }

      comment.replies.push({
        userId: req.user.id,
        userName: req.user.name,
        content: req.body.content
      });

      await comment.save();

      res.status(200).json({
        success: true,
        data: comment
      });
    } catch (error) {
      console.error('Reply error:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding reply'
      });
    }
  }
);

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private (own comments only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check ownership
    if (comment.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Comment deleted'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting comment'
    });
  }
});

module.exports = router;