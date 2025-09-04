import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, addDoc, setDoc, onSnapshot, collection, query, serverTimestamp, orderBy, limit } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Global variables from the Canvas environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Firebase initialization
let db, auth, userId = null;
let currentGroupId = null;
let unsubscribeFromMessages = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        
        // Sign in the user
        await authenticateUser();

        // Initial setup
        setupEventListeners();
        setupGroupCards();

        // Listen for auth state changes to update the UI
        onAuthStateChanged(auth, (user) => {
            if (user) {
                userId = user.uid;
                console.log("User authenticated:", userId);
                updateProfileImage(user);
                fetchGroupMemberCounts();
            } else {
                console.log("User is signed out.");
                updateProfileImage(null);
            }
        });
    } catch (e) {
        console.error("Failed to initialize Firebase:", e);
    }
});

async function authenticateUser() {
    try {
        if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
            console.log("Signed in with custom token.");
        } else {
            await signInAnonymously(auth);
            console.log("Signed in anonymously.");
        }
    } catch (error) {
        console.error("Authentication failed:", error);
    }
}

function setupEventListeners() {
    // Top navigation button click handler
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const page = e.currentTarget.dataset.page;
            if (page) {
                // Navigate to the correct page
                window.location.href = `../html/${page}.html`;
            }
        });
    });

    // Modal event listeners
    const emergencyButton = document.getElementById('emergencyButton');
    if (emergencyButton) {
        emergencyButton.addEventListener('click', () => showModal('emergencyModal'));
    }
    document.querySelectorAll('.close-modal-btn').forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modal;
            closeModal(modalId);
        });
    });

    document.getElementById('chatForm').addEventListener('submit', sendMessage);
    document.getElementById('leaveChat').addEventListener('click', leaveChat);
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.showModal();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.close();
    }
}

function updateProfileImage(user) {
    const profileImage = document.getElementById('profileImage');
    if (profileImage) {
        if (user && user.photoURL) {
            profileImage.src = user.photoURL;
            profileImage.alt = user.displayName || "User Profile";
        } else {
            // Placeholder for anonymous users or those without a photo
            profileImage.src = "https://placehold.co/100x100/BEC0C2/002D62?text=P";
            profileImage.alt = "Profile Placeholder";
        }
    }
}

function setupGroupCards() {
    document.querySelectorAll('.group-card').forEach(card => {
        card.addEventListener('click', (e) => {
            let targetCard = e.target.closest('.group-card');
            if (targetCard) {
                const groupId = targetCard.dataset.groupId;
                const groupName = targetCard.querySelector('.group-name').textContent;
                joinChat(groupId, groupName);
            }
        });
    });
}

function fetchGroupMemberCounts() {
    if (!db || !userId) return;

    const groupIds = ["anxiety", "depression", "grief"];
    groupIds.forEach(async (groupId) => {
        const membersCollectionRef = collection(db, `artifacts/${appId}/public/data/local-support-groups/${groupId}/members`);
        const membersCountElement = document.getElementById(`members-${groupId}`);

        if (membersCountElement) {
            // Fetch initial count
            const membersSnapshot = await getDocs(membersCollectionRef);
            membersCountElement.textContent = membersSnapshot.size;

            // Listen for real-time changes
            onSnapshot(membersCollectionRef, (snapshot) => {
                membersCountElement.textContent = snapshot.size;
            }, (error) => {
                console.error("Error listening to group members:", error);
            });
        }
    });
}

async function joinChat(groupId, groupName) {
    if (!db || !auth.currentUser) {
        console.error("Firebase not initialized or user not authenticated.");
        return;
    }

    // Set the current group
    currentGroupId = groupId;

    // Show chat container and hide groups list
    const groupsList = document.querySelector('.groups-list');
    const chatContainer = document.getElementById('chatContainer');
    groupsList.classList.add('hidden');
    chatContainer.classList.remove('hidden');

    // Update chat header
    document.getElementById('chatTitle').textContent = groupName;

    // Clear previous messages and unsubscribe from previous listener
    document.getElementById('chatMessages').innerHTML = '';
    if (unsubscribeFromMessages) {
        unsubscribeFromMessages();
    }
    
    // Add user to the group's members collection
    const memberDocRef = doc(db, `artifacts/${appId}/public/data/local-support-groups/${currentGroupId}/members`, auth.currentUser.uid);
    await setDoc(memberDocRef, {
        userId: auth.currentUser.uid,
        joinedAt: serverTimestamp()
    });
    
    // Start listening for new messages
    const messagesCollectionRef = collection(db, `artifacts/${appId}/public/data/local-support-groups/${currentGroupId}/messages`);
    const messagesQuery = query(messagesCollectionRef, orderBy('timestamp'), limit(50));
    
    unsubscribeFromMessages = onSnapshot(messagesQuery, (snapshot) => {
        snapshot.docChanges().forEach(change => {
            if (change.type === "added") {
                const messageData = change.doc.data();
                renderMessage(messageData, change.doc.id);
            }
        });
        document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
    }, (error) => {
        console.error("Error listening to messages:", error);
    });
}

async function sendMessage(event) {
    event.preventDefault();
    if (!currentGroupId || !auth.currentUser) return;

    const input = document.getElementById('messageInput');
    const messageText = input.value.trim();
    if (messageText === '') return;

    try {
        await addDoc(collection(db, `artifacts/${appId}/public/data/local-support-groups/${currentGroupId}/messages`), {
            userId: auth.currentUser.uid,
            text: messageText,
            timestamp: serverTimestamp()
        });
        input.value = '';
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

function renderMessage(data, messageId) {
    const messageContainer = document.getElementById('chatMessages');
    const isSent = data.userId === auth.currentUser.uid;
    
    const messageElement = document.createElement('article');
    messageElement.classList.add('message');
    messageElement.classList.add(isSent ? 'sent' : 'received');
    messageElement.dataset.messageId = messageId;
    
    const senderElement = document.createElement('header');
    senderElement.classList.add('message-sender');
    senderElement.textContent = isSent ? "You" : data.userId.substring(0, 8); // Use substring for a short ID
    
    const textElement = document.createElement('p');
    textElement.classList.add('message-text');
    textElement.textContent = data.text;
    
    messageElement.appendChild(senderElement);
    messageElement.appendChild(textElement);
    messageContainer.appendChild(messageElement);
}

function leaveChat() {
    // Unsubscribe from real-time messages
    if (unsubscribeFromMessages) {
        unsubscribeFromMessages();
        unsubscribeFromMessages = null;
    }
    
    // Remove user from the group's members collection
    if (currentGroupId && auth.currentUser) {
        const memberDocRef = doc(db, `artifacts/${appId}/public/data/local-support-groups/${currentGroupId}/members`, auth.currentUser.uid);
        setDoc(memberDocRef, {
            leftAt: serverTimestamp()
        }, { merge: true }).then(() => {
            console.log("Left group gracefully.");
        }).catch(e => {
            console.error("Error leaving group:", e);
        });
    }

    // Hide chat container and show groups list
    const groupsList = document.querySelector('.groups-list');
    const chatContainer = document.getElementById('chatContainer');
    groupsList.classList.remove('hidden');
    chatContainer.classList.add('hidden');
    
    // Reset state
    currentGroupId = null;
    document.getElementById('chatMessages').innerHTML = '';
}
