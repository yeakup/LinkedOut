import { useState } from 'react';
import ProfileCard from '../components/ProfileCard';
import MainFeed from '../components/MainFeed';
import LastPosts from '../components/LastPosts';

function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Profile Card */}
        <div className="lg:col-span-1">
          <ProfileCard />
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-2">
          <MainFeed onPostAdded={handlePostAdded} />
        </div>

        {/* Right Sidebar - Last Posts */}
        <div className="lg:col-span-1">
          <LastPosts refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}

export default Home;


