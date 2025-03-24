# 🗨️ Real-time Anonymous Chat Application  

A real-time anonymous chat application built with **React (Vite)**, **Tailwind CSS**, and **Firebase Firestore**.  

## 🚀 Features  

- **Live Chat:** Messages appear instantly without refreshing.  
- **Anonymous or Named Messaging:** Users can chat as "Anonymous" or use a temporary nickname.  
- **Real-time Updates:** Messages update in real-time using Firebase Firestore’s `onSnapshot()`.  
- **Message Styling:** Each message has a random avatar color and timestamp.  
- **Spam Protection:** Users can send one message per 10 seconds to prevent spam.  
- **Profanity Filter:** Automatically removes/blocks inappropriate words in messages.  
- **Auto-Scroll:** The chat scrolls down automatically when new messages arrive.  
- **Responsive Design:** Fully mobile-friendly using Tailwind CSS.  
- **Emoji Support:** Users can add emojis via an emoji picker.  
- **Dark Mode:** Toggle between light and dark themes.  

---

## 🛠️ Setup Instructions  

### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

2️⃣ Install Dependencies
npm install
3️⃣ Set Up Firebase
Create a Firebase project at Firebase Console.

Enable Firestore Database.

Obtain your Firebase configuration and replace it in firebase.js.

Example firebase.js file:

javascript
Copy
Edit
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
4️⃣ Run the Development Server
sh
Copy
Edit
npm run dev
By default, your app will be available at http://localhost:5173/.

📸 Screenshots
(Include screenshots of your app here to showcase the UI.)

🤝 Contributing
Contributions are welcome! To contribute:

Fork the repository.

Create a new branch:

sh
Copy
Edit
git checkout -b feature-branch
Commit your changes:

sh
Copy
Edit
git commit -m "Added new feature"
Push to the branch:

sh
Copy
Edit
git push origin feature-branch
Open a Pull Request.


📬 Contact
For any inquiries, feel free to reach out:
📧 Email: talaganarajesh@gmail.com
🐦 Twitter: https://x.com/Rajeshtalagana
