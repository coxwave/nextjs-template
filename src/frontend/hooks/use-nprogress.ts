import 'nprogress/nprogress.css';

import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { useEffect } from 'react';

export function useNProgress(options: Partial<NProgress.NProgressOptions>) {
  const router = useRouter();

  NProgress.configure(options);

  useEffect(() => {
    router.events.on('routeChangeStart', NProgress.start);
    router.events.on('routeChangeComplete', NProgress.done);
    router.events.on('routeChangeError', NProgress.done);

    return () => {
      router.events.off('routeChangeStart', NProgress.start);
      router.events.off('routeChangeComplete', NProgress.done);
      router.events.off('routeChangeError', NProgress.done);
    };
  }, [router]);
}
