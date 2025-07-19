import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { postService, userService } from '../services/dataService';
import Navbar from '../components/Navbar';
import LastPosts from '../components/LastPosts';
import UserAvatar from '../components/UserAvatar';
import ProfilePosts from '../components/ProfilePosts';

function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [userStats, setUserStats] = useState({
    postsCount: 0,
    totalLikes: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostClick = (postId) => {
    // Navigate to home page with selected post
    navigate(`/?post=${postId}`);
  };

  const handleLikeChanged = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const targetUserId = userId || currentUser?.id;
        
        if (targetUserId === currentUser?.id) {
          setProfileUser(currentUser);
        } else {
          // Try userService.getUserById first
          const user = await userService.getUserById(targetUserId);
          if (user) {
            setProfileUser(user);
          } else {
            // Fallback: get user from posts
            const allPosts = await postService.getAllPosts(100);
            const userPost = allPosts.find(post => post.user?.id === targetUserId);
            
            if (userPost) {
              setProfileUser(userPost.user);
            } else {
              setProfileUser(null);
              setLoading(false);
              return;
            }
          }
        }

        // Fetch user stats
        const userPosts = await postService.getPostsByUser(targetUserId);
        const postsCount = userPosts.length;
        const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
        
        setUserStats({ postsCount, totalLikes });
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfileUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchProfile();
    }
  }, [userId, currentUser, refreshTrigger]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-t-lg"></div>
            <div className="bg-white p-6 rounded-b-lg">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!profileUser) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">User not found</h1>
          </div>
        </div>
      </>
    );
  }

  const isOwnProfile = profileUser.id === currentUser?.id;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Profile Section - Takes 3 columns */}
          <div className="lg:col-span-3">
            {/* Profile Header */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
              {/* Cover Photo */}
              <div className="h-32 bg-gradient-to-r from-blue-400 to-blue-600"></div>
              
              {/* Profile Content */}
              <div className="px-6 pb-6">
                {/* Avatar */}
                <div className="flex justify-start -mt-12 mb-4">
                  <UserAvatar 
                    name={profileUser.name} 
                    size="xl" 
                    className="border-4 border-white" 
                  />
                </div>
                
                {/* User Info */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {profileUser.name}
                  </h1>
                  {profileUser.title && (
                    <p className="text-lg text-gray-700 mb-1">{profileUser.title}</p>
                  )}
                  {profileUser.company && (
                    <p className="text-md text-gray-600 font-semibold mb-2">{profileUser.company}</p>
                  )}
                  {profileUser.location && (
                    <p className="text-sm text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {profileUser.location}
                    </p>
                  )}
                </div>
                
                {/* Stats */}
                <div className="border-t pt-4">
                  <div className="flex space-x-8">
                    <div>
                      <span className="block text-gray-500 text-sm">Posts</span>
                      <p className="font-bold text-blue-600 text-lg">{userStats.postsCount}</p>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-sm">Total Likes</span>
                      <p className="font-bold text-blue-600 text-lg">{userStats.totalLikes}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Posts */}
            <ProfilePosts userId={profileUser.id} onLikeChanged={handleLikeChanged} />
          </div>

          {/* Right Sidebar - Last Posts */}
          <div className="lg:col-span-1">
            <LastPosts onPostClick={handlePostClick} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;









