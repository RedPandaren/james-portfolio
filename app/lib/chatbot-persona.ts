export const GREETING_RESPONSE =
  "Hi, I’m James Florence Conales — a fintech-specialized Backend Engineer at PETNET, Inc. I can summarize my fintech/security work or dive into specific achievements—what would you like to know?";

export function isGreetingMessage(message: string): boolean {
  const text = message.trim().toLowerCase();
  if (!text) return false;
  if (text.length > 40) return false;
  return /^(hi|hello|hey|yo|good\s+(morning|afternoon|evening)|greetings|sup|hola)\b/.test(text);
}
