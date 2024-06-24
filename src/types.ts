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
            tokenMatcher: "Document",
            lookups: ['"', "'", ")", "}"],
            jumpAfter: true,  
        },
        {
            tokenMatcher: "formatting_formatting-quote_formatting-quote-1_hmd-callout",
            lookups: ['"', "'", ")", "}"],
            jumpAfter: true,  
        },
        {
            tokenMatcher: "quote",
            lookups: ['"', "'", ")", "}"],
            jumpAfter: true,  
        },
        {
            tokenMatcher: "hmd-internal-link",
            lookups: ["]"],
            jumpAfter: true,
        },
        {
            tokenMatcher: "formatting-link_formatting-link-start",
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
            lookups: ["*", "_"],
            jumpAfter: true,
        },
        {
            tokenMatcher: "math",
            lookups: ["$"],
            jumpAfter: true,
        },
        {
            tokenMatcher: "code",
            lookups: ["`"],
            jumpAfter: true,
        },
        {
            tokenMatcher: "header_header",
            lookups: ['"', "'", ")", "}", "]"],
            jumpAfter: true,
        },
        {
            tokenMatcher: "list-1",
            lookups: ['"', "'", ")", "}", "]"],
            jumpAfter: true,
        },
        {
            tokenMatcher: "list-2",
            lookups: ['"', "'", ")", "}", "]"],
            jumpAfter: true,
        },
        {
            tokenMatcher: "list-3",
            lookups: ['"', "'", ")", "}", "]"],
            jumpAfter: true,
        },
        {
            tokenMatcher: "hmd-codeblock",
            lookups: [")", "}"],
            jumpAfter: true,
        }        
    ],
}