import { NextResponse } from 'next/server';

import type { NextFetchEvent, NextRequest } from 'next/server';

// this _middleware rewrites `/docs` to `/docs/index.html`
export function middleware(req: NextRequest, _ev: NextFetchEvent) {
  if (req.url === '/docs') {
    return NextResponse.rewrite('/docs/index.html');
  }
}
