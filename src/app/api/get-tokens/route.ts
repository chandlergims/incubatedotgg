import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs, where, startAfter, DocumentSnapshot } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'newest'; // newest, oldest, name
    const limitCount = parseInt(searchParams.get('limit') || '20');
    const creatorFilter = searchParams.get('creator') || '';

    console.log('🔍 Fetching tokens with params:', { searchQuery, sortBy, limitCount, creatorFilter });

    // Always fetch all tokens first, then filter client-side for better search
    let tokensQuery = query(collection(db, 'tokens'));

    // Add sorting
    switch (sortBy) {
      case 'oldest':
        tokensQuery = query(tokensQuery, orderBy('createdAt', 'asc'));
        break;
      case 'name':
        tokensQuery = query(tokensQuery, orderBy('name', 'asc'));
        break;
      case 'newest':
      default:
        tokensQuery = query(tokensQuery, orderBy('createdAt', 'desc'));
        break;
    }

    const querySnapshot = await getDocs(tokensQuery);
    let tokens = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Apply creator filter if provided
    if (creatorFilter.trim()) {
      tokens = tokens.filter((token: any) => 
        token.creator === creatorFilter
      );
    }

    // Apply client-side search filter if provided
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      tokens = tokens.filter((token: any) => 
        token.name?.toLowerCase().includes(searchLower) ||
        token.symbol?.toLowerCase().includes(searchLower) ||
        token.baseMint?.toLowerCase().includes(searchLower)
      );
    }

    // Apply limit after filtering
    tokens = tokens.slice(0, limitCount);

    console.log(`✅ Found ${tokens.length} tokens`);

    return NextResponse.json({
      success: true,
      tokens,
      hasMore: false, // Simplified for now
      message: `Found ${tokens.length} tokens`,
    });

  } catch (error) {
    console.error('Error fetching tokens:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tokens', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
