import { useState, useEffect } from 'react';

function Ads() {
  const [loading, setLoading] = useState(true);
  
  const ads = [
    {
      id: 1,
      title: "Premium Video Platform",
      image: "/ads/video.png",
      url: "https://example.com/video-platform",
      alt: "Premium video platform"
    },
    {
      id: 2,
      title: "Fitness & Gym Training",
      image: "/ads/gym.png", 
      url: "https://example.com/gym-training",
      alt: "Join fitness and gym training"
    }
  ];

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleAdClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="h-5 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="rounded-lg overflow-hidden">
              <div className="w-full h-20 bg-gray-200 animate-pulse"></div>
              <div className="p-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Sponsored</h3>
      <div className="space-y-3">
        {ads.map(ad => (
          <div 
            key={ad.id}
            onClick={() => handleAdClick(ad.url)}
            className="cursor-pointer rounded-lg overflow-hidden hover:bg-gray-50 transition-colors"
          >
            <img 
              src={ad.image}
              alt={ad.alt}
              className="w-full h-15 object-contain bg-gray-100"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMzAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+QWQgQmFubmVyPC90ZXh0Pgo8L3N2Zz4K';
              }}
            />
            <div className="p-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{ad.title}</p>
                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Ads;



