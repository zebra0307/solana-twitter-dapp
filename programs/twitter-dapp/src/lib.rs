use anchor_lang::prelude::*;

declare_id!("FbzSKvffw1VKoqyTPJjZxQrd2mkXS43P96t3vKNhezEU");

// Maximum limits (adjust as desired for space)
const MAX_TOPIC_LEN: usize = 50;
const MAX_CONTENT_LEN: usize = 280;
const MAX_LIKERS: usize = 20;

#[program]
pub mod twitter_dapp {
    use super::*;

    // 1. Send (optionally as new tweet, or as reply, or as retweet)
    pub fn send_tweet(
        ctx: Context<SendTweet>,
        topic: String,
        content: String,
        parent: Option<Pubkey>,   // Reply: parent tweet; None = new
        retweet_of: Option<Pubkey> // Retweet: reference to original; None = normal
    ) -> Result<()> {
        require!(topic.len() <= MAX_TOPIC_LEN, CustomError::TopicTooLong);
        require!(content.len() <= MAX_CONTENT_LEN, CustomError::ContentTooLong);

        let tweet = &mut ctx.accounts.tweet;
        tweet.author = *ctx.accounts.author.key;
        tweet.topic = topic;
        tweet.content = content;
        tweet.timestamp = Clock::get()?.unix_timestamp;
        tweet.likes_count = 0;
        tweet.likers = Vec::new();
        tweet.parent = parent;
        tweet.retweet_of = retweet_of;
        Ok(())
    }

    // 2. Update Tweet
    pub fn update_tweet(ctx: Context<UpdateTweet>, new_topic: String, new_content: String) -> Result<()> {
        require!(new_topic.len() <= MAX_TOPIC_LEN, CustomError::TopicTooLong);
        require!(new_content.len() <= MAX_CONTENT_LEN, CustomError::ContentTooLong);

        let tweet = &mut ctx.accounts.tweet;
        require!(tweet.author == *ctx.accounts.author.key, CustomError::Unauthorized);

        tweet.topic = new_topic;
        tweet.content = new_content;
        Ok(())
    }

    // 3. Delete Tweet (only author)
    pub fn delete_tweet(ctx: Context<DeleteTweet>) -> Result<()> {
        let tweet = &ctx.accounts.tweet;
        require!(tweet.author == *ctx.accounts.author.key, CustomError::Unauthorized);
        Ok(())
    }

    // 4. Like Tweet
    pub fn like_tweet(ctx: Context<LikeTweet>) -> Result<()> {
        let tweet = &mut ctx.accounts.tweet;
        let liker = ctx.accounts.liker.key();

        require!(!tweet.likers.contains(&liker), CustomError::AlreadyLiked);
        require!(tweet.likers.len() < MAX_LIKERS, CustomError::TooManyLikers);
        tweet.likes_count += 1;
       tweet.likers.push(liker);
        Ok(())
    }

    // 5. Unlike Tweet
    pub fn unlike_tweet(ctx: Context<LikeTweet>) -> Result<()> {
        let tweet = &mut ctx.accounts.tweet;
        let liker = ctx.accounts.liker.key();

        require!(tweet.likers.contains(&liker), CustomError::NotLiked);
        tweet.likes_count = tweet.likes_count.saturating_sub(1);
        tweet.likers.retain(|x| *x != liker);
        Ok(())
    }

    // (Optional) Add standalone reply or retweet instructions for convenience, or handle via send_tweet() with relevant parent/retweet_of fields.
    // (Optional) Add emits or indexing helpers for the frontend if desired.
}

#[derive(Accounts)]
pub struct SendTweet<'info> {
    #[account(init, payer = author, space = 8 + 32 + 4 + 50 + 4 + 280 + 8 + 4 + (32 * 20) + 33 + 33)]

    // 8: discriminator
    // 32: author
    // 4+50: topic
    // 4+280: content
    // 8: timestamp
    // 4: likes count
    // 32*20: likers
    // 33 optional parent (as COption<Pubkey>)
    // 33 optional retweet_of (as COption<Pubkey>)
    pub tweet: Account<'info, Tweet>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateTweet<'info> {
    #[account(mut, has_one = author)]
    pub tweet: Account<'info, Tweet>,
    #[account(mut)]
    pub author: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeleteTweet<'info> {
    #[account(mut, close = author, has_one = author)]
    pub tweet: Account<'info, Tweet>,
    #[account(mut)]
    pub author: Signer<'info>,
}

#[derive(Accounts)]
pub struct LikeTweet<'info> {
    #[account(mut)]
    pub tweet: Account<'info, Tweet>,
    #[account(mut)]
    pub liker: Signer<'info>,
}

#[account]
pub struct Tweet {
    pub author: Pubkey,
    pub topic: String,
    pub content: String,
    pub timestamp: i64,
    pub likes_count: u32,
    pub likers: Vec<Pubkey>,           // up to MAX_LIKERS
    pub parent: Option<Pubkey>,        // If a reply, parent tweet address, else None
    pub retweet_of: Option<Pubkey>,    // If a retweet, original tweet, else None
}

#[error_code]
pub enum CustomError {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("Tweet already liked by this user.")]
    AlreadyLiked,
    #[msg("Too many likers (limit reached).")]
    TooManyLikers,
    #[msg("Tweet not yet liked by this user.")]
    NotLiked,
    #[msg("Topic too long (max 50 chars).")]
    TopicTooLong,
    #[msg("Content too long (max 280 chars).")]
    ContentTooLong,
}

