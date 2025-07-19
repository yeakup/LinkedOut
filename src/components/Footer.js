import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap justify-center items-center space-x-6 text-sm text-gray-600">
          <span>Copyright © {currentYear}. All rights reserved | Created with ❤︎ by Jakub Bugyi</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;



