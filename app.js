// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  sendEmailVerification, onAuthStateChanged, signOut 
} from "firebase/auth";
import { 
  getFirestore, collection, addDoc, onSnapshot, serverTimestamp 
} from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCQ3YGnm-XJ3dXp7b05xMqqfFPVxcD5gOg",
  authDomain: "nexuschat-1422c.firebaseapp.com",
  projectId: "nexuschat-1422c",
  storageBucket: "nexuschat-1422c.firebasestorage.app",
  messagingSenderId: "996520661814",
  appId: "1:996520661814:web:f297a1530f98b182191997"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM elements
const authSection = document.getElementById("auth-section");
const chatSection = document.getElementById("chat-section");
const googleLoginBtn = document.getElementById("google-login");
const emailLoginBtn = document.getElementById("email-login");
const registerBtn = document.getElementById("register");
const logoutBtn = document.getElementById("logout");
const messageInput = document.getElementById("message-input");
const sendMessageBtn = document.getElementById("send-message");
const messagesDiv = document.getElementById("messages");

// Google login
googleLoginBtn.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
});

// Email login
emailLoginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  await signInWithEmailAndPassword(auth, email, password);
});

// Register new user
registerBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCredential.user);
  alert("Verification email sent. Please check your Gmail.");
});

// Auth state listener
onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    authSection.classList.add("hidden");
    chatSection.classList.remove("hidden");
    loadMessages();
  } else {
    authSection.classList.remove("hidden");
    chatSection.classList.add("hidden");
  }
});

// Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

// Send message
sendMessageBtn.addEventListener("click", async () => {
  const text = messageInput.value;
  if (text.trim()) {
    await addDoc(collection(db, "messages"), {
      text,
      sender: auth.currentUser.email,
      timestamp: serverTimestamp()
    });
    messageInput.value = "";
  }
});

// Load messages in real-time
function loadMessages() {
  const q = collection(db, "messages");
  onSnapshot(q, (snapshot) => {
    messagesDiv.innerHTML = "";
    snapshot.forEach((doc) => {
      const msg = doc.data();
      const p = document.createElement("p");
      p.textContent = `${msg.sender}: ${msg.text}`;
      messagesDiv.appendChild(p);
    });
  });
}
