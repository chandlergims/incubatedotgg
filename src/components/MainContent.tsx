'use client';

import { useSidebar } from './SidebarContext';

export default function MainContent({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebar();
  
  return (
    <main 
      className={`overflow-y-auto bg-gray-50 h-full transition-[margin] duration-300 ${
        isExpanded ? 'md:ml-64' : 'md:ml-16'
      }`}
    >
      {children}
    </main>
  );
}
