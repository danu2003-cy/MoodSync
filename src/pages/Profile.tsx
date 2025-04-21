import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';

const Profile: React.FC = () => {
  const { authState, updateProfile } = useAuth();
  const [name, setName] = useState(authState.user?.name || '');
  const [profilePic, setProfilePic] = useState(authState.user?.profilePic || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await updateProfile({ name, profilePic });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  return (
    <Layout title="Profile Settings">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          {error && (
            <div className="mb-4 rounded-lg bg-error-50 p-3 text-sm text-error-500">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 rounded-lg bg-success-50 p-3 text-sm text-success-700">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6 flex flex-col items-center">
              <div className="relative">
                <div className="h-32 w-32 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                  {profilePic ? (
                    <img 
                      src={profilePic} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-full w-full p-8 text-neutral-400" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 rounded-full bg-primary-500 p-2 text-white hover:bg-primary-600"
                >
                  <Camera className="h-5 w-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                Click the camera icon to update your profile picture
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="name" className="label">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="label">Email</label>
              <input
                type="email"
                value={authState.user?.email}
                className="input bg-neutral-50 dark:bg-neutral-800"
                disabled
              />
            </div>
            
            <button type="submit" className="btn-primary w-full">
              <Save className="mr-2 h-5 w-5" />
              Save Changes
            </button>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Profile;