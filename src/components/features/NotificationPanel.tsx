import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { formatDate } from '../../utils/helpers';

type NotificationPanelProps = {
  onClose: () => void;
};

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useData();
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/50 p-4 pt-16"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="h-[calc(100vh-8rem)] w-full max-w-md overflow-hidden rounded-xl bg-white shadow-lg dark:bg-neutral-800 md:h-[calc(100vh-12rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-700">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary-500" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearAllNotifications}
              className="rounded-lg p-1.5 text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
              aria-label="Clear all notifications"
              title="Clear all notifications"
            >
              <Trash className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
              aria-label="Close notifications"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="h-full overflow-y-auto p-4">
          {notifications.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-neutral-500 dark:text-neutral-400">
              <Bell className="mb-4 h-12 w-12 opacity-30" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative rounded-lg border p-3 transition-colors duration-200 ${
                    notification.read
                      ? 'border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50'
                      : 'border-primary-200 bg-primary-50 dark:border-primary-800/50 dark:bg-primary-900/20'
                  }`}
                >
                  <div className="flex justify-between gap-2">
                    <h3 className="font-medium">{notification.title}</h3>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="rounded p-1 text-neutral-600 hover:bg-neutral-200/50 dark:text-neutral-400 dark:hover:bg-neutral-700/50"
                          aria-label="Mark as read"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                    {notification.message}
                  </p>
                  <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                    {formatDate(notification.date)}
                  </p>
                  {!notification.read && (
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary-500 dark:bg-primary-400"></span>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotificationPanel;