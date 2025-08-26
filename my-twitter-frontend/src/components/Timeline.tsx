import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { getProgram } from "../anchor";

interface Props {
  connection: Connection;
}

export const Timeline: React.FC<Props> = ({ connection }) => {
  const wallet = useWallet();
  const [tweets, setTweets] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reload = async () => {
    if (!wallet.connected) return;
    setLoading(true);
    setError(null);
    try {
      console.log("Creating program...");
      const program = getProgram(wallet, connection);
      console.log("Program created:", program);
      console.log("Program account keys:", Object.keys(program.account));

      if (!program) throw new Error("Program not initialized. Check PROGRAM_ID and IDL.");

      // Access account dynamically to avoid TypeScript errors
      const accountName = 'tweet'; // lowercase
      const accountClient = (program.account as any)[accountName];
      
      if (!accountClient) {
        console.error("Available accounts:", Object.keys(program.account));
        throw new Error(`Account '${accountName}' not found in IDL. Available accounts: ` + Object.keys(program.account).join(", "));
      }
      
      console.log("Fetching tweets...");
      const tweetAccounts = await accountClient.all();
      console.log("Tweet accounts fetched:", tweetAccounts);
      setTweets(tweetAccounts.map((t: any) => t.account));
    } catch (err: any) {
      console.error("Timeline error:", err);
      setError(err?.message || err?.toString() || "Unknown error fetching tweets");
    }
    setLoading(false);
  };

  useEffect(() => { reload(); }, [wallet, connection]);

  return (
    <div>
      {/* Loading State */}
      {loading && (
        <div className="tweet" style={{ justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
          <div className="loading-spinner" style={{ marginRight: '12px' }}></div>
          <span style={{ color: 'var(--text-muted)' }}>Loading tweets...</span>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="tweet">
          <div className="status-message status-error">
            <span>❌</span>
            <div>
              <strong>Couldn't load tweets</strong>
              <br />
              <span style={{ fontSize: '13px', opacity: 0.8 }}>{error}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {!loading && !error && tweets.length === 0 && wallet.connected && (
        <div className="empty-state">
          <div className="empty-state-icon">
            📝
          </div>
          <div className="empty-state-title">No Tweets yet</div>
          <div className="empty-state-text">
            When people you follow tweet, their messages will show up here. Tweet something yourself to get started!
          </div>
        </div>
      )}
      
      {/* Not Connected State */}
      {!wallet.connected && (
        <div className="empty-state">
          <div className="empty-state-icon">
            🔐
          </div>
          <div className="empty-state-title">See what's happening</div>
          <div className="empty-state-text">
            Connect your wallet to see tweets from the Solana community.
          </div>
        </div>
      )}
      
      {/* Tweets Feed */}
      {tweets.map((tweet, idx) => (
        <article key={idx} className="tweet fade-in">
          <div className="tweet-inner">
            <div className="avatar">
              {tweet.author?.toBase58?.().slice(0, 2).toUpperCase() || "??"}
            </div>
            <div className="tweet-content">
              <div className="tweet-header">
                <span className="tweet-author">
                  {tweet.author?.toBase58?.().slice(0, 8) || "Unknown"}
                </span>
                <span className="tweet-handle">
                  @{tweet.author?.toBase58?.().slice(-4) || "anon"}
                </span>
                <span className="tweet-separator">·</span>
                <time className="tweet-time">
                  {tweet.timestamp ? new Date(tweet.timestamp * 1000).toLocaleDateString() : "Now"}
                </time>
              </div>
              
              {tweet.topic && (
                <div className="tweet-topic">
                  #{tweet.topic}
                </div>
              )}
              
              {tweet.content && (
                <div className="tweet-text">
                  {tweet.content}
                </div>
              )}
              
              {/* Tweet Actions */}
              <div className="tweet-actions">
                <button className="tweet-action">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01z"/>
                  </svg>
                  <span>Reply</span>
                </button>
                
                <button className="tweet-action">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.791-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.791 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/>
                  </svg>
                  <span>Retweet</span>
                </button>
                
                <button className={`tweet-action ${tweet.likes_count > 0 ? 'liked' : ''}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/>
                  </svg>
                  <span>{tweet.likes_count || 0}</span>
                </button>
                
                <button className="tweet-action">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.29 3.3-1.42-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"/>
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
