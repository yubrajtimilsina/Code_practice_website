import React from 'react';

export default function LearnerProfile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Learner Profile</h1>
        <p className="text-purple-200 text-lg">This is where the learner's profile information will be displayed.</p>
        {/* You can add more profile details here */}
      </div>
    </div>
  );
}
