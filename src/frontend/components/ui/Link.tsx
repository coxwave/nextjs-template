import NextLink from 'next/link';

import { PropsOf } from '@src/types';

export default function Link({ href, children, ...props }: PropsOf<'a'>) {
  if (href === undefined) {
    throw new Error(`You have to provide an \`href\` prop to the \`Link\` component.`);
  }

  return (
    <NextLink href={href}>
      <a {...props}>{children}</a>
    </NextLink>
  );
}
