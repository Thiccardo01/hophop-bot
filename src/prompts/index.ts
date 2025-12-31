import fs from 'fs';
import path from 'path';

/**
 * SYSTEM PROMPT LOADER
 * ====================
 * This module loads the system prompt from the editable markdown file.
 * 
 * HOW TO UPDATE THE BOT'S BEHAVIOR:
 * 1. Edit the file: src/prompts/system-prompt.md
 * 2. Save the file
 * 3. Restart the server (changes are loaded on startup)
 * 
 * The system prompt file is a markdown file that contains all the instructions
 * for how the bot should behave, including:
 * - Personality and voice
 * - Conversation flow (welcome, roast, follow gate, etc.)
 * - Super-Resolution rules
 * - Safety filters
 * - Edge cases
 */

// Path to the editable system prompt file
const PROMPT_FILE_PATH = path.join(__dirname, 'system-prompt.md');

// Load and cache the prompt on startup
let cachedPrompt: string | null = null;

/**
 * Loads the system prompt from the markdown file.
 * The prompt is cached after first load for performance.
 * Restart the server to reload changes.
 */
export function loadSystemPrompt(): string {
    if (cachedPrompt) {
        return cachedPrompt;
    }

    try {
        // Read the full markdown file
        const rawPrompt = fs.readFileSync(PROMPT_FILE_PATH, 'utf-8');
        cachedPrompt = rawPrompt;
        console.log('✅ System prompt loaded from:', PROMPT_FILE_PATH);
        return cachedPrompt;
    } catch (error) {
        console.error('❌ Failed to load system prompt file:', error);
        // Fallback to basic prompt if file fails to load
        return FALLBACK_PROMPT;
    }
}

/**
 * Force reload the prompt (useful if you want hot-reloading later)
 */
export function reloadSystemPrompt(): string {
    cachedPrompt = null;
    return loadSystemPrompt();
}

/**
 * Fallback prompt in case the file cannot be loaded
 */
const FALLBACK_PROMPT = `
You are "HopHop Bot" — cheeky, warm, mildly roasting, honest. 
Your job: understand the user's stated goal and RETURN EXACTLY ONE Super-Resolution when asked: a short, visual, safe 10-second action, containing a Hop Hop product in frame, with zero dialogue. 
Always end with: "Record it. Post it. Tag 3 people." 
Never recommend dangerous or illegal actions. 
If a user's input contains risky content, refuse and return a safe, funny alternative. 
Keep responses short (1–3 sentences + instruction). 
Use Hinglish sparingly and match user's tone when possible. 
Enforce the campaign rulebook.
`;

// Export the loaded prompt as a convenience
export const SYSTEM_PROMPT = loadSystemPrompt();
