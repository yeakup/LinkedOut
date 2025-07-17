import { useState, useEffect } from 'react';
import { postService, likeService } from '../services/dataService';
import { useAuth } from '../contexts/AuthContext';
import AddPost from './AddPost';
import UserAvatar from './UserAvatar';

function MainFeed({ onPostAdded, onLikeChanged, filterUserId, searchTerm }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const { user } = useAuth();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let allPosts;
      if (searchTerm) {
        allPosts = await postService.searchPosts(searchTerm);
      } else if (filterUserId) {
        allPosts = await postService.getPostsByUser(filterUserId);
      } else {
        allPosts = await postService.getAllPosts();
      }
      setPosts(allPosts);
      
      // Check which posts are liked by current user
      const likedPostIds = new Set();
      for (const post of allPosts) {
        const isLiked = await likeService.checkIfLiked(post.id, user.id);
        if (isLiked) {
          likedPostIds.add(post.id);
        }
      }
      setLikedPosts(likedPostIds);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filterUserId, searchTerm]);

  const handlePostAdded = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
    if (onPostAdded) {
      onPostAdded();
    }
  };

  const handleLike = async (postId) => {
    try {
      const result = await likeService.toggleLike(postId, user.id);
      
      // Update local state
      const newLikedPosts = new Set(likedPosts);
      if (result.isLiked) {
        newLikedPosts.add(postId);
      } else {
        newLikedPosts.delete(postId);
      }
      setLikedPosts(newLikedPosts);
      
      // Update posts with new like count
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, likes: result.likesCount }
            : post
        )
      );

      // Notify parent about like change
      if (onLikeChanged) {
        onLikeChanged();
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <AddPost onPostAdded={handlePostAdded} />
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AddPost onPostAdded={handlePostAdded} />

      {posts.map(post => {
        const isLiked = likedPosts.has(post.id);
        const likesCount = post.likes || 0;
        
        return (
          <div key={post.id} className="bg-white rounded-lg border border-gray-200">
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <UserAvatar name={post.user?.name} size="md" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{post.user.name}</h4>
                    <span className="text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{post.timeAgo}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {post.user.title}
                    {post.user.title && post.user.company && <span> @</span>}
                    {post.user.company && <span className="font-bold">{post.user.company}</span>}
                  </p>
                  <p className="mt-3 text-gray-900">{post.content}</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 px-4 py-2">
              <div className="flex items-center justify-start space-x-8">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-50 transition-colors ${
                    isLiked ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">
                    Like{likesCount > 0 && ` (${likesCount})`}
                  </span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 py-2 px-3 rounded hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-sm font-medium">Comment</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MainFeed;











