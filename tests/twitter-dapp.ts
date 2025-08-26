
import * as anchor from "@coral-xyz/anchor";
import assert from "assert";
import { Program } from "@coral-xyz/anchor";
import { TwitterDapp } from "../target/types/twitter_dapp";


console.log("Available workspace programs:", Object.keys((anchor.workspace as any)));
console.log("Workspace programs:", Object.keys(anchor.workspace));
describe("twitter_dapp", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace["twitter_dapp"] as Program<TwitterDapp>;


  // Helper to create a new tweet account
  const createTweetAccount = () => anchor.web3.Keypair.generate();

  // Helper to airdrop SOL to an account
  async function airdrop(pubkey: anchor.web3.PublicKey, amount = 1 * anchor.web3.LAMPORTS_PER_SOL) {
    const sig = await program.provider.connection.requestAirdrop(pubkey, amount);
    await program.provider.connection.confirmTransaction(sig);
  }

  it("Can send a new tweet", async () => {
    const tweet = createTweetAccount();
    const topic = "Solana";
    const content = "Hello, Solana!";
    await program.methods
      .sendTweet(topic, content, null, null)
      .accounts({
        tweet: tweet.publicKey,
        author: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([tweet])
      .rpc();

    const account = await program.account.tweet.fetch(tweet.publicKey);
    assert.strictEqual(account.topic, topic);
    assert.strictEqual(account.content, content);
    assert.strictEqual(account.likesCount, 0);
    assert.ok(account.timestamp.toNumber() > 0);
    assert.ok(!account.parent);
    assert.ok(!account.retweetOf);
  });

  it("Cannot send tweet with topic too long", async () => {
    const tweet = createTweetAccount();
    let err = null;
    try {
      await program.methods
        .sendTweet("x".repeat(51), "content", null, null)
        .accounts({
          tweet: tweet.publicKey,
          author: program.provider.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([tweet])
        .rpc();
    } catch (e) {
      err = e;
    }
    assert(err, "Should fail if topic too long");
  });

  it("Can update a tweet (by author)", async () => {
    const tweet = createTweetAccount();
    await program.methods
      .sendTweet("sol", "first", null, null)
      .accounts({
        tweet: tweet.publicKey,
        author: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([tweet])
      .rpc();

    await program.methods
      .updateTweet("sol", "changed")
      .accounts({
        tweet: tweet.publicKey,
        author: program.provider.publicKey,
      })
      .rpc();

    const updated = await program.account.tweet.fetch(tweet.publicKey);
    assert.strictEqual(updated.content, "changed");
  });

  it("Cannot update tweet as non-author", async () => {
    const tweet = createTweetAccount();
    const nonAuthor = anchor.web3.Keypair.generate();
    await airdrop(nonAuthor.publicKey, 2e9);

    await program.methods
      .sendTweet("topic", "content", null, null)
      .accounts({
        tweet: tweet.publicKey,
        author: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([tweet])
      .rpc();

    let err = null;
    try {
      await program.methods
        .updateTweet("bad", "hax0r")
        .accounts({
          tweet: tweet.publicKey,
          author: nonAuthor.publicKey,
        })
        .signers([nonAuthor])
        .rpc();
    } catch (e) {
      err = e;
    }
    assert(err, "Should fail if not tweet author");
  });

  it("Can delete a tweet (by author)", async () => {
    const tweet = createTweetAccount();
    await program.methods
      .sendTweet("to-del", "bye", null, null)
      .accounts({
        tweet: tweet.publicKey,
        author: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([tweet])
      .rpc();

    // Author deletes
    await program.methods
      .deleteTweet()
      .accounts({
        tweet: tweet.publicKey,
        author: program.provider.publicKey,
      })
      .rpc();

    let err = null;
    try {
      await program.account.tweet.fetch(tweet.publicKey);
    } catch (e) {
      err = e;
    }
    assert(err, "Tweet account should no longer exist");
  });

  it("Cannot delete tweet as non-author", async () => {
    const tweet = createTweetAccount();
    const nonAuthor = anchor.web3.Keypair.generate();
    await airdrop(nonAuthor.publicKey, 2e9);

    await program.methods
      .sendTweet("todel2", "bye", null, null)
      .accounts({
        tweet: tweet.publicKey,
        author: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([tweet])
      .rpc();

    let err = null;
    try {
      await program.methods
        .deleteTweet()
        .accounts({
          tweet: tweet.publicKey,
          author: nonAuthor.publicKey,
        })
        .signers([nonAuthor])
        .rpc();
    } catch (e) {
      err = e;
    }
    assert(err, "Should fail if not tweet author");
  });

  it("Can like and unlike a tweet", async () => {
    const tweet = createTweetAccount();
    const liker = anchor.web3.Keypair.generate();
    await airdrop(liker.publicKey, 2e9);

    await program.methods
      .sendTweet("like", "liking!", null, null)
      .accounts({
        tweet: tweet.publicKey,
        author: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([tweet])
      .rpc();

    await program.methods
      .likeTweet()
      .accounts({
        tweet: tweet.publicKey,
        liker: liker.publicKey,
      })
      .signers([liker])
      .rpc();

    let account = await program.account.tweet.fetch(tweet.publicKey);
    assert.strictEqual(account.likesCount, 1);

    await program.methods
      .unlikeTweet()
      .accounts({
        tweet: tweet.publicKey,
        liker: liker.publicKey,
      })
      .signers([liker])
      .rpc();

    account = await program.account.tweet.fetch(tweet.publicKey);
    assert.strictEqual(account.likesCount, 0);
  });

  it("Cannot like tweet twice from same user", async () => {
    const tweet = createTweetAccount();
    const liker = anchor.web3.Keypair.generate();
    await airdrop(liker.publicKey, 2e9);

    await program.methods
      .sendTweet("likeliketwice", "yo", null, null)
      .accounts({
        tweet: tweet.publicKey,
        author: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([tweet])
      .rpc();

    await program.methods
      .likeTweet()
      .accounts({
        tweet: tweet.publicKey,
        liker: liker.publicKey,
      })
      .signers([liker])
      .rpc();

    let err = null;
    try {
      await program.methods
        .likeTweet()
        .accounts({
          tweet: tweet.publicKey,
          liker: liker.publicKey,
        })
        .signers([liker])
        .rpc();
    } catch (e) {
      err = e;
    }
    assert(err, "Should fail if user tries to like twice");
  });

  it("Can reply to a tweet", async () => {
    const parent = createTweetAccount();
    const reply = createTweetAccount();
    await program.methods
      .sendTweet("main", "origin", null, null)
      .accounts({
        tweet: parent.publicKey,
        author: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([parent])
      .rpc();

    await program.methods
      .sendTweet("reply", "hello!", parent.publicKey, null)
      .accounts({
        tweet: reply.publicKey,
        author: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([reply])
      .rpc();

    const fetched = await program.account.tweet.fetch(reply.publicKey);
    assert.ok(fetched.parent);
    assert.strictEqual(fetched.parent.toBase58(), parent.publicKey.toBase58());
    assert.ok(!fetched.retweetOf);
  });

  it("Can retweet a tweet", async () => {
    const original = createTweetAccount();
    const retweet = createTweetAccount();
    await program.methods
      .sendTweet("sol", "original", null, null)
      .accounts({
        tweet: original.publicKey,
        author: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([original])
      .rpc();

    await program.methods
      .sendTweet("sol", "", null, original.publicKey)
      .accounts({
        tweet: retweet.publicKey,
        author: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([retweet])
      .rpc();

    const fetched = await program.account.tweet.fetch(retweet.publicKey);
    assert.ok(!fetched.parent);
    assert.ok(fetched.retweetOf);
    assert.strictEqual(fetched.retweetOf.toBase58(), original.publicKey.toBase58());
  });
});
