// Firebase Security Rules for ZHAcademie
// Copy these rules to your Firebase Console

/*
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAdmin() {
      return request.auth != null && request.auth.token.role == 'admin';
    }
    
    function isCurrentUser(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    
    function isVerifiedStudent(userId) {
      return request.auth != null && 
             request.auth.uid == userId && 
             exists(/databases/$(database)/documents/students/$(userId)) &&
             get(/databases/$(database)/documents/students/$(userId)).data.verified == true;
    }
    
    // Students collection
    match /students/{userId} {
      // Admins can read and write all student data
      // Students can only read their own data if they're verified
      allow read: isAdmin() || isCurrentUser(userId);
      allow write: isAdmin();
      
      // Subcollections - UPDATED to allow students to read their own progress
      match /applications/{applicationId} {
        allow read: isAdmin() || isCurrentUser(userId);
        allow write: isAdmin();
      }
      
      match /documents/{documentId} {
        allow read: isAdmin() || isCurrentUser(userId);
        allow create, update: isCurrentUser(userId);
        allow delete: isAdmin();
      }
      
      match /appProgress/{progressId} {
        allow read: isAdmin() || isCurrentUser(userId);
        allow write: isAdmin();
      }
      
      match /visaProgress/{progressId} {
        allow read: isAdmin() || isCurrentUser(userId);
        allow write: isAdmin();
      }
      
      match /activity/{activityId} {
        allow read: isAdmin() || isCurrentUser(userId);
        allow write: isAdmin();
      }
      
      match /notes/{noteId} {
        allow read: isAdmin();
        allow write: isAdmin();
      }
      
      match /documentsRequested/{docId} {
        allow read: isAdmin() || isCurrentUser(userId);
        allow write: isAdmin();
      }
    }
    
    // Registration queue
    match /registrationQueue/{userId} {
      // Users can create their own entry
      // Only admins can read, update, or delete
      allow create: isCurrentUser(userId);
      allow read, update, delete: isAdmin();
    }
    
    // Admins collection
    match /admins/{userId} {
      allow read, write: isAdmin();
    }
    
    // Courses collection
    match /courses/{courseId} {
      // Anyone authenticated can read courses
      // Only admins can create, update, or delete
      allow read: request.auth != null;
      allow write: isAdmin();
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      // Users can read their own notifications
      // Only admins can create, update, or delete
      allow read: request.auth != null && resource.data.userId == request.auth.uid;
      allow write: isAdmin();
    }
    
    // General info collection
    match /generalInfo/{infoId} {
      // Anyone authenticated can read
      // Only admins can write
      allow read: request.auth != null;
      allow write: isAdmin();
    }
  }
}

// Storage Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Helper functions
    function isAdmin() {
      return request.auth != null && request.auth.token.role == 'admin';
    }
    
    function isVerifiedStudent(userId) {
      return request.auth != null && 
             request.auth.uid == userId &&
             firestore.exists(/databases/(default)/documents/students/$(userId)) &&
             firestore.get(/databases/(default)/documents/students/$(userId)).data.verified == true;
    }
    
    // Student documents
    match /students/{userId}/documents/{fileName} {
      // Students can upload their own documents
      // Admins can read, update, and delete
      allow read: isAdmin() || request.auth.uid == userId;
      allow create, update: request.auth.uid == userId;
      allow delete: isAdmin();
    }
    
    // Course materials
    match /courses/{courseId}/{fileName} {
      // Anyone authenticated can read course materials
      // Only admins can create, update, or delete
      allow read: request.auth != null;
      allow write: isAdmin();
    }
  }
}
*/

// This file is for reference only - copy the rules to your Firebase Console
export {}
