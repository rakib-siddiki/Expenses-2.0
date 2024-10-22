'use client';

import { QueryClient, QueryClientProvider as QueryProvider } from '@tanstack/react-query';
import React, { ReactNode, useState } from 'react';

const QueryClientProvider = ({ children }: { children: ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient());
    return <QueryProvider client={queryClient}>{children}</QueryProvider>;
};

export default QueryClientProvider;
