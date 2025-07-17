import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProfileCard from '../components/ProfileCard';
import MainFeed from '../components/MainFeed';
import LastPosts from '../components/LastPosts';
import Navbar from '../components/Navbar';

function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filterUserId, setFilterUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  const handlePostAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLikeChanged = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleMyItemsClick = () => {
    setFilterUserId(filterUserId ? null : user.id);
    setSearchTerm(''); // Clear search when filtering by user
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setFilterUserId(null); // Clear user filter when searching
  };

  const clearAllFilters = () => {
    setFilterUserId(null);
    setSearchTerm('');
  };

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <ProfileCard 
              refreshTrigger={refreshTrigger} 
              onMyItemsClick={handleMyItemsClick}
            />
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2">
            {(filterUserId || searchTerm) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  {filterUserId && (
                    <span className="text-blue-800 font-medium">Showing your posts</span>
                  )}
                  {searchTerm && (
                    <span className="text-blue-800 font-medium">
                      Showing posts containing "<span className="font-bold">{searchTerm}</span>"
                    </span>
                  )}
                  <button 
                    onClick={clearAllFilters}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Show all posts
                  </button>
                </div>
              </div>
            )}
            <MainFeed 
              onPostAdded={handlePostAdded} 
              onLikeChanged={handleLikeChanged}
              filterUserId={filterUserId}
              searchTerm={searchTerm}
            />
          </div>

          {/* Right Sidebar - Last Posts */}
          <div className="lg:col-span-1">
            <LastPosts refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

