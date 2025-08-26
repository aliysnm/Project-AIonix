import { FIREBASE_CONFIG } from './env.js'
import { store } from './store.js'

let app, auth, db, googleProvider
let firebaseEnabled = false

const importFirebase = async () => {
  const appMod = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js')
  const authMod = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js')
  const dbMod = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js')
  return { appMod, authMod, dbMod }
}

const init = async () => {
  if (!FIREBASE_CONFIG || !FIREBASE_CONFIG.apiKey) return
  const { appMod, authMod, dbMod } = await importFirebase()
  app = appMod.initializeApp(FIREBASE_CONFIG)
  auth = authMod.getAuth(app)
  db = dbMod.getFirestore(app)
  googleProvider = new authMod.GoogleAuthProvider()
  firebaseEnabled = true
  authMod.onAuthStateChanged(auth, async user => {
    store.setUser(user ? {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      emailVerified: user.emailVerified || false,
      provider: user.providerData?.[0]?.providerId || 'password'
    } : null)
    if (user) {
      await getOrCreateUserDoc(user)
    }
    authListeners.forEach(fn => fn(store.getState().user))
  })
}
init()

const authListeners = []
export const onAuthChange = (fn) => {
  authListeners.push(fn)
  fn(store.getState().user)
  return () => {
    const i = authListeners.indexOf(fn)
    if (i >= 0) authListeners.splice(i, 1)
  }
}

const ensure = () => {
  if (!firebaseEnabled) throw new Error('Firebase not configured')
}

export const signInEmailPassword = async (email, password) => {
  ensure()
  const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js')
  const res = await signInWithEmailAndPassword(auth, email, password)
  return res.user
}

export const signUpEmailPassword = async (email, password, displayName) => {
  ensure()
  const { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js')
  const res = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(res.user, { displayName })
  await sendEmailVerification(res.user)
  await getOrCreateUserDoc(res.user)
  return res.user
}

export const signInWithGoogle = async () => {
  ensure()
  const { signInWithPopup } = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js')
  const res = await signInWithPopup(auth, googleProvider)
  await getOrCreateUserDoc(res.user)
  return res.user
}

export const sendPasswordReset = async (email) => {
  ensure()
  const { sendPasswordResetEmail } = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js')
  await sendPasswordResetEmail(auth, email)
}

export const signOutUser = async () => {
  ensure()
  const { signOut } = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js')
  await signOut(auth)
}

export const updateUserProfile = async (data) => {
  ensure()
  const { updateProfile } = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js')
  const user = auth.currentUser
  if (!user) throw new Error('No user')
  await updateProfile(user, { displayName: data.displayName, photoURL: data.photoURL })
  await updateUserDoc(user.uid, data)
  return user
}

export const getOrCreateUserDoc = async (user) => {
  ensure()
  const { doc, getDoc, setDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js')
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: user.displayName || '',
      email: user.email || '',
      photoURL: user.photoURL || '',
      provider: user.providerData?.[0]?.providerId || 'password',
      createdAt: serverTimestamp()
    })
  }
}

export const updateUserDoc = async (uid, data) => {
  ensure()
  const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js')
  const ref = doc(db, 'users', uid)
  await setDoc(ref, { displayName: data.displayName || '', photoURL: data.photoURL || '' }, { merge: true })
}

export { firebaseEnabled, app, auth, db }