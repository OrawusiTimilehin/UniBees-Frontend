# UniBees-Frontend
UniBees 🐝 - The Social Discovery Engine

UniBees is a "Cyber-Organic" social discovery platform designed to solve student isolation through Stigmergy—the biological principle where environmental signals (activity) drive behavior. This repository contains the React-based frontend client.

🎨 Design System

Palette: Amber Yellow (#FFC845) & Pitch Black (#0A0A0B).

Typography: Space Grotesk (Headings) & Inter (Body).

Core Concept: Nectar Quality (Activity-based swarm ranking).

🛠 Tech Stack

Framework: React (Vite)

UI Library: Material UI (MUI)

Icons: Lucide-React & MUI Icons

Real-time: Socket.io-client

API Handling: Axios

📂 Project Structure

Following a modular architecture to ensure scalability:

/src/components: Atomic UI elements (one file per component).

/src/pages: Main routed views (Explore, Match, Chats, Profile).

/src/context: Global state (Auth, Socket).

/src/hooks: Custom logic (usePheromones, useMatch).

/src/theme: Centralized MUI theme configuration.

🚀 Getting Started

Prerequisites

Node.js (v18+)

npm or yarn

Installation

Clone the repository:

git clone [https://github.com/YOUR_USERNAME/unibees-client.git](https://github.com/YOUR_USERNAME/unibees-client.git)


Install dependencies:

npm install


Create a .env file:

VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001


Start the development server:

npm run dev


🐝 Pheromone Logic (Front-End)

The UI simulates pheromone decay ($\alpha = 2.5$) in real-time. Swarms with high "Buzz" triggers a visual pulse and glow, signaling live campus activity.
