import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Secret token for security
  const token = request.headers.get('x-revalidate-token');
  const expectedToken = process.env.REVALIDATE_TOKEN;
  
  if (token !== expectedToken) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  
  try {
    // Get paths to revalidate from request body, or use defaults
    const paths = body.paths || [
      '/sitemap.xml',
      '/sitemap-index.xml',
      '/robots.txt'
    ];
    
    // Revalidate each path
    for (const path of paths) {
      revalidatePath(path);
    }
    
    return NextResponse.json({ revalidated: true, paths });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error revalidating', message: (error as Error).message },
      { status: 500 }
    );
  }
}
