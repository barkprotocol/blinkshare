# BlinkShare

**BlinkShare Powered by BARK Protocol** is a community-driven platform that allows content creators to easily share their work and receive support through secure, blockchain-powered donations. Built with **Next.js**, **Solana**, **Dialect Blinks**, **Firebase**, and **Tailwind CSS**, BlinkShare offers a seamless, real-time experience for creators and supporters alike.

## Features

- **Create and Share Content**: A user-friendly platform for creators to share their work and engage with their audience.
- **Solana Donations**: Effortless, secure, and instant donations via **Solana** and **Dialect Blinks** integration.
- **Real-time Updates**: Dynamic, live interactions and updates powered by **Firebase**.
- **Modern Design**: A responsive, mobile-first UI crafted with **Tailwind CSS** for an engaging and visually appealing experience.
- **Web3 Integration**: Utilizes **Solana** blockchain technology for fast, low-cost donations directly to creators.

## Tech Stack

- **Frontend**:
  - **Next.js**: For server-side rendering, static site generation, and API routes.
  - **Tailwind CSS**: A utility-first approach to styling for a flexible and responsive design.

- **Backend**:
  - **Firebase**: Provides real-time database management and user authentication.

- **Blockchain**:
  - **Solana**: Integration for fast and secure blockchain transactions.
  - **Dialect Blinks**: A seamless and quick donation system for creators using blockchain technology.

## Setup

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (v14 or later).
- **Solana Wallet**: A wallet (e.g., Phantom, Solflare, Backpack) to make donations.
- **Firebase**: Set up a Firebase account and project for authentication and Firestore.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/blinkshare.git
   ```

2. Navigate into the project directory:
   ```bash
   cd blinkshare
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   Create a `.env.local` file in the root of the project and add the following keys:
   ```bash
   NEXT_PUBLIC_SOLANA_RPC_URL=your-solana-rpc-url
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

   The app will be running at [http://localhost:3000](http://localhost:3000).

## Usage

- **Create Content**: Use the creator dashboard to post new content (images, text, videos, etc.) and share it with your audience.
- **Make Donations**: Support creators by connecting your Solana wallet and making donations via the **Dialect Blinks** button.
- **Real-Time Interaction**: Interact with creators and other users in real-time through live chat and notifications powered by Firebase.

## Contributing

We welcome contributions! To contribute to **BlinkShare**, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- **Solana**: For providing a fast, decentralized blockchain solution.
- **Dialect Blinks**: For simplifying the donation process.
- **Firebase**: For real-time database and authentication services.
- **Tailwind CSS**: For making responsive design easy and efficient.
