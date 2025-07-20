import { useState, useEffect } from 'react';
import { commentService } from '../services/dataService';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import UserAvatar from './UserAvatar';

function CommentSection({ postId, commentCount, showCommentForm, onToggleCommentForm, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [likedComments, setLikedComments] = useState(new Set());
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      const fetchedComments = await commentService.getCommentsByPost(postId);
      setComments(fetchedComments);
      
      // Check which comments are liked by current user
      const likedCommentIds = new Set();
      for (const comment of fetchedComments) {
        const isLiked = await commentService.checkIfCommentLiked(comment.id, user.id);
        if (isLiked) {
          likedCommentIds.add(comment.id);
        }
      }
      setLikedComments(likedCommentIds);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || loading) return;

    setLoading(true);
    try {
      const comment = await commentService.addComment(postId, user.id, newComment.trim());
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      onToggleCommentForm(); // Close form after posting
      onCommentAdded(); // Update parent component
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const result = await commentService.toggleCommentLike(commentId, user.id);
      
      // Update local state
      const newLikedComments = new Set(likedComments);
      if (result.isLiked) {
        newLikedComments.add(commentId);
      } else {
        newLikedComments.delete(commentId);
      }
      setLikedComments(newLikedComments);
      
      // Update comments with new like count
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, likes: result.likesCount }
            : comment
        )
      );
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 1);

  return (
    <div>
      {/* Comment Form */}
      {showCommentForm && (
        <form onSubmit={handleAddComment} className="mt-3 flex items-start space-x-3">
          <Link to={`/profile/${user?.id}`}>
            <UserAvatar name={user?.name} size="sm" />
          </Link>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-blue-300"
              rows="2"
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                type="button"
                onClick={onToggleCommentForm}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newComment.trim() || loading}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="mt-3 space-y-3">
          {displayedComments.map(comment => {
            const isLiked = likedComments.has(comment.id);
            return (
              <div key={comment.id} className="flex items-start space-x-3">
                <Link to={`/profile/${comment.user?.id}`}>
                  <UserAvatar name={comment.user?.name} size="sm" />
                </Link>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Link 
                        to={`/profile/${comment.user?.id}`}
                        className="font-semibold text-sm hover:underline"
                      >
                        {comment.user?.name}
                      </Link>
                      <span className="text-xs text-gray-500">{comment.timeAgo}</span>
                    </div>
                    <p className="text-sm text-gray-900">{comment.content}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <button
                      onClick={() => handleCommentLike(comment.id)}
                      className={`text-xs ${isLiked ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-blue-600'}`}
                    >
                      Like{comment.likes > 0 && ` (${comment.likes})`}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {comments.length > 1 && !showAllComments && (
            <button
              onClick={() => setShowAllComments(true)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View all {comments.length} comments
            </button>
          )}
          
          {showAllComments && comments.length > 1 && (
            <button
              onClick={() => setShowAllComments(false)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Show less
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default CommentSection;




















