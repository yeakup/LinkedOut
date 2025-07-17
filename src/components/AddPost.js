import { useState } from 'react';
import { postService } from '../services/dataService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import UserAvatar from './UserAvatar';

function AddPost({ onPostAdded }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newPost = await postService.createPost({
        content: content.trim(),
        userId: user.id
      });
      
      onPostAdded?.(newPost);
      setContent('');
      setShowComposer(false);
      showToast('Post created successfully!', 'success');
    } catch (error) {
      console.error('Error creating post:', error);
      showToast('Failed to create post. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showComposer) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center space-x-3">
          <UserAvatar name={user?.name} size="md" />
          <button
            onClick={() => setShowComposer(true)}
            className="flex-1 text-left pl-4 p-3 border border-gray-300 rounded-full hover:bg-gray-50 text-gray-500 transition-colors"
          >
            Start a post...
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-3 mb-4">
          <UserAvatar name={user?.name} size="md" />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you want to talk about?"
              className="w-full p-3 border-none resize-none focus:outline-none text-lg"
              rows="3"
              autoFocus
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setShowComposer(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPost;


