module.exports = {
    "plugins": [
        "stylelint-scss",
        "stylelint-declaration-use-variable"
    ],
    "defaultSeverity": "error",
    "rules": {
        // See rules here
        // https://github.com/stylelint/stylelint/blob/master/docs/user-guide/rules.md
        "scss/selector-no-redundant-nesting-selector": [true],
        "scss/dollar-variable-pattern": ["^[a-z-0-9]+$", {"severity": "warning"}],
        "sh-waqar/declaration-use-variable": [
            [
                "/(^[^$].*(color).*|^color)/",
                "z-index",
                "font-size",
                "font-family"
            ],
            {"severity": "warning"}
        ],
        "at-rule-empty-line-before": ["always", {
            "except": ["blockless-group", "first-nested"],
            "ignore": ["after-comment"],
            "severity": "warning"
        }],
        "at-rule-name-case": "lower",
        "at-rule-name-space-after": "always-single-line",
        "at-rule-semicolon-newline-after": "always",
        "block-closing-brace-newline-after": ["always"],
        "block-closing-brace-newline-before": ["always-multi-line"],
        "block-closing-brace-space-before": ["always-single-line"],
        "block-no-empty": true,
        "block-opening-brace-newline-after": "always-multi-line",
        "block-opening-brace-space-after": ["always-single-line"],
        "block-opening-brace-space-before": ["always"],
        "color-hex-case": ["lower"],
        "color-hex-length": null,
        "color-named": ["never", {"severity": "warning"}],
        "color-no-invalid-hex": [true],
        "comment-empty-line-before": ["always", {
            "except": ["first-nested"],
            "ignore": ["stylelint-commands", "between-comments"],
            "severity": "warning"
        }],
        "comment-whitespace-inside": ["always"],
        "declaration-bang-space-after": ["never"],
        "declaration-bang-space-before": ["always"],
        "declaration-block-no-duplicate-properties": [true],
        "declaration-block-no-ignored-properties": [true],
        "declaration-block-no-shorthand-property-overrides": [true],
        "declaration-block-semicolon-newline-after": ["always-multi-line"],
        "declaration-block-semicolon-space-after": ["always-single-line"],
        "declaration-block-semicolon-space-before": "never",
        "declaration-block-single-line-max-declarations": [1],
        "declaration-block-trailing-semicolon": ["always"],
        "declaration-colon-newline-after": ["always-multi-line"],
        "declaration-colon-space-after": ["always-single-line"],
        "declaration-colon-space-before": ["never"],
        "font-family-name-quotes": ["always-where-recommended", {"severity": "warning"}],
        "font-weight-notation": ["named-where-possible"],
        "function-calc-no-unspaced-operator": true,
        "function-comma-newline-after": "always-multi-line",
        "function-comma-space-after": ["always-single-line"],
        "function-comma-space-before": ["never"],
        "function-linear-gradient-no-nonstandard-direction": true,
        "function-max-empty-lines": 0,
        "function-name-case": "lower",
        "function-parentheses-newline-inside": "always-multi-line",
        "function-parentheses-space-inside": "never-single-line",
        "function-whitespace-after": "always",
        "indentation": [4],
        "keyframe-declaration-no-important": true,
        "length-zero-no-unit": [true, {"severity": "warning"}],
        "max-empty-lines": [2, {"severity": "warning"}],
        "max-nesting-depth": [3, {"severity": "warning"}],
        "media-feature-colon-space-after": "always",
        "media-feature-colon-space-before": "never",
        "media-feature-no-missing-punctuation": true,
        "media-feature-range-operator-space-after": "always",
        "media-feature-range-operator-space-before": "always",
        "media-query-list-comma-newline-after": "always-multi-line",
        "media-query-list-comma-space-after": "always-single-line",
        "media-query-list-comma-space-before": "never",
        "no-descending-specificity": [true, {"severity": "warning"}],
        "no-duplicate-selectors": [true, {"severity": "warning"}],
        "no-eol-whitespace": true,
        "no-extra-semicolons": [true],
        "no-invalid-double-slash-comments": true,
        // This is set to the same option collection of browsers that Autoprefixer uses.
        "no-unsupported-browser-features": [
            true,
            {
                "browsers": [
                    "last 3 Chrome versions",
                    "last 3 Safari versions",
                    "last 3 Firefox versions",
                    "last 3 Edge versions"
                ],
                "ignore": []
            },
            {"severity": "warning"}
        ],
        "number-leading-zero": ["always"],
        "number-no-trailing-zeros": [true],
        "property-case": "lower",
        "property-no-vendor-prefix": [true, {"severity": "warning"}],
        "rule-non-nested-empty-line-before": ["always-multi-line", {
            "ignore": ["after-comment"]
        }],
        "selector-attribute-brackets-space-inside": "never",
        "selector-attribute-operator-space-after": "never",
        "selector-attribute-operator-space-before": "never",
        // "selector-class-pattern": [
        //     "^[a-z-0-9]+$",
        //     {"severity": "warning"},
        //     {"resolveNestedSelectors": true}
        // ],
        "selector-combinator-space-after": ["always"],
        "selector-combinator-space-before": ["always"],
        "selector-list-comma-newline-after": null,
        "selector-list-comma-space-before": "never",
        "selector-list-comma-space-after": ["always-single-line"],
        "selector-max-compound-selectors": [5, {"severity": "warning"}], // Ideally is set to 3
        "selector-max-empty-lines": 0,
        "selector-no-universal": [true, {"severity": "warning"}],
        "selector-pseudo-class-case": "lower",
        "selector-pseudo-class-no-unknown": true,
        "selector-pseudo-class-parentheses-space-inside": "never",
        "selector-pseudo-element-case": "lower",
        "selector-pseudo-element-colon-notation": ["single"],
        "selector-pseudo-element-no-unknown": true,
        "selector-type-case": "lower",
        "selector-type-no-unknown": true,
        "shorthand-property-no-redundant-values": [true],
        "string-no-newline": true,
        "string-quotes": ["double", {"severity": "warning"}],
        "unit-case": "lower",
        "unit-no-unknown": true,
        "unit-whitelist": [["px", "%", "deg", "s", "ms"], {"severity": "warning"}],
        "value-keyword-case": [
            "lower",
            {
                "ignoreKeywords": ["Georgia", "Times", "Menlo", "Monaco", "Consolas"],
                "severity": "warning"
            }
        ],
        "value-list-comma-newline-after": "always-multi-line",
        "value-list-comma-space-after": "always-single-line",
        "value-list-comma-space-before": "never"
    },
    "ignoreFiles": [
        "client-react/src/assets/css/vendor/**/*.{scss,css}"
    ]
};
