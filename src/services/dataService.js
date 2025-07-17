import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc,
  query, 
  orderBy, 
  limit,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Helper function for time formatting
const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'now';
  
  const now = new Date();
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return `${Math.floor(diffInSeconds / 86400)}d`;
};

// User services
export const userService = {
  getUserById: async (id) => {
    const userDoc = await getDoc(doc(db, 'users', id));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    throw new Error('User not found');
  },

  createUser: async (userData) => {
    const docRef = await addDoc(collection(db, 'users'), {
      ...userData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...userData };
  },

  getAllUsers: async () => {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
};

// Post services
export const postService = {
  getAllPosts: async () => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    for (const postDoc of querySnapshot.docs) {
      const postData = postDoc.data();
      
      // Get user data
      const userDoc = await getDoc(doc(db, 'users', postData.userId));
      const userData = userDoc.exists() ? userDoc.data() : null;
      
      posts.push({
        id: postDoc.id,
        ...postData,
        user: userData,
        timeAgo: formatTimeAgo(postData.createdAt)
      });
    }
    
    return posts;
  },
  
  createPost: async ({ content, userId }) => {
    const postData = {
      content,
      userId,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'posts'), postData);
    
    // Get user data for the response
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.exists() ? userDoc.data() : null;
    
    return {
      id: docRef.id,
      ...postData,
      user: userData,
      timeAgo: 'now'
    };
  },
  
  getRecentPosts: async (limitCount = 5) => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    for (const postDoc of querySnapshot.docs) {
      const postData = postDoc.data();
      
      // Get user data
      const userDoc = await getDoc(doc(db, 'users', postData.userId));
      const userData = userDoc.exists() ? userDoc.data() : null;
      
      posts.push({
        id: postDoc.id,
        ...postData,
        user: userData,
        timeAgo: formatTimeAgo(postData.createdAt)
      });
    }
    
    return posts;
  },
  
  getPostsByUser: async (userId) => {
    const q = query(
      collection(db, 'posts'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    // Get user data once
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.exists() ? userDoc.data() : null;
    
    querySnapshot.docs.forEach(postDoc => {
      const postData = postDoc.data();
      posts.push({
        id: postDoc.id,
        ...postData,
        user: userData,
        timeAgo: formatTimeAgo(postData.createdAt)
      });
    });
    
    return posts;
  },
  
  getMostLikedPosts: async (limitCount = 5) => {
    const q = query(
      collection(db, 'posts'),
      orderBy('likes', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    for (const postDoc of querySnapshot.docs) {
      const postData = postDoc.data();
      
      // Get user data
      const userDoc = await getDoc(doc(db, 'users', postData.userId));
      const userData = userDoc.exists() ? userDoc.data() : null;
      
      posts.push({
        id: postDoc.id,
        ...postData,
        user: userData,
        timeAgo: formatTimeAgo(postData.createdAt)
      });
    }
    
    return posts;
  },
  
  searchPosts: async (searchTerm) => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    for (const postDoc of querySnapshot.docs) {
      const postData = postDoc.data();
      
      // Filter posts that contain the search term
      if (postData.content.toLowerCase().includes(searchTerm.toLowerCase())) {
        // Get user data
        const userDoc = await getDoc(doc(db, 'users', postData.userId));
        const userData = userDoc.exists() ? userDoc.data() : null;
        
        posts.push({
          id: postDoc.id,
          ...postData,
          user: userData,
          timeAgo: formatTimeAgo(postData.createdAt)
        });
      }
    }
    
    return posts;
  }
};

// Like services
export const likeService = {
  toggleLike: async (postId, userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const postRef = doc(db, 'posts', postId);
      
      // Get current user and post data
      const [userDoc, postDoc] = await Promise.all([
        getDoc(userRef),
        getDoc(postRef)
      ]);
      
      if (!userDoc.exists() || !postDoc.exists()) {
        throw new Error('User or post not found');
      }
      
      const userData = userDoc.data();
      const postData = postDoc.data();
      
      const userLikedPosts = userData.likedPosts || [];
      const postLikedBy = postData.likedBy || [];
      
      const isLiked = userLikedPosts.includes(postId);
      
      if (isLiked) {
        // Unlike: remove from both arrays
        const updatedUserLikedPosts = userLikedPosts.filter(id => id !== postId);
        const updatedPostLikedBy = postLikedBy.filter(id => id !== userId);
        
        await Promise.all([
          updateDoc(userRef, { likedPosts: updatedUserLikedPosts }),
          updateDoc(postRef, { 
            likedBy: updatedPostLikedBy,
            likes: updatedPostLikedBy.length 
          })
        ]);
        
        return { isLiked: false, likesCount: updatedPostLikedBy.length };
      } else {
        // Like: add to both arrays
        const updatedUserLikedPosts = [...userLikedPosts, postId];
        const updatedPostLikedBy = [...postLikedBy, userId];
        
        await Promise.all([
          updateDoc(userRef, { likedPosts: updatedUserLikedPosts }),
          updateDoc(postRef, { 
            likedBy: updatedPostLikedBy,
            likes: updatedPostLikedBy.length 
          })
        ]);
        
        return { isLiked: true, likesCount: updatedPostLikedBy.length };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },
  
  checkIfLiked: async (postId, userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const likedPosts = userData.likedPosts || [];
        return likedPosts.includes(postId);
      }
      return false;
    } catch (error) {
      console.error('Error checking like status:', error);
      return false;
    }
  }
};






