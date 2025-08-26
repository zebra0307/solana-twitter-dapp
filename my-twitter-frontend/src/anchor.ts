import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import idl from "./idl/twitter_dapp.json";

export const PROGRAM_ID = new PublicKey("FbzSKvffw1VKoqyTPJjZxQrd2mkXS43P96t3vKNhezEU");

export function getProgram(wallet: any, connection: Connection) {
  try {
    const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
    
    // Create a proper IDL with size for each account
    const properIdl = {
      ...idl,
      accounts: idl.accounts.map((account: any) => ({
        ...account,
        size: account.size || 1092 // Default size if not present
      }))
    } as Idl;
    
    return new Program(properIdl, provider);
  } catch (error) {
    console.error("Error creating program:", error);
    throw error;
  }
}