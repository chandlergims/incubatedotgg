import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ baseMint: string }> }
) {
  try {
    const { baseMint } = await params;

    if (!baseMint) {
      return NextResponse.json(
        { error: 'Missing baseMint parameter' },
        { status: 400 }
      );
    }

    console.log('🔍 Fetching token data for baseMint:', baseMint);

    // Query Firestore for token with matching baseMint
    const tokensRef = collection(db, 'tokens');
    const q = query(tokensRef, where('baseMint', '==', baseMint));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      );
    }

    // Get the first (and should be only) matching document
    const tokenDoc = querySnapshot.docs[0];
    const tokenData = {
      id: tokenDoc.id,
      ...tokenDoc.data()
    };

    console.log('✅ Token data found');

    return NextResponse.json({
      success: true,
      token: tokenData,
    });

  } catch (error) {
    console.error('Error fetching token data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
