export interface TaboutSettings {
    rules: Rule[];
}

export interface Rule {
    tokenMatcher: string;
    lookups: string[];
    jumpAfter: boolean;
}

export const DEFAULT_SETTINGS: TaboutSettings = {
    rules: [
        {
            tokenMatcher: "hmd-internal-link",
            lookups: ["]]"],
            jumpAfter: true,
        },
        {
            tokenMatcher: "strong",
            lookups: ["**"],
            jumpAfter: true,
        },
        {
            tokenMatcher: "em",
            lookups: ["*"],
            jumpAfter: true,
        },
        {
            tokenMatcher: "code",
            lookups: ["`"],
            jumpAfter: true,
        },
        {
            tokenMatcher: "math",
            lookups: ["{", "("],
            jumpAfter: true,
        }
    ],
}