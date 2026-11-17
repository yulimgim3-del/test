import { firebaseConfig } from './firebase-config.js';

let user;
let db;
let storage;
let firestoreApi;
let storageApi;

export async function connectFirebase() {
  if (!firebaseConfig.projectId || !firebaseConfig.apiKey) return false;

  const [{ initializeApp }, authApi, dbApi, fileApi] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js'),
    import('https://www.gstatic.com/firebasejs/13.1.0/firebase-storage.js')
  ]);
  const app = initializeApp(firebaseConfig);
  const auth = authApi.getAuth(app);
  user = auth.currentUser || (await authApi.signInAnonymously(auth)).user;
  db = dbApi.getFirestore(app);
  storage = fileApi.getStorage(app);
  firestoreApi = dbApi;
  storageApi = fileApi;
  return true;
}

export async function loadPortfolio() {
  if (!user) return null;
  const snapshot = await firestoreApi.getDoc(firestoreApi.doc(db, 'portfolios', user.uid));
  return snapshot.exists() ? snapshot.data() : null;
}

export async function savePortfolio(profile, projects) {
  if (!user) return;
  await firestoreApi.setDoc(firestoreApi.doc(db, 'portfolios', user.uid), {
    profile,
    projects,
    updatedAt: firestoreApi.serverTimestamp()
  });
}

export async function uploadPortfolioImage(file) {
  if (!user || !file?.type.startsWith('image/') || file.size > 10 * 1024 * 1024) return '';
  const extension = file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '') || 'image';
  const fileRef = storageApi.ref(storage, `portfolio-images/${user.uid}/${crypto.randomUUID()}.${extension}`);
  await storageApi.uploadBytes(fileRef, file, { contentType: file.type });
  return storageApi.getDownloadURL(fileRef);
}
