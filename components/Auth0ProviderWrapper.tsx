'use client';

import { Auth0Provider } from '@auth0/auth0-react';
import { ReactNode, useEffect, useState } from 'react';

export default function Auth0ProviderWrapper({ children }: { children: ReactNode }) {
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (!origin) {
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      domain="dev-tuzylr3v1mlqpsvf.us.auth0.com"
      clientId="aEIVFEvnzPIyFGQHpzwc1w8Z3JQ2VlI5"
      authorizationParams={{
        redirect_uri: origin,
      }}
    >
      {children}
    </Auth0Provider>
  );
}
