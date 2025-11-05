// app/staff-book/StaffBookClient.tsx

"use client"; // REQUIRED: This enables the useEffect hook

import React, { useEffect } from 'react';

// Define the staff data
const staffData = [
  {
    name: 'Zakaria',
    role: 'Senior Consultant',
    calLink: 'zhacademy/60min', 
    photoUrl: '	https://hebbkx1anhila5yf.public.blob.vercel-storage.com/me1.jpg-nEKV4a9I9TTBR2lObpmwRu65HSXIUU.jpeg', 
  },
  {
    name: 'Iman',
    role: 'Quick Consultation Specialist',
    calLink: 'zhacademie/60min', 
    photoUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp-Image-2024-08-29-at-8.37.39-AM-1-rZhvEGD9lnnZrS9Un5Zr4XYaXkPsEU.jpeg', 
  },
  
];

const StaffBookClient: React.FC = () => {
  
  // CRITICAL FIX: Load the Cal.com script right when this component mounts/hydrates.
  useEffect(() => {
    // Check if the script is already loaded to prevent duplicates
    if (!document.querySelector('script[src="https://cal.com/embed.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://cal.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
    
    // Cleanup function (optional but good practice)
    return () => {
        const existingScript = document.querySelector('script[src="https://cal.com/embed.js"]');
        if (existingScript) {
            // We usually don't remove this script, but this placeholder keeps React happy.
        }
    };
  }, []); // Runs once after initial render

  return (
    <div className="container mx-auto p-4 md:p-10">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
        Choose Your Consultant
      </h1>

      <div className="flex flex-col md:flex-row gap-8 justify-center">
        {staffData.map((staff, index) => (
          <div 
            key={index} 
            className="staff-card w-full md:w-96 bg-white p-8 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center text-center"
          >
            {/* Staff Photo */}
            <img 
              src={staff.photoUrl} 
              alt={`Photo of ${staff.name}`} 
              className="w-36 h-36 rounded-full object-cover mb-6 border-4 border-primary" 
            />
            
            <h2 className="text-3xl font-bold text-gray-900">{staff.name}</h2>
            <p className="text-lg font-medium text-primary mb-8">{staff.role}</p>
            
            {/* Booking Button: The Cal.com attributes */}
            <button
              data-cal-namespace="quick-consultation"
              data-cal-link={staff.calLink} 
              data-cal-config='{"layout":"month_view"}' 
              className="mt-auto w-full bg-primary hover:bg-primary/90 text-white py-3.5 px-6 rounded-xl text-xl font-semibold transition-colors shadow-md"
            >
              Book 60 Min with {staff.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffBookClient;