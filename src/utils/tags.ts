export interface BaseTags {
  server: string;
  scope: 'perso';
  env: 'prod';
  app: string;
  team: string;
  provider: string;
  repo: string;
}
export interface Tags extends BaseTags {
  [k: string]: string;
}

export function toDatadogTags(tags: Tags): string[] {
  return Object.entries(tags).map(([k, v]) => `${k}:${v}`);
}
