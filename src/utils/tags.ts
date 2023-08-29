export interface BaseTags {
    server: string;
    scope: 'perso';
    env: 'prod';
    team: string;
    provider: string;
}
export interface Tags extends BaseTags {
    [k: string]: string;
}

export function toDatadogTags(tags: Tags): string[] {
    return Object.entries(tags).map(([k, v]) => `${k}:${v}`);
}
