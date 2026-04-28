
          
# Connect 

A  real-time chat application built with the **MERN stack** and **WebSockets**, designed for seamless communication through **private chat rooms** , **persistent messages** and **instant messaging**.

---

## 🚀 Live Demo

🔗  [https://chat-frontend-ivory-eta.vercel.app](https://chat-frontend-ivory-eta.vercel.app)  

---

## 📌 Overview

**Connect** is a full-stack real-time messaging platform where users can:

- Create private chat rooms
- Join rooms using a Room Name
- Send and receive messages instantly
- View previous chat history
- Manage your profile

---

## ✨ Features

### 🔐 Authentication
- User registration and login
- Secure password hashing using **bcrypt**
- JWT-based authentication stored in **cookies**
- Protected routes for authorized users only

### 💬 Real-Time Persistent Messaging
- Messages are saved in mogodb database 
- Instant messaging with **WebSockets**
- Live updates without refreshing

### 🏠 Rooms System
- Room-based isolated conversations
- Create chat rooms
- Join existing rooms using room name
---
# ✨ Features & Interface

## 1 . Authentication
- Secure Signup and Login system
- Password hashing using **bcrypt**
- JWT-based authentication stored in cookies
- Protected routes for authenticated users only
  <br>
  <br>
- Login page  
<img width="1903" height="904" alt="login_readme" src="https://github.com/user-attachments/assets/9b498f83-38a4-474a-80d6-39aad2bbee5f" />

<br><br>
  
- SignUp page  
<img width="1904" height="896" alt="signup_readme" src="https://github.com/user-attachments/assets/776bd4f1-6fee-4c9b-8e28-a65ef75feb50" />

## 2. Home Page
- Sidebar navigation
- Create or Join chat rooms
  <br>
  <br>
- Home Page
  
  
<img width="1905" height="908" alt="home_readme" src="https://github.com/user-attachments/assets/98fc81cc-9e14-469f-9c71-f4d12f74afd9" />

---

## 4. Create Room
- Generate a unique Room ID
- Share Room ID with friends instantly

📷 Screenshot  
![image](YOUR_SCREENSHOT_LINK)

---

## 5. Join Room
- Join existing chat rooms using Room ID

📷 Screenshot  
![image](YOUR_SCREENSHOT_LINK)

---

## 6. Real-Time Messaging
- Send and receive messages instantly
- Messages persist in MongoDB
- WhatsApp-like chat interface
- Grouped messages with timestamps
  <br>
  <br>
<img width="1900" height="903" alt="room_readme" src="https://github.com/user-attachments/assets/24206699-f594-41fa-8a3b-1405fe1d700e" />


---

## 7. Profile Management
- Update profile picture
- Edit user details
<br><br>
<img width="1906" height="910" alt="profile_readme" src="https://github.com/user-attachments/assets/07d09967-ce28-49dc-8fdd-1eea86731a0a" />


---

## 🛠️ Tech Stack

### Frontend
- React.js
  
 <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="45"/>

          
- Vite
  <br>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" width="45"/>
- Tailwind CSS
  <br>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" width="45"/>
- Axios
- React Router DOM

### Backend
- Node.js
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="40"/>
- Express.js
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" width="40"/>

- WebSocket (ws) library

### Database
- MongoDB
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" width="40"/>

---
## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/GitAditya404/chat.git
cd chat
```
### 2️⃣ Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
### 3️⃣ Setup Backend
```bash
cd backend
npm install
npm start
```
### Setup Environment Variables
Create a .env file in the backend folder:
```bash
PORT = 5000
MONGODb_URI = your_mongodb_connection_string
JWT_SECRET = your_secret_key
```
