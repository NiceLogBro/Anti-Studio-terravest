import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  onSnapshot
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { LegitimacyValidationReport, InvestmentProperty, UserValidationRecord, SavedPropertyRecord } from '../types/property';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
  validations: UserValidationRecord[];
  savedProperties: SavedPropertyRecord[];
  isSaved: (propertyId: string) => boolean;
  toggleSave: (property: InvestmentProperty) => Promise<void>;
  saveValidation: (report: LegitimacyValidationReport, notes?: string) => Promise<void>;
  getValidation: (propertyId: string) => UserValidationRecord | undefined;
  removeValidation: (validationId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [validations, setValidations] = useState<UserValidationRecord[]>([]);
  const [savedProperties, setSavedProperties] = useState<SavedPropertyRecord[]>([]);

  // Listen for auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Sync user profile document
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          await setDoc(userRef, {
            userId: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || 'Investor',
            createdAt: new Date().toISOString()
          }, { merge: true });
        } catch (err) {
          console.warn('Failed to sync user doc:', err);
        }
      } else {
        setValidations([]);
        setSavedProperties([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen for user's private validations and saved properties
  useEffect(() => {
    if (!user) return;

    // Listen to property validations
    const valCol = collection(db, 'property_validations');
    const valQuery = query(valCol, where('userId', '==', user.uid));
    const unsubVal = onSnapshot(valQuery, (snapshot) => {
      const records: UserValidationRecord[] = [];
      snapshot.forEach((d) => {
        records.push({ id: d.id, ...d.data() } as UserValidationRecord);
      });
      setValidations(records);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'property_validations');
    });

    // Listen to saved properties
    const savedCol = collection(db, 'saved_properties');
    const savedQuery = query(savedCol, where('userId', '==', user.uid));
    const unsubSaved = onSnapshot(savedQuery, (snapshot) => {
      const records: SavedPropertyRecord[] = [];
      snapshot.forEach((d) => {
        records.push({ id: d.id, ...d.data() } as SavedPropertyRecord);
      });
      setSavedProperties(records);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'saved_properties');
    });

    return () => {
      unsubVal();
      unsubSaved();
    };
  }, [user]);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Sign-in failed:', err);
      throw err;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign-out failed:', err);
      throw err;
    }
  };

  const isSaved = (propertyId: string) => {
    return savedProperties.some((p) => p.propertyId === propertyId);
  };

  const toggleSave = async (property: InvestmentProperty) => {
    if (!user) {
      await signIn();
      return;
    }

    const existing = savedProperties.find((p) => p.propertyId === property.id);
    const path = `saved_properties/${existing ? existing.id : `${user.uid}_${property.id}`}`;

    try {
      if (existing) {
        await deleteDoc(doc(db, 'saved_properties', existing.id));
      } else {
        const newRecord: Omit<SavedPropertyRecord, 'id'> = {
          userId: user.uid,
          propertyId: property.id,
          propertyTitle: property.title,
          askingOrOpeningBid: property.financials.askingOrOpeningBid,
          estimatedARV: property.financials.estimatedARV,
          distressType: property.distressType,
          savedAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'saved_properties', `${user.uid}_${property.id}`), newRecord);
      }
    } catch (err) {
      handleFirestoreError(err, existing ? OperationType.DELETE : OperationType.WRITE, path);
    }
  };

  const saveValidation = async (report: LegitimacyValidationReport, notes = '') => {
    if (!user) {
      await signIn();
      return;
    }

    const validationDocId = `${user.uid}_${report.propertyId}`;
    const path = `property_validations/${validationDocId}`;

    try {
      const record = {
        userId: user.uid,
        propertyId: report.propertyId,
        propertyTitle: report.propertyTitle,
        county: report.titleAudit.summary,
        state: 'US',
        legitimacyScore: report.legitimacyScore,
        verdict: report.verdict,
        riskLevel: report.verdict === 'VERIFIED_LEGITIMATE' ? 'Low Risk' : 'Moderate Attention',
        bioscienceScore: Math.round(report.bioscienceSoilAudit.cationExchangeCapacity),
        notes: notes || report.summaryVerdictText,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'property_validations', validationDocId), record);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const getValidation = (propertyId: string) => {
    return validations.find((v) => v.propertyId === propertyId);
  };

  const removeValidation = async (validationId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'property_validations', validationId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `property_validations/${validationId}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        logOut,
        validations,
        savedProperties,
        isSaved,
        toggleSave,
        saveValidation,
        getValidation,
        removeValidation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
