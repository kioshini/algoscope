export function parsePythonLine(message: string | null | undefined) {
  const match = message?.match(/user_code\.py["']?, line (\d+)|line (\d+)/i);
  return match ? Number(match[1] || match[2]) : null;
}
