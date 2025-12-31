// Re-export from the main config
// This file is kept for backward compatibility

// The editable system prompt is now in: src/prompts/system-prompt.md
// To edit the bot's behavior, modify that file and restart the server.

export { SYSTEM_PROMPT, loadSystemPrompt, reloadSystemPrompt } from '../prompts';

export const SAFETY_REFUSAL_RESPONSE = "Whoa there! That's a bit too spicy for me. 🌶️ How about something that won't land you in the hospital or on the news? Record it. Post it. Tag 3 people.";

export const CAMPAIGN_RULES = [
    "10s visual",
    "no dialogue",
    "safe",
    "include Hop Hop product in-frame",
    "mildly foolish"
];

// Banned keywords for pre-filtering user input
export const BANNED_KEYWORDS = [
    "kill", "die", "death", "suicide",
    "hurt", "harm", "damage",
    "fire", "burn", "flame",
    "weapon", "knife", "gun",
    "drugs", "alcohol", "drunk",
    "naked", "nude", "strip",
    "jump off", "fall from"
];

// Check if a message contains banned content
export function containsBannedContent(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    return BANNED_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}
