export function actorColor(actor: string): string {
  let hash = 0;
  for (let i = 0; i < actor.length; i += 1) {
    hash = actor.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 62% 78%)`;
}
