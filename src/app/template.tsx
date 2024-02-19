'use client';

import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';

export default function RootTemplate(props: PropsWithChildren) {
  return (
    <>
      <Provider store={store}>{props.children}</Provider>
    </>
  );
}
