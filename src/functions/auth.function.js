import { ref, set } from 'firebase/database';
import { realtimeDatabase } from '../../config/firebase';

import {
    GoogleAuthProvider,
    signInWithRedirect
  } from "firebase/auth";
import { auth } from "../../config/firebase";

export function saveUserSessionToDatabaseInRealTime(uid, userData) {
    set(ref(realtimeDatabase, '/sessions/'+uid), userData);
}

export const handleGoogleSigin = async () => {
    const provider = new GoogleAuthProvider();
  
    try {
      const result = await signInWithRedirect(auth, provider);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }