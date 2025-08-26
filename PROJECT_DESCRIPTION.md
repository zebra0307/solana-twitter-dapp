# Twitter dApp - Project Description

## 📖 Project Overview
A decentralized Twitter-like social media application built on Solana blockchain. Users can post tweets, reply to tweets, retweet content, and like posts in a fully decentralized manner.

## 🚀 Live Demo
- **Frontend URL**: [Add your deployed frontend URL here]
- **Program ID**: `FbzSKvffw1VKoqyTPJjZxQrd2mkXS43P96t3vKNhezEU`
- **Network**: Devnet

## ✨ Features
- **Post Tweets**: Create new tweets with topic and content (max 280 characters)
- **Reply System**: Reply to existing tweets with threading
- **Retweet Functionality**: Share tweets from other users
- **Like System**: Like and unlike tweets with counter
- **Update/Delete**: Tweet authors can modify or delete their content
- **Real-time Timeline**: View all tweets in chronological order

## 🏗️ Technical Architecture

### Smart Contract (Anchor Program)
- **Language**: Rust with Anchor framework
- **Location**: `programs/twitter-dapp/src/lib.rs`
- **Instructions**:
  - `send_tweet`: Create new tweet/reply/retweet
  - `update_tweet`: Modify existing tweet (author only)
  - `delete_tweet`: Remove tweet (author only)
  - `like_tweet`: Add like to tweet
  - `unlike_tweet`: Remove like from tweet

### Frontend
- **Framework**: React + TypeScript + Vite
- **Location**: `my-twitter-frontend/`
- **Key Technologies**:
  - Anchor TS for blockchain interaction
  - Solana Wallet Adapter for wallet connections
  - shadcn/ui for UI components
  - React Query for data management

## 🎯 PDA Usage
The program utilizes Program Derived Addresses (PDAs) for:
- Tweet account creation and management
- Ensuring deterministic addressing for tweets
- Secure account ownership validation

## 🧪 Testing
Comprehensive test suite covering:
- **Happy Paths**: All core functionality works as expected
- **Error Cases**: Proper validation and error handling
- **Security**: Authorization checks and input validation
- **Test File**: `tests/twitter-dapp.ts`

### Test Coverage
- ✅ Tweet creation with various parameters
- ✅ Topic/content length validation
- ✅ Author authorization for updates/deletes
- ✅ Like/unlike functionality
- ✅ Reply threading
- ✅ Retweet mechanics
- ✅ Error handling for edge cases

## 📁 Project Structure
```
program-zebra0307/
├── programs/
│   └── twitter-dapp/
│       └── src/
│           └── lib.rs          # Main Anchor program
├── tests/
│   └── twitter-dapp.ts         # Comprehensive test suite
├── my-twitter-frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── idl/               # Generated IDL files
│   │   └── anchor.ts          # Blockchain connection setup
│   └── package.json
├── Anchor.toml                 # Anchor configuration
└── PROJECT_DESCRIPTION.md      # This file
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 16+
- Rust & Anchor CLI
- Solana CLI

### Backend Setup
```bash
# Install dependencies
npm install

# Build the program
anchor build

# Run tests
anchor test
```

### Frontend Setup
```bash
cd my-twitter-frontend
npm install
npm run dev
```

## 🌐 Deployment

### Smart Contract
The Anchor program is deployed on Solana Devnet with Program ID: `FbzSKvffw1VKoqyTPJjZxQrd2mkXS43P96t3vKNhezEU`

### Frontend
[Add deployment details here - Vercel, Netlify, etc.]

## 🔐 Security Features
- Author-only operations for tweet updates/deletes
- Input validation for content length limits
- Protection against double-liking
- Proper PDA usage for account security

## 🎨 User Experience
- Clean, Twitter-like interface
- Real-time updates
- Wallet integration for seamless blockchain interaction
- Responsive design for mobile and desktop

## 📚 Learning Outcomes
This project demonstrates:
- Solana program development with Anchor
- PDA implementation and usage
- Comprehensive testing strategies
- Frontend-blockchain integration
- Modern React development patterns

## 🔗 Additional Resources
- [Anchor Documentation](https://book.anchor-lang.com/)
- [Solana Cookbook](https://solanacookbook.com/)
- [React Documentation](https://react.dev/)
