import { useState, useEffect } from 'react';
import { postService } from '../services/dataService';

function LastPosts({ refreshTrigger, onPostClick }) {
  const [mostLikedPosts, setMostLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMostLikedPosts = async () => {
    try {
      const posts = await postService.getMostLikedPosts(5);
      setMostLikedPosts(posts);
    } catch (error) {
      console.error('Error fetching most liked posts:', error);
      setMostLikedPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMostLikedPosts();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="h-5 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-50 rounded w-3/4 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Most Liked</h3>
      <div className="space-y-1">
        {mostLikedPosts.map(post => (
          <div 
            key={post.id}
            onClick={() => onPostClick && onPostClick(post.id)}
            className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <h4 className="text-sm font-medium text-gray-900">
              {post.content.length > 50 ? `${post.content.substring(0, 50)}...` : post.content}
            </h4>
            <p className="text-xs text-gray-600">
              {post.likes} likes • {post.timeAgo} ago • {post.user.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LastPosts;





