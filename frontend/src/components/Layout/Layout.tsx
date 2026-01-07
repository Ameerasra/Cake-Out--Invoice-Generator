import React from 'react';
import Header from './Header';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  breadcrumbs?: Array<{ label: string; path: string }>;
}

const Layout: React.FC<LayoutProps> = ({ children, breadcrumbs }) => {
  return (
    <div className="layout">
      <Header breadcrumbs={breadcrumbs} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;






