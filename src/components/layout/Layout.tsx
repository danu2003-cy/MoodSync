import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  // Update document title
  React.useEffect(() => {
    if (title) {
      document.title = `${title} | MoodSync`;
    } else {
      document.title = 'MoodSync - Track Your Mood & Events';
    }
  }, [title]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {title && (
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 py-8 text-white dark:from-primary-700 dark:to-secondary-700">
            <div className="container mx-auto px-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold"
              >
                {title}
              </motion.h1>
            </div>
          </div>
        )}
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
      <footer className="border-t border-neutral-200 py-4 dark:border-neutral-800">
        <div className="container mx-auto px-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
          <p>© {new Date().getFullYear()} MoodSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;