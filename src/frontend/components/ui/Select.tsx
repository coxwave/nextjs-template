import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import { Fragment, useCallback } from 'react';

type SelectItem<TType> = {
  key: string;
  label: string;
  value: TType;
};

type SelectProps<TType> = {
  className?: string;
  label?: string;
  items: SelectItem<TType>[];
  selectedValue: TType;
  onSelect: (item: SelectItem<TType>) => void;
  optional?: boolean;
};

export default function Select<TType>({
  className,
  label,
  items,
  selectedValue,
  onSelect,
  optional = false,
}: SelectProps<TType>) {
  const getItemByValue = useCallback(
    (value: unknown) => {
      const idx = items.findIndex((val) => val.value === value);
      return idx !== -1 ? items[idx] : items[0];
    },
    [items],
  );

  // validations
  if (!items.length) {
    throw new Error(`Check items array (length). Received: ${items}`);
  }

  return (
    <div className={className}>
      <Listbox value={getItemByValue(selectedValue)} onChange={onSelect}>
        {({ open }) => (
          <>
            <Listbox.Label className="block text-base font-semibold text-gray-700">
              <span>{label}</span>
              <span className={clsx('text-gray-400', { hidden: !optional })}>&nbsp;(선택)</span>
            </Listbox.Label>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400">
                <span className="block truncate text-base">
                  {getItemByValue(selectedValue).label}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  static
                  className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  {items.map((item) => (
                    <Listbox.Option
                      key={item.key}
                      className={({ active }) =>
                        clsx(
                          active ? 'bg-blue-400 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        )
                      }
                      value={item}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={clsx(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate',
                            )}
                          >
                            {item.label}
                          </span>

                          {selected ? (
                            <span
                              className={clsx(
                                active ? 'text-white' : 'text-blue-400',
                                'absolute inset-y-0 right-0 flex items-center pr-4',
                              )}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
}
