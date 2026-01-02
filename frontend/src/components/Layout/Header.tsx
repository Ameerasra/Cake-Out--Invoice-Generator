import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/Logo.jpg';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface HeaderProps {
  breadcrumbs?: BreadcrumbItem[];
}

const Header: React.FC<HeaderProps> = ({ breadcrumbs = [] }) => {
  const location = useLocation();

  // Default breadcrumbs based on current path
  const getDefaultBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const crumbs: BreadcrumbItem[] = [{ label: 'Dashboard', path: '/' }];

    if (path === '/invoices') {
      crumbs.push({ label: 'Invoices', path: '/invoices' });
    } else if (path === '/invoices/create') {
      crumbs.push({ label: 'Invoices', path: '/invoices' });
      crumbs.push({ label: 'Create Invoice', path: '/invoices/create' });
    } else if (path.startsWith('/invoices/') && path !== '/invoices/create') {
      crumbs.push({ label: 'Invoices', path: '/invoices' });
      crumbs.push({ label: 'Invoice Details', path: path });
    }

    return crumbs;
  };

  const displayBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : getDefaultBreadcrumbs();

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <div className="logo-container">
            <img src={logo} alt="Cake Out Logo" className="logo" />
            <div className="brand-name">
              <h1>Cake Out</h1>
              <span className="brand-tagline">Invoice Generator</span>
            </div>
          </div>
        </div>
        <nav className="breadcrumbs">
          {displayBreadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && <span className="breadcrumb-separator">→</span>}
              {index === displayBreadcrumbs.length - 1 ? (
                <span className="breadcrumb-current">{crumb.label}</span>
              ) : (
                <Link to={crumb.path} className="breadcrumb-link">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;

