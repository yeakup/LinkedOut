function Ads() {
  const ads = [
    {
      id: 1,
      title: "Premium Video Platform",
      image: "/ads/video.png",
      url: "https://vid-plat.onrender.com/",
      alt: "Premium video platform"
    },
    {
      id: 2,
      title: "Fitness & Gym Training",
      image: "/ads/gym.png", 
      url: "https://vid-plat.onrender.com/",
      alt: "Join fitness and gym training"
    }
  ];

  const handleAdClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
              className="w-full h-20 object-cover bg-gray-100"
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


