module.exports = {
    "plugins": [
        "stylelint-scss",
        "stylelint-declaration-strict-value"
    ],
    "defaultSeverity": "error",
    "rules": {
        // See rules here
        // https://github.com/stylelint/stylelint/blob/master/docs/user-guide/rules.md
        "scss/selector-no-redundant-nesting-selector": [true, {"severity": "warning"}],
        "scss/dollar-variable-pattern": ["^[a-z-0-9]+$", {"severity": "warning"}],
        "scale-unlimited/declaration-strict-value": [
            [
                // regex matches all property names containing the word color but do not start with a $ because that would be a variable name
                "/(^[^$].*(color).*|^color)/"
                /* "z-index",
                "font-size",
                "font-family" */
            ],
            {"ignoreKeywords": ["currentColor", "inherit", "initial", "transparent"]}
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
        "color-named": ["never"],
        "color-no-invalid-hex": [true],
        "comment-empty-line-before": ["always", {
            "except": ["first-nested"],
            "ignore": ["stylelint-commands", "between-comments"],
            "severity": "warning"
        }],
        "comment-whitespace-inside": ["always"],
        "declaration-bang-space-after": ["never"],
        "declaration-bang-space-before": ["always"],
        "declaration-block-no-duplicate-properties": [true, {ignore: ["consecutive-duplicates-with-different-values"]}],
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
        "declaration-property-value-blacklist": {
            // 1st regex matches all property names that do not begin with a $ (because those are variables).
            // 2nd regex matches all values that contain something that looks like a color number.
            // Currently prohibited values are:
            // - any hex color numbers in either 3-digit or 6-digit format such as: #fff or #ffffff
            // - any rgb/hsl/hsla value such as: rgb(0,0,255) or hsl(360, 100%, 0) or hsla(190, 10%, 10%, 0.5)
            // - any rgba value that doesn't have a variable followed by an alpha value.
            //   The values we want to allow aren't valid CSS values, but ARE valid parameters to an SCSS function we want to support.
            //   So we want to prohibit rgba(0, 0, 255, 0.5) yet allow rgba($colorvariable, 0.5)
            //   This particular regular expression is not perfect because it only requires the
            //   first parameter to be a variable. So rgba($variable, 255, 255, 0.5) would pass even though it shouldn't.
            //   We can only make this regular expression so complicated.
            // NOTE: backslash escape characters must be doubled because of how this string constant is processed
            "/^[^$].*/": "/(#[0-9a-f]{3,6})|((rgb|hsl|hsla)\\(.*\\))|(rgba\\([^$].*\\))/"
        },
        "font-family-name-quotes": ["always-where-recommended", {"severity": "warning"}],
        "font-weight-notation": ["named-where-possible", {"severity": "warning"}],
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
                "ignore": [],
                "severity": "warning"
            },
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
        "selector-pseudo-element-colon-notation": ["single", {"severity": "warning"}],
        "selector-pseudo-element-no-unknown": true,
        "selector-type-case": "lower",
        "selector-type-no-unknown": true,
        "shorthand-property-no-redundant-values": [false],
        "string-no-newline": true,
        "string-quotes": ["double", {"severity": "warning"}],
        "unit-case": "lower",
        "unit-no-unknown": true,
        "unit-whitelist": [["px", "%", "deg", "s", "ms", "vh"], {"severity": "warning"}],
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
        "client-react/src/assets/css/vendor/**/*.{scss,css}",
        "client-react/src/**/*.min.css",
        "client-react/src/components/node/datetimePicker/css/bootstrap-datetimepicker.css"
    ]
};
