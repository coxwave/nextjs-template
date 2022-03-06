import clsx from 'clsx';

import type { Props, __ } from '@types';

import { forwardRefWithAs } from '@utils/forward-ref-with-as';

import type { ElementType, Ref } from 'react';

const DEFAULT_BUTTON_TAG = 'button' as const;

const colorClasses = {
  blue: 'bg-blue-400 hover:bg-blue-500 border-transparent',
  red: 'bg-red-400 hover:bg-red-500 focus-visible:ring-red-500 border-transparent',
  white: 'bg-white hover:bg-gray-50 border-gray-300',
};

interface OurButtonProps {
  color?: keyof typeof colorClasses;
  full?: boolean;
  size?: 'sm' | 'base' | 'lg';
}

type ButtonPropsWeControl = __;

const ButtonWithRef = forwardRefWithAs(function Button<
  TTag extends ElementType = typeof DEFAULT_BUTTON_TAG,
>(props: Props<TTag, ButtonPropsWeControl> & OurButtonProps, ref: Ref<HTMLButtonElement>) {
  const {
    color = 'blue',
    full = false,
    size = 'base',
    className,
    as: Component = DEFAULT_BUTTON_TAG,
    children,
    ...rest
  } = props;

  const propsWeControl = { ref };
  const passthroughProps = rest;

  return (
    <Component
      className={clsx(
        className,
        'inline-flex items-center rounded-md border px-4 py-2 font-semibold shadow-sm',
        {
          'text-sm': size === 'sm',
          'text-base': size === 'base',
          'text-lg': size === 'lg',
          'w-full justify-center px-1.5 py-2': full,
        },
        colorClasses[color],
        {
          'text-white disabled:cursor-default disabled:bg-gray-400 disabled:text-gray-50 disabled:opacity-70':
            color !== 'white',
        },
      )}
      {...passthroughProps}
      {...propsWeControl}
    >
      {children}
    </Component>
  );
});

export default ButtonWithRef;
