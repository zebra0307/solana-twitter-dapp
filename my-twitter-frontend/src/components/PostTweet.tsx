import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, Keypair, SystemProgram } from "@solana/web3.js";
import { getProgram } from "../anchor";

interface Props {
  connection: Connection;
  onPost?: () => void;
}

export const PostTweet: React.FC<Props> = ({ connection, onPost }) => {
  const wallet = useWallet();
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const post = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Posting...");
    try {
      const program = getProgram(wallet, connection);
      const tweet = Keypair.generate();

      // Defensive: Check for missing wallet/program
      if (!wallet.publicKey) throw new Error("Wallet not connected!");
      if (!program) throw new Error("Program not loaded correctly. Check anchor.ts and PROGRAM_ID!");

      await program.methods.sendTweet(topic, content, null, null)
        .accounts({
          tweet: tweet.publicKey,
          author: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([tweet])
        .rpc();

      setStatus("Posted!");
      setTopic(""); setContent("");
      onPost?.();
    } catch (err: any) {
      console.error("PostTweet error:", err);
      setStatus("Error: " + (err?.message || err?.toString() || "Unknown error"));
    }
  };

  return (
    <div className="compose-tweet">
      {!wallet.connected ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            �
          </div>
          <div className="empty-state-title">Connect to start Tweeting</div>
          <div className="empty-state-text">
            Connect your Solana wallet to share your thoughts with the world on the blockchain.
          </div>
        </div>
      ) : (
        <form onSubmit={post}>
          <div className="compose-inner">
            <div className="avatar">
              {wallet.publicKey?.toBase58().slice(0, 2).toUpperCase()}
            </div>
            <div className="compose-content">
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Topic"
                maxLength={50}
                className="compose-topic"
                required
              />
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="What's happening?"
                maxLength={280}
                rows={3}
                className="compose-input"
                required
              />
              <div className="compose-actions">
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span className={`char-count ${topic.length > 40 ? 'warning' : ''} ${topic.length > 48 ? 'danger' : ''}`}>
                    Topic: {topic.length}/50
                  </span>
                  <span className={`char-count ${content.length > 240 ? 'warning' : ''} ${content.length > 270 ? 'danger' : ''}`}>
                    {content.length}/280
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={!wallet.connected || status === "Posting..." || !topic.trim() || !content.trim()}
                  className="btn-tweet"
                >
                  {status === "Posting..." ? (
                    <>
                      <div className="loading-spinner"></div>
                      Posting
                    </>
                  ) : (
                    'Tweet'
                  )}
                </button>
              </div>
              {status && status !== "Posting..." && (
                <div className={status.includes("Error") ? "status-message status-error" : "status-message status-success"}>
                  <span>{status.includes("Error") ? "❌" : "✅"}</span>
                  {status}
                </div>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
