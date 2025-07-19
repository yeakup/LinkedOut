import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { postService } from '../services/dataService';
import UserAvatar from './UserAvatar';

function ProfileCard({ refreshTrigger, onMyItemsClick }) {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    postsCount: 0,
    totalLikes: 0
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?.id) return;
      
      try {
        const userPosts = await postService.getPostsByUser(user.id);
        const postsCount = userPosts.length;
        const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
        
        setUserStats({ postsCount, totalLikes });
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchUserStats();
  }, [user?.id, refreshTrigger]);

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Cover Photo */}
      <div className="h-16 bg-gradient-to-r from-blue-400 to-blue-600"></div>
      
      {/* Profile Content */}
      <div className="px-4 pb-4">
        {/* Avatar */}
        <div className="flex justify-center -mt-8 mb-4">
          <Link to="/profile">
            <UserAvatar name={user.name} size="lg" className="border-4 border-white" />
          </Link>
        </div>
        
        {/* User Info */}
        <div className="text-center">
          <Link to="/profile" className="font-semibold text-gray-900 text-base hover:underline cursor-pointer">
            {user.name}
          </Link>
          {user.title && (
            <p className="text-sm text-gray-600 mt-1 leading-tight">{user.title}</p>
          )}
          {user.company && (
            <p className="text-sm text-gray-500 mt-0.5 font-semibold">{user.company}</p>
          )}
          {user.location && (
            <p className="text-sm text-gray-500 mt-0.5 flex items-center justify-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {user.location}
            </p>
          )}
        </div>
        
        {/* Stats */}
        <div className="border-t mt-4 pt-4 px-8">
          <div className="flex justify-between text-sm">
            <div className="text-center">
              <span className="block text-gray-500 text-xs">Posts sent</span>
              <p className="font-semibold text-blue-600 text-sm">{userStats.postsCount}</p>
            </div>
            <div className="text-center">
              <span className="block text-gray-500 text-xs">Likes</span>
              <p className="font-semibold text-blue-600 text-sm">{userStats.totalLikes}</p>
            </div>
          </div>
        </div>
        
        {/* My Items */}
        <div className="border-t mt-4 pt-4">
          <div 
            onClick={onMyItemsClick}
            className="flex items-center space-x-2 text-sm text-gray-700 hover:bg-gray-50 -mx-4 px-4 py-2 cursor-pointer"
          >
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
            </svg>
            <span className="font-medium">My items</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;



















