export function formatTimeAgo(timestamp: any): string {
  if (!timestamp) return 'Unknown';
  
  try {
    const now = new Date();
    let created: Date;
    
    // Handle Firestore timestamp
    if (timestamp && typeof timestamp.toDate === 'function') {
      created = timestamp.toDate();
    } 
    // Handle Firestore serverTimestamp (which might be null initially)
    else if (timestamp && timestamp.seconds) {
      created = new Date(timestamp.seconds * 1000);
    }
    // Handle regular date string/number
    else {
      created = new Date(timestamp);
    }
    
    // Check if date is valid
    if (isNaN(created.getTime())) {
      return 'Just now';
    }
    
    const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Unknown';
  }
}
