
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
  requiresAuth?: boolean;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, children, requiresAuth = false }) => {
  const { user } = useAuth();

  const handleClick = (e: React.MouseEvent) => {
    if (requiresAuth && !user) {
      e.preventDefault();
      toast.info("You need to be logged in to access this page", {
        description: "Please log in to continue",
        action: {
          label: "Log in",
          onClick: () => window.location.href = "/login"
        }
      });
    }
  };

  // If auth is required but user isn't logged in, route to login
  const destination = requiresAuth && !user ? "/login" : to;

  return (
    <Link 
      to={destination} 
      className="text-gray-400 hover:text-white transition-colors duration-200" 
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

export default FooterLink;
