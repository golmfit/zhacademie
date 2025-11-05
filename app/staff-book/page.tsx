// app/staff-book/page.tsx

import StaffBookClient from './StaffBookClient'; 

// This file remains a Server Component (no 'use client' required)
const BookStaffPage = () => {
  return <StaffBookClient />;
};

export default BookStaffPage;