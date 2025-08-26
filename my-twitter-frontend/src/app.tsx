import { useMemo, useState } from "react";
import { Connection } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PostTweet } from "./components/PostTweet";
import { Timeline } from "./components/Timeline";

// Solana Devnet endpoint
const ENDPOINT = "https://api.devnet.solana.com";

export default function App() {
  const connection = useMemo(() => new Connection(ENDPOINT), []);
  const [reloadFlag, setReloadFlag] = useState(false);
  const reload = () => setReloadFlag(v => !v);

  return (
    <div className="twitter-container">
      {/* Header - Twitter style */}
      <header className="twitter-header">
        <div className="twitter-logo">
          <span style={{ color: '#1d9bf0', fontSize: '24px' }}>🐦</span>
          <span>Home</span>
          <div style={{ marginLeft: 'auto' }}>
            <WalletMultiButton />
          </div>
        </div>
      </header>
      
      {/* Tweet Compose */}
      <PostTweet connection={connection} onPost={reload} />
      
      {/* Timeline */}
      <Timeline connection={connection} key={reloadFlag ? 1 : 0} />
    </div>
  );
}
