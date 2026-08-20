// ============================================
// Auth Context — Firebase + Demo Mode
// ============================================
import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { DEMO_USERS } from '../data/mockData';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Helper to wrap promises with a timeout
function withTimeout(promise, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Firebase connection timeout. Make sure you have created the Cloud Firestore database in your Firebase Console and set correct security rules.'));
    }, timeoutMs);

    promise.then(
      (res) => {
        clearTimeout(timer);
        resolve(res);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch merged profile data
  const fetchMergedProfile = async (uid, baseData) => {
    let extendedData = {};
    if (baseData.role === 'faculty') {
      try {
        const facDoc = await withTimeout(getDoc(doc(db, 'faculty_profiles', uid)), 3000);
        if (facDoc.exists()) extendedData = facDoc.data();
      } catch (err) {
        console.warn('Could not fetch faculty profile:', err);
      }
    } else if (baseData.role === 'admin') {
      try {
        const adminDoc = await withTimeout(getDoc(doc(db, 'admin_profiles', uid)), 3000);
        if (adminDoc.exists()) extendedData = adminDoc.data();
      } catch (err) {
        console.warn('Could not fetch admin profile:', err);
      }
    }
    return { ...baseData, ...extendedData };
  };

  // Refresh user profile data from Firestore or localStorage
  const refreshUserProfile = async () => {
    if (isFirebaseConfigured && auth && auth.currentUser) {
      try {
        const firebaseUser = auth.currentUser;
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const merged = await fetchMergedProfile(firebaseUser.uid, data);
          setUserRole(data.role);
          setUserProfile(merged);
          return merged;
        }
      } catch (e) {
        console.warn('Failed to refresh user profile from Firestore:', e);
      }
    } else {
      // Demo mode / local fallback
      const savedUser = localStorage.getItem('campusbuddy_demo_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUserProfile(parsed);
        setUser(parsed);
        setUserRole(parsed.role);
        return parsed;
      }
    }
  };

  // Listen for auth state changes (Firebase mode)
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userDoc = await withTimeout(getDoc(doc(db, 'users', firebaseUser.uid)), 4000);
            if (userDoc.exists()) {
              const data = userDoc.data();
              const merged = await fetchMergedProfile(firebaseUser.uid, data);
              setUserRole(data.role);
              setUserProfile(merged);
            } else {
              // Default fallback if no doc found
              setUserRole('student');
              setUserProfile({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'student', displayName: firebaseUser.displayName });
            }
          } catch (e) {
            console.warn('Could not fetch user profile from Firestore:', e);
            // Safe fallback so the page doesn't hang forever
            setUserRole('student');
            setUserProfile({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'student', isOfflineFallback: true });
          }
          setUser(firebaseUser);
        } else {
          // If not in Firebase auth, check if we have a local demo session
          const savedUser = localStorage.getItem('campusbuddy_demo_user');
          if (savedUser) {
            const parsed = JSON.parse(savedUser);
            setUser(parsed);
            setUserRole(parsed.role);
            setUserProfile(parsed);
          } else {
            setUser(null);
            setUserRole(null);
            setUserProfile(null);
          }
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Demo mode: check localStorage
      const savedUser = localStorage.getItem('campusbuddy_demo_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setUserRole(parsed.role);
        setUserProfile(parsed);
      }
      setLoading(false);
    }
  }, []);

  // Login
  async function login(email, password, role) {
    // Bypassing Firebase for Demo Credentials so Quick Demo Login always works immediately!
    if (email === 'student@test.com' && password === '123456') {
      const demoUser = DEMO_USERS[email];
      setUser(demoUser);
      setUserRole(demoUser.role);
      setUserProfile(demoUser);
      localStorage.setItem('campusbuddy_demo_user', JSON.stringify(demoUser));
      return demoUser;
    }
    if (email === 'faculty@test.com' && password === '123456') {
      const demoUser = DEMO_USERS[email];
      setUser(demoUser);
      setUserRole(demoUser.role);
      setUserProfile(demoUser);
      localStorage.setItem('campusbuddy_demo_user', JSON.stringify(demoUser));
      return demoUser;
    }
    if (email === 'admin@test.com' && password === '123456') {
      const demoUser = DEMO_USERS[email];
      setUser(demoUser);
      setUserRole(demoUser.role);
      setUserProfile(demoUser);
      localStorage.setItem('campusbuddy_demo_user', JSON.stringify(demoUser));
      return demoUser;
    }

    if (isFirebaseConfigured && auth) {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // Make sure the base user doc exists with role
      try {
        await withTimeout(
          setDoc(doc(db, 'users', cred.user.uid), { email, role }, { merge: true }),
          4000
        );
      } catch (e) {
        console.warn('Could not save user profile to Firestore:', e);
      }
      setUserRole(role);
      
      // Load extended profile data
      try {
        const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const merged = await fetchMergedProfile(cred.user.uid, data);
          setUserProfile(merged);
        } else {
          setUserProfile({ uid: cred.user.uid, email, role });
        }
      } catch (err) {
        setUserProfile({ uid: cred.user.uid, email, role });
      }
      return cred.user;
    } else {
      // Demo mode fallback for other input
      const demoUser = DEMO_USERS[email];
      if (demoUser && demoUser.password === password) {
        setUser(demoUser);
        setUserRole(demoUser.role);
        setUserProfile(demoUser);
        localStorage.setItem('campusbuddy_demo_user', JSON.stringify(demoUser));
        return demoUser;
      }
      throw new Error('Invalid credentials. Try student@test.com / 123456');
    }
  }

  // Register
  async function register(email, password, role, displayName) {
    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const initialProfile = {
        uid: cred.user.uid,
        email,
        role,
        displayName: displayName || email.split('@')[0],
        name: displayName || email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      
      // Update profile in Firestore with timeout
      try {
        await withTimeout(
          setDoc(doc(db, 'users', cred.user.uid), initialProfile),
          4000
        );

        if (role === 'faculty') {
          await withTimeout(
            setDoc(doc(db, 'faculty_profiles', cred.user.uid), {
              facultyId: 'FAC-' + Math.floor(1000 + Math.random() * 9000),
              dept: 'CSE',
              designation: 'Assistant Professor',
              cabinNo: '',
              mobileNo: '',
              email,
              subjects: [],
            }),
            4000
          );
        } else if (role === 'admin') {
          await withTimeout(
            setDoc(doc(db, 'admin_profiles', cred.user.uid), {
              adminId: 'ADM-' + Math.floor(1000 + Math.random() * 9000),
              department: 'Administration',
              mobileNo: '',
            }),
            4000
          );
        }
      } catch (e) {
        console.warn('Could not save user profile to Firestore:', e);
      }
      
      setUserRole(role);
      
      // Load and set merged profile
      try {
        const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
        const merged = await fetchMergedProfile(cred.user.uid, userDoc.exists() ? userDoc.data() : initialProfile);
        setUserProfile(merged);
      } catch (err) {
        setUserProfile(initialProfile);
      }
      return cred.user;
    } else {
      // Demo mode: just pretend to register
      const newUser = {
        uid: 'demo-' + Date.now(),
        email,
        displayName: displayName || email.split('@')[0],
        name: displayName || email.split('@')[0],
        role,
      };
      // Pre-fill fields for demo context
      if (role === 'student') {
        Object.assign(newUser, {
          studentId: 'STU-' + Math.floor(1000 + Math.random() * 9000),
          dept: 'CSE',
          stream: 'AI-ML',
          course: 'B.Tech',
          year: '3rd',
          rollNo: 'NIT/CSE/2026/088',
          address: 'Kolkata, India',
          mobileNo: '+91 99999 88888',
          marksheet: [],
        });
      } else if (role === 'faculty') {
        Object.assign(newUser, {
          facultyId: 'FAC-' + Math.floor(1000 + Math.random() * 9000),
          dept: 'CSE',
          designation: 'Assistant Professor',
          cabinNo: 'Cabin 304, Block A',
          mobileNo: '+91 99999 77777',
          subjects: ['Data Structures', 'Database Management Systems'],
        });
      } else if (role === 'admin') {
        Object.assign(newUser, {
          adminId: 'ADM-' + Math.floor(1000 + Math.random() * 9000),
          department: 'Administration',
          mobileNo: '+91 99999 66666',
        });
      }
      setUser(newUser);
      setUserRole(role);
      setUserProfile(newUser);
      localStorage.setItem('campusbuddy_demo_user', JSON.stringify(newUser));
      return newUser;
    }
  }

  // Logout
  async function logout() {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Firebase signOut failed:', e);
      }
    }
    setUser(null);
    setUserRole(null);
    setUserProfile(null);
    localStorage.removeItem('campusbuddy_demo_user');
  }

  const value = {
    user,
    userRole,
    userProfile,
    setUserProfile,
    refreshUserProfile,
    loading,
    login,
    register,
    logout,
    isDemo: !isFirebaseConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
