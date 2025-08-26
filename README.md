# 🐦 Solana-twitter-dapp -- Decentralized Twitter on Solana

A beautiful, fully-functional Twitter clone built on the Solana blockchain using Anchor framework and React.

![Solana-twitter-dapp Banner](https://img.shields.io/badge/Solana-Twitter-blue?style=for-the-badge&logo=solana)

## ✨ Features 

- 🔗 **Decentralized**: Built on Solana blockchain
- 💙 **Twitter-like UI**: Authentic Twitter design and user experience  
- ✍️ **Post Tweets**: Share your thoughts on the blockchain
- 📰 **Timeline Feed**: View all tweets from the community
- ❤️ **Like System**: Interact with tweets (like/unlike)
- 💬 **Reply & Retweet**: Full social media functionality
- 📱 **Responsive**: Works perfectly on mobile and desktop
- 🌙 **Dark Theme**: Beautiful Twitter-inspired dark mode
- ⚡ **Fast**: Built with modern web technologies

## 🛠️ Tech Stack

### Smart Contract
- **Anchor Framework** - Solana smart contract development
- **Rust** - Systems programming language
- **Solana** - High-performance blockchain

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Solana Web3.js** - Solana JavaScript API
- **Wallet Adapter** - Solana wallet integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Rust 1.70+
- Solana CLI
- Anchor CLI

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/solana-twitter-dapp.git
cd soltwitter
```

2. **Install dependencies**
```bash
# Install Anchor dependencies
npm install

# Install frontend dependencies
cd my-twitter-frontend
npm install
```

3. **Build the smart contract**
```bash
# Go back to root
cd ..
anchor build
```

4. **Deploy to Solana Devnet**
```bash
anchor deploy --provider.cluster devnet
```

5. **Start the frontend**
```bash
cd my-twitter-frontend
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:5173`

## 📱 How to Use

1. **Connect Wallet**: Click "Connect Wallet" to connect your Solana wallet
2. **Post Tweet**: Write your thoughts in the compose box and click "Tweet"
3. **View Timeline**: See all tweets from the community
4. **Interact**: Like, reply, and retweet posts
5. **Enjoy**: Experience decentralized social media!

## 🏗️ Project Structure

```
solana-twitter-dapp/
├── programs/
│   └── twitter-dapp/
│       └── src/
│           └── lib.rs          # Smart contract logic
├── my-twitter-frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── idl/               # Generated IDL files
│   │   └── anchor.ts          # Anchor client setup
│   └── package.json
├── tests/                     # Smart contract tests
├── Anchor.toml               # Anchor configuration
└── README.md
```

## 🎨 Features in Detail

### Smart Contract (`programs/twitter-dapp/src/lib.rs`)
- **Send Tweet**: Post new tweets with topic and content
- **Like Tweet**: Like/unlike functionality with liker tracking
- **Update Tweet**: Edit your own tweets
- **Delete Tweet**: Remove your tweets
- **Reply & Retweet**: Social interaction features

### Frontend Features
- **Twitter-like UI**: Authentic dark theme design
- **Real-time Updates**: Live tweet feed
- **Wallet Integration**: Seamless Solana wallet connection
- **Responsive Design**: Mobile-first approach
- **Error Handling**: User-friendly error messages
- **Loading States**: Smooth loading animations

## 🌟 Screenshots

*Add screenshots of your app here*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Solana** - For the amazing blockchain platform
- **Anchor** - For making Solana development easier
- **Twitter** - For the design inspiration
- **React** - For the fantastic UI library

## 📞 Contact

- **GitHub**: (https://github.com/0307)
- **Twitter**: (https://x.com/rammsey_rs)

---

⭐ **Star this repo if you like it!**

*Built with ❤️ on Solana*
