import { useEffect, useState } from 'react';
import { getLearnerProfileApi } from '../api/dashboardApi';
import { User, Mail, Calendar, Hash, Award } from 'lucide-react';

export default function LearnerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getLearnerProfileApi();
        setProfile(response.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-blue-700">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-red-600 font-semibold text-lg">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600 font-semibold text-lg">No profile data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-lg rounded-2xl p-8">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-5xl font-bold">
            {profile.name ? profile.name[0].toUpperCase() : '?'}
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">{profile.name}</h1>
            <p className="text-slate-600 text-lg">{profile.role || 'Learner'}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4 text-slate-700 text-lg">
            <Mail className="w-6 h-6 text-blue-500" />
            <span>{profile.email}</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-700 text-lg">
            <Hash className="w-6 h-6 text-blue-500" />
            <span>ID: {profile._id}</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-700 text-lg">
            <Calendar className="w-6 h-6 text-blue-500" />
            <span>Joined: {new Date(profile.createdAt).toLocaleDateString()}</span>
          </div>

          {profile.role && (
            <div className="flex items-center space-x-4 text-slate-700 text-lg">
              <Award className="w-6 h-6 text-blue-500" />
              <span>Role: <span className="font-medium capitalize">{profile.role}</span></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
