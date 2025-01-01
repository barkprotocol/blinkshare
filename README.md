# BlinkShare - Monorepo

**BlinkShare Powered by BARK Protocol** is a community-driven platform enabling content creators to share their work and receive support through secure, blockchain-powered donations. Built with **Next.js**, **Solana**, **Dialect Blinks**, **Supabase**, **Firebase**, and **Tailwind CSS**, BlinkShare offers a seamless, real-time experience for both creators and supporters.

## Packages

This repository consists of multiple packages:
- **Frontend**: The user-facing application built with Next.js.
- **Backend**: Handles API services, database management, and Solana integration.
- **Telegram Bot**: A bot for managing interactions via Telegram.
- **Discord Bot**: A bot for managing interactions via Discord.

## Features

- **BlinkShare Content Creation & Sharing**: A user-friendly platform that enables community owners and creators to share content and engage with their audience directly within platforms like Discord, integrated with Solana blockchain interactions.
- **Solana-Powered Donations**: Effortless, secure, and instant donations using Solana blockchain and Dialect Blinks.
- **Real-time Interactions**: Dynamic, live updates powered by **Supabase** for seamless user interactions and donation tracking.
- **Modern UI/UX**: Built with **Tailwind CSS** to ensure a responsive, mobile-first interface that’s visually appealing and intuitive.
- **Web3 Integration**: Fast, low-cost Solana donations directly to creators, enabling a decentralized donation system.
- **Creator & Server Support**: Discord bot integration for creators to manage their Blinks, swap, payments, NFTs and donations from within their server environment.

## Tech Stack

### Frontend
- **Next.js 15**: Utilized for server-side rendering, static site generation, and API routes.
- **React 19**: Used for building interactive UI components.
- **Tailwind CSS**: For flexible, responsive, and utility-first design.
- **TypeScript**: For type safety and improved code quality.

### Backend
- **Supabase**: Used for real-time database management, authentication, and session handling.
- **Firebase** (optional): For notifications or chat features in the application.
- **Nodemon**: Used in the backend development environment to automatically restart the server on file changes.

### Blockchain Integration
- **Solana**: Blockchain for fast and secure transactions.
- **Dialect Blinks**: Simplifies donation flows by enabling one-click Solana donations for creators.

## Setup

### Prerequisites

Before setting up the project, make sure you have the following installed:
- **Node.js** (v20 or later) - For running the server and building the project.
- **Solana Wallet** (e.g., Phantom, Solflare, Backpack) - To make donations and interact with Solana.
- **Supabase** - Set up a Supabase project for real-time data handling and authentication.
- **Firebase** (optional) - Set up Firebase for chat and notification features.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bark-protocol/blinkshare.git
   ```

2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Set up environment variables:
   Create a `.env.local` file in the root of the project and add the following keys:
   ```bash
   NEXT_PUBLIC_SOLANA_RPC_URL=your-solana-rpc-url
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key # Optional if using Firebase
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain # Optional
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id # Optional
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket # Optional
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id # Optional
   NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id # Optional
   ```

5. Start the development server:
   ```bash
   pnpm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

## Usage

- **For Creators**: Use the **Creator Dashboard** to manage your content, track donations, and interact with your audience in real-time.
- **For Server Owners**: Integrate the **BlinkShare Bot** into your Discord server to share Blink URLs and accept donations directly within the server.
- **For Supporters**: Support creators by donating Solana to their Blink URLs and interacting with real-time updates on the platform.

## Backend Logic

### Supabase
- **Authentication**: Manages user sessions, registration, and login.
- **Real-Time Data**: Tracks Blinks (content URLs) and donations in real-time. As a result, when a new donation is made, it triggers an immediate update to all users currently connected.
- **Database**: Stores user profiles, Blinks, donation history, and other related content.

### Solana Blockchain and Dialect Blinks
- **Solana Donations**: When users make a donation, it is processed through the Solana blockchain for instant, secure, and low-cost transactions.
- **Dialect Blinks Integration**: A simple donation system that allows creators to receive funds directly into their wallet with a seamless user experience.

### Real-Time Interaction
- **Supabase** powers real-time notifications, so as soon as a user donates or interacts with a Blink URL, all connected clients (Discord, web app) are updated instantly.
- The backend listens for changes in donations or Blink URLs, and the frontend (both Discord bot and the web app) updates the users in real-time without needing to refresh the page.

## Contributing

We welcome contributions to **BlinkShare**! If you would like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- **Solana**: Providing a fast and scalable blockchain solution for creators.
- **Dialect Blinks**: Simplifying blockchain-based donations for creators.
- **Supabase**: Offering real-time database and authentication services for scalable apps.
- **Firebase**: Real-time notifications (optional for chat and notifications).
- **Tailwind CSS**: For crafting responsive and visually engaging user interfaces.
- **BARK Protocol**: Powering the donation infrastructure and blockchain integration.
