import React, { useState, useEffect } from 'react';
import { MessageCircle, ThumbsUp, Send, Trash2, MessageSquare, User, Clock } from 'lucide-react';
import axios from 'axios';

const CommunityForum = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const categories = ['All', 'Tips', 'Success Story', 'Question', 'General'];

  useEffect(() => {
    fetchComments();
  }, [selectedCategory]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== 'All' ? `?category=${selectedCategory}` : '';
      const response = await axios.get(`http://localhost:5000/api/comments${params}`);
      
      if (response.data.success) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/comments',
        {
          content: newComment,
          category: selectedCategory === 'All' ? 'General' : selectedCategory
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setComments([response.data.data, ...comments]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert(error.response?.data?.message || 'Failed to post comment');
    }
  };

  const handleLike = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/comments/${commentId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setComments(comments.map(c => 
          c._id === commentId ? response.data.data : c
        ));
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleReply = async (commentId) => {
    if (!replyContent.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/comments/${commentId}/reply`,
        { content: replyContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setComments(comments.map(c => 
          c._id === commentId ? response.data.data : c
        ));
        setReplyTo(null);
        setReplyContent('');
      }
    } catch (error) {
      console.error('Error replying:', error);
      alert(error.response?.data?.message || 'Failed to reply');
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:5000/api/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setComments(comments.filter(c => c._id !== commentId));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert(error.response?.data?.message || 'Failed to delete');
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Tips': return 'bg-blue-100 text-blue-700';
      case 'Success Story': return 'bg-green-100 text-green-700';
      case 'Question': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryEmoji = (category) => {
    switch (category) {
      case 'Tips': return '💡';
      case 'Success Story': return '🎉';
      case 'Question': return '❓';
      default: return '💬';
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <MessageCircle className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community Forum</h2>
          <p className="text-gray-600 text-sm">Share tips, ask questions, and connect with others</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {getCategoryEmoji(category)} {category}
          </button>
        ))}
      </div>

      {/* New Comment Form */}
      <form onSubmit={handlePostComment} className="mb-6">
        <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 focus-within:border-primary transition">
                        <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts, tips, or questions..."
                className="w-full bg-transparent outline-none resize-none text-gray-900 placeholder-gray-500"
                rows="3"
                maxLength="500"
                />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {newComment.length}/500 characters
            </span>
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>Post</span>
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary mx-auto"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No comments yet</h3>
          <p className="text-gray-600">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
              {/* Comment Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {comment.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{comment.userName}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{timeAgo(comment.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getCategoryColor(comment.category)}`}>
                    {getCategoryEmoji(comment.category)} {comment.category}
                  </span>
                  {localStorage.getItem('token') && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Comment Content */}
              <p className="text-gray-700 mb-3 leading-relaxed">{comment.content}</p>

              {/* Comment Actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(comment._id)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary transition"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">{comment.likes}</span>
                </button>

                <button
                  onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    Reply {comment.replies?.length > 0 && `(${comment.replies.length})`}
                  </span>
                </button>
              </div>

              {/* Reply Form */}
              {replyTo === comment._id && (
                <div className="mt-3 ml-10">
                  <div className="flex space-x-2">
                                        <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 placeholder-gray-400"
                    maxLength="300"
                    />
                    <button
                      onClick={() => handleReply(comment._id)}
                      disabled={!replyContent.trim()}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 ml-10 space-y-2">
                  {comment.replies.map((reply, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-semibold text-gray-900">{reply.userName}</span>
                        <span className="text-xs text-gray-500">{timeAgo(reply.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityForum;