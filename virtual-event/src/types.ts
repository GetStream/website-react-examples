import { PropsWithChildren } from 'react';

export type PropsWithChildrenOnly = PropsWithChildren<Record<never, never>>;
