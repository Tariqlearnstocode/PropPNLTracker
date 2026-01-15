import { PropsWithChildren } from 'react';

// Public layout - no auth required
// AuthModal is handled globally in the root layout via AuthModalWrapper
export default function PublicLayout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
