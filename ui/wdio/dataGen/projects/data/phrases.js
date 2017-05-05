(function() {
    'use strict';
    let chance = require('chance').Chance();
    let _ = require('lodash');

    let techno = {};
    let collab = {};
    let ident = {};
    let verbs = [];
    let phrase = [];
    let dict = techno;

    let settings = {
        dict:   {num: 0},
        noun:   {num: 1},
        suffix: {num: 0},
        adnoun: {num: 1},
        adject: {num: 1},
        adverb: {num: 1},
        prefix: {num: 0}
    };

    function updateDefaultSettings(options) {
        if (options) {
            settings.dict.num = _.get(options, 'dict.num', settings.dict.num);
            settings.noun.num = _.get(options, 'noun.num', settings.noun.num);
            settings.suffix.num = _.get(options, 'suffix.num', settings.suffix.num);
            settings.adnoun.num = _.get(options, 'adnoun.num', settings.adnoun.num);
            settings.adject.num = _.get(options, 'adject.num', settings.adject.num);
            settings.adverb.num = _.get(options, 'adverb.num', settings.adverb.num);
            settings.prefix.num = _.get(options, 'prefix.num', settings.prefix.num);
        }
    }

    //fill in 0 for each entry
    function zeroes(n) {
        let newArray = new Array(n);
        for (let i = 0; i < n; ++i) {
            newArray[i] = 0;
        }
        return (newArray);
    }

    function init() {
        phrase = [];
    }

    function addPhrase() {
        let dp = settings;
        dict = techno;
        if (dp.dict.num === 1) {
            dict = collab;
        }
        if (dp.dict.num === 2) {
            dict = ident;
        }

        let n_noun = chance.integer({min:1, max:dp.noun.num});
        let n_suffix = chance.integer({min:0, max:dp.suffix.num});
        let n_adnoun = chance.integer({min:0, max:dp.adnoun.num});
        let n_adject = chance.integer({min:0, max:dp.adject.num});
        let n_adverb = chance.integer({min:0, max: dp.adverb.num});
        let n_prefix = chance.integer({min:0, max:dp.prefix.num});

        /*** Apply limits based on other parts of speech. */
        n_prefix = Math.min(n_prefix, n_adject);
        n_suffix = Math.min(n_suffix, n_adnoun);
        n_adverb = Math.min(n_adverb, n_adject);

        /*** Assemble the entire phrase, from right to left i.e. backwards.  noun(s),
         /    then their adnouns (with *their* suffixes), then adjectives
         /    (and *their* prefixes), and finally the adverb(s) and verb. */


        /*** Nouns */
        let r = 0;
        let used = zeroes(dict.nouns.length);
        let part = "";
        for (let i = 0; i < n_noun; ++i) {
            do {
                r = Math.floor(Math.random() * used.length);
            } while (used[r]) ; // find an unused entry
            part = part + ' ' + dict.nouns[r];
            used[r] = 1;
        }
        phrase = part + phrase;

        /*** Adnouns (and suffixes) */
        used = zeroes(dict.adnouns.length);
        part = "";
        let word;
        for (let i = 0; i < n_adnoun; ++i) {
            do {
                r = Math.floor(Math.random() * used.length);
            }
            while (used[r]) ;
            word = dict.adnouns[r];
            used[r] = 1;
            if (i < n_suffix) {
                word = word + dict.suffixes[Math.floor(Math.random() *
                        dict.suffixes.length)];
            }
            part = part + ' ' + word;
        }
        phrase = part + phrase;

        /*** Adjectives (and prefixes) */
        used = zeroes(dict.adjectives.length);
        part = "";
        for (let i = 0; i < n_adject; ++i) {
            do {
                r = Math.floor(Math.random() * used.length);
            }
            while (used[r]) ;
            word = dict.adjectives[r];
            used[r] = 1;
            if (i < n_prefix) {
                word = dict.prefixes[Math.floor(Math.random() *
                        dict.prefixes.length)] + word;
            }
            part = part + ' ' + word;
        }
        phrase = part + phrase;

        /*** Verb */
        part = chance.pick(verbs);
        phrase = part + phrase;

        /*** Adverbs */
        used = zeroes(dict.adverbs.length);
        part = "";
        for (let i = 0; i < n_adverb; ++i) {
            do {
                r = Math.floor(Math.random() * used.length);
            }
            while (used[r]) ;
            part = part + dict.adverbs[r] + ' ';
            used[r] = 1;
        }
        phrase = part + phrase;


        return (phrase);
    }



    /*** Dictionaries: TechnoLatin, CollaboLatin, IdentoLatin, etc. */
    verbs = [
        "A/B test", "acqui-hire", "analyze", "approve",
        "break through the", "bring to the table,", "communicate", "create",
        "debug", "design", "direct", "disrupt",
        "distribute", "draft", "eliminate", "facilitate",
        "formulate", "grow", "implement", "instrument",
        "leverage", "model", "pivot", "plan",
        "prepare", "present", "push the", "reach out to",
        "reorganize", "repair", "research", "review",
        "sell", "socialize", "spin-up", "streamline",
        "test", "transform", "unpack", "validate",
    ];

    techno.nouns = [
        "access", "address", "alignment", "analysis", "analyst", "application", "applications",
        "architecture", "area", "automation", "availability", "breakthrough",
        "bridging", "business", "buzzword", "center", "capability", "chain", "channel", "choice",
        "clear goal", "client", "clone", "commitment", "communications", "compatibility",
        "computing", "concept", "conference", "conferencing", "configuration",
        "connection", "connectivity", "context", "contingency", "control",
        "convergence", "core", "credibility", "custom", "data", "decision",
        "dekoven", "demand", "desktop", "design", "developer", "device",
        "differentiation", "diversity", "document", "empowerment", "engine", "enhancement",
        "enterprise", "environment", "equipment", "exchange", "executive", "exit strategy",
        "expert", "feature", "focus", "framework", "function", "generation",
        "gesture", "groupware", "growth", "guideline", "host", "impact",
        "implementation", "induction", "industry", "information",
        "infrastructure", "initiative", "innovation", "inference", "integration",
        "intelligence", "interface", "leadership", "level", "leverage", "logic",
        "machine", "management", "manipulation", "market", "marketing", "matrix",
        "media", "messaging", "method", "multimedia", "network", "object",
        "objective", "operation", "option", "paradigm", "parameter", "partner",
        "partnership", "philosophy", "platform", "policy", "position", "positioning",
        "power", "process", "processing", "processor", "product", "production",
        "productivity", "program", "proposition", "protocol",
        "provider", "reference", "resource", "routine", "rule", "sector", "server",
        "service", "services", "shrinkage", "simulation", "solution", "standard",
        "standards", "strategy", "structure", "supplier", "support", "system",
        "systems", "technology", "tool", "tools", "topology", "user",
        "utilization", "vendor", "wonder", "workgroup", "cretin", "radish", "sponge"];

    techno.suffixes = [
        "-access", "-active", "-area", "-based", "-capable", "-compatible",
        "-connected", "-dependent", "-determinable", "-driven", "-enabled",
        "-free", "-impaired", "-intensive", "-led", "-level", "-optional",
        "-oriented", "-phase", "-ready", "-referenced", "-structured", "-time",
        "-ware"];

    techno.prefixes = [
        "backward-", "backwards-", "client-", "cross-", "data-", "demand-", "dual-",
        "ever-", "hyper-", "i/o-", "inter-", "intra-", "multi-", "neo-", "phase-",
        "power-", "server-", "servo-", "super-", "tele-", "time-", "turbo-",
        "upward-", "upwards-"];

    techno.adnouns = [
        "alternative", "analysis", "analyst", "application", "architecture", "area",
        "breakthrough", "business", "capacity", "chain", "channel", "choice",
        "client", "clone", "commitment", "compatibility", "computing", "concept",
        "configuration", "connection", "connectivity", "context", "contingency",
        "control", "convergence", "design", "developer", "device", "differentiation",
        "division", "document", "effector", "empowerment", "enhancement",
        "enterprise", "environment", "equipment", "evangelist", "exchange",
        "executive", "facility", "feature", "freedom", "function", "functionality",
        "generation", "groupware", "history", "host", "i/o", "implementation",
        "induction", "industry", "infrastructure", "initiative", "innovation",
        "integration", "inference", "interface", "leader", "level", "logic",
        "machine", "market", "matrix", "media", "medium", "method", "module",
        "movement", "network", "objective", "operation", "option", "paradigm",
        "parameter", "partner", "partnership", "philosophy", "platform", "policy",
        "position", "power", "process", "processor", "product", "production",
        "program", "proposition", "protocol", "provider", "quality", "recognition",
        "recognizer", "reference", "resource", "rule", "sector", "server", "service",
        "shrinkage", "simulation", "solution", "standard", "standards", "strategy",
        "structure", "supplier", "system", "technology", "template", "tool",
        "topology", "user", "vendor", "workgroup", "melon", "potato", "petard",
        "weasel", "oven", "suppository"];

    techno.adjectives = [
        "active", "advanced", "alternative", "architected", "attractive",
        "automated", "balanced", "bridging", "centered", "central", "centralized",
        "committed", "compatible", "competitive", "complementary", "complete",
        "complex", "comprehensive", "conferencing", "configurable",
        "configured", "consistent", "contemporary", "continuous", "convergent",
        "cooperative", "credible", "custom", "customized", "dedicated",
        "differentiated", "digital", "direct", "directed", "distinguished",
        "distributed", "dressable", "efficient", "elegant", "emerging",
        "empowered", "enabled", "enhanced", "environmental", "excellent",
        "exclusive", "expedient", "extended", "extendible", "extensible", "external",
        "extraordinary", "fast", "fastest", "featured", "first", "flexible",
        "full", "functional", "global", "graphical", "horizontal",
        "impactful", "incremental", "independent", "indicative", "inherent",
        "initial", "innovative", "innovative", "instrumental", "integrated",
        "intelligent", "intensive", "interactive", "interchangable", "internal",
        "interoperable", "instrumental", "integrated", "intelligent",
        "intelligent", "intensive", "interactive", "interchangable", "internal",
        "interoperable", "joint", "key", "large", "leading", "leveraged", "logical",
        "logistical", "major", "modified", "modular", "multiple", "neural",
        "neutral", "new", "numerous", "objective", "open", "operational",
        "optimal", "optional", "overall", "parallel", "particular", "personal",
        "positive", "primary", "proactive", "productive", "programatic",
        "progressive", "reciprocal", "reinforced", "responsive", "robust", "routine",
        "routing", "scalable", "seamless", "selectable", "significant", "simulated",
        "sophisticated", "spacial", "state-of-the-art", "strategic",
        "streamlined", "structural", "successful", "superior", "synchronized",
        "tactical", "technical", "total", "transferable", "transitional",
        "transparent", "uncompromising", "unique", "unparalleled", "utilized",
        "value-added", "various", "vertical", "virtual", "visual", "wonderful",
        "worldwide", "pan-sexual", "stupid"];

    techno.adverbs = [
        "alternatively", "attractively", "automatically", "backwardly", "centrally",
        "compatibly", "competitively", "completely", "comprehensively",
        "configurably", "considerably", "consistently", "continuously",
        "cooperatively", "corporately", "credibly", "digitally", "directly",
        "efficiently", "entirely", "especially", "evidently", "exceedingly",
        "exclusively", "externally", "extraordinarily", "extremely", "firstly",
        "flexibly", "fully", "functionally", "globally", "graphically", "highly",
        "increasingly", "incrementally", "indicatively", "inexpensively",
        "inferentially", "inherently", "initially", "innovatively",
        "instrumentally", "intelligently", "intensively", "interactively",
        "interchangably", "internally", "interoperably", "intuitively", "jointly",
        "largely", "logically", "logistical", "modularly", "multiply", "newly",
        "numerously", "objectively", "openly", "operationally", "optimally",
        "optionally", "originally", "particularly", "personally", "positively",
        "primarily", "proactively", "procedurally", "productively",
        "programatically",
        "progressively", "reciprocally", "responsively", "robustly", "routinely",
        "seamlessly", "selectably", "semantically", "significantly", "specially",
        "strategically", "structurally", "substantially", "successfully",
        "tactically", "technically", "totally", "transitionally", "transparently",
        "truly", "uncompromisingly", "uniquely", "upwardly", "variously",
        "virtually", "visually", "wonderfully"];

    collab.nouns = [
        "alignment", "appliance", "bandwidth", "boundaries", "bulletin",
        "bureaucracy", "commitment", "conference", "consensus", "consortia",
        "consultants", "context", "curriculum", "developments", "dialogue",
        "dimension", "directions", "discussion", "empowerment", "energies", "envelope",
        "exchange", "expectations", "face time", "facillitation", "floor", "groupware",
        "groupware", "ideas", "implementation", "infrastructure", "inquiry",
        "interactions", "issues", "journey", "leadership", "levels", "management",
        "material", "medium", "meeting", "member", "method", "model", "mood",
        "movement", "organization", "performance", "period", "principle",
        "process", "processes", "purpose", "requirement", "response", "results",
        "schedule", "springboard", "strategy", "support", "synchronicity",
        "teams", "technology", "template", "term", "theory", "tools",
        "touchpoints", "universe", "unoact", "value", "values", "work",
        "millennial", "new normal",  "on the runway", "organic growth", "paradigm", "sea change",  "sisterhood",
        "strategic communication",  "sustainability",  "wellness", "wheelhouse",  "win-win"];

    collab.suffixes = [
        "-credited", "-enabled", "-facilitated", "-focused", "-goods",
        "-graphical", "-installed", "-level", "-managed", "-mapped",
        "-necessitated", "-networked", "-process", "-staged", "-suggestable",
        "-term"];

    collab.prefixes = [
        "change-", "cross-", "meta-", "non-", "self-", "team-"];

    collab.adnouns = [
        "bandwidth", "belief", "boundary", "bulletin", "challenge", "complexity",
        "consensus", "context", "curriculum", "dialogue", "discussion", "dream",
        "effectiveness", "energy", "engagement", "human", "impact", "information",
        "infrastructure", "intimacy", "knowledge", "leadership", "learning", "level",
        "meeting", "membership", "messaging", "off-site", "on-site", "online",
        "organization", "outline", "performance", "phase", "process", "reality",
        "reference", "research", "sense", "strategy", "teaching",
        "teamwork", "teamwork", "technology", "theory", "time/space", "variable"];

    collab.adjectives = [
        "arguable", "articulated", "asynchronous", "basic", "better", "clatrified",
        "clear", "coherent", "collaborative", "committed", "complex", "conceptual",
        "concrete", "conscious", "constrained", "creative", "defined", "directional",
        "distributed", "dynamic", "effective", "embodied", "enhanced", "eventual",
        "explicit", "external", "graphic", "high", "horizontal", "huge",
        "imaginative", "important", "increasing", "initial", "intensive",
        "interactive", "internal", "international", "invaluable", "leading",
        "linguistic", "managed", "multiple", "multisensory", "phased", "physical",
        "positive", "potential", "predictable", "reflexive", "renewable",
        "requisite", "semantic", "shared", "shared", "solid", "sophisticated",
        "spatial", "structured", "supportive", "synchronous", "tacit", "theoretical",
        "trusted", "trusted", "trusted", "universal", "vertical", "virtual"];

    collab.adverbs = [
        "actually", "arguably", "eventually", "exponentially", "frequently",
        "horizontally", "increasingly", "initially", "institutionally",
        "occasionally", "perfectly", "personally", "respectfully", "surprisingly",
        "tightly", "typically", "ultimately", "variably", "vertically",
        "virtually"];

    ident.nouns = [
        "action", "alliance", "apis", "architect", "architecture", "assertion",
        "attributes", "benefits", "breakthrough", "buy-in", "character", "circle",
        "coexistence", "community", "component", "components", "concept", "concepts",
        "concern", "connection", "consolidation", "consumers", "content",
        "conversations", "data", "deployments", "design", "destination", "directory",
        "dream", "driver", "economy", "enabler", "enforcement", "entity",
        "environment", "error", "event", "facility", "factors", "fear",
        "federation", "field", "firewall", "flow", "flows", "foundation",
        "framework", "functionalities", "functions", "globalization", "goal", "governance",
        "hardware", "hierarchy", "hub", "impact", "incentives",
        "inefficiencies", "information", "infrastructure", "initiative",
        "interaction", "interoperability", "intgerop", "languages",
        "legacy", "leverage", "loyalty", "market", "model", "name space",
        "nexus", "nightmare", "object", "obstacle", "offering", "organization",
        "overlap", "partner", "partnership", "party", "party", "people",
        "perimiter", "personality", "platform", "point", "policies", "policy",
        "portal", "power", "predicate", "pressure", "problem", "project", "projects",
        "proliferation", "promotion", "protocol", "protocols", "providers",
        "purpose", "puzzle", "quagmire", "recourse", "regulations", "relationships",
        "repository", "request", "responsibility", "roadmap", "roi", "role", "rule",
        "rules", "scope", "semantics", "service", "services", "silo", "software",
        "space", "spoke", "standard", "standards", "state", "state", "synergy",
        "system", "task", "technology", "tools", "transactions", "transport",
        "tree", "underpinnings", "validity", "value", "winners", "world",
        "worlds", "wrappers"];

    ident.suffixes = [
        "-applicable", "-based", "-contained", "-coupled", "-coupled", "-enabled",
        "-facing", "-powered", "-networked", "-oriented", "-wide"];

    ident.prefixes = [
        "company-", "consumer-", "cross-", "customer-", "enterprise-", "industry-",
        "key-", "lock-", "network-", "object-", "pass-", "platform-", "purpose-",
        "role-", "network-", "services-", "structure-", "vendor-"];

    ident.adnouns = [
        ".net", "access", "access", "approver", "argument", "attribute",
        "authentication", "authorization", "bedrock", "burden",
        "business-to-business", "certificate", "conflict", "control", "credential",
        "customer", "data", "device", "difference", "directory", "disclosure",
        "discovery", "dispute", "distribution", "document", "ease-of-use",
        "employee", "enterprise", "entitlement", "firewall", "foaf", "governance",
        "hybrid", "id", "id-ff", "id-wsf", "identifier", "identity", "idm",
        "idp", "interface", "j2ee", "java", "lamp", "ldap", "level", "liability",
        "liberty", "messaging", "metadirectory", "migration", "object",
        "operating", "partner", "pki", "policy", "presence", "privacy",
        "productivity", "profile", "redirection", "relationship", "relying",
        "requestor", "rfid", "rights", "routing", "saml", "security", "service",
        "sign-on", "smpl", "soap", "sso", "storage", "third-party", "token",
        "trend", "uddi", "workflow", "ws-*", "wsdl", "xacml", "xml"];

    ident.adjectives = [
        "ambitious", "applicable", "architected", "attempted", "audited",
        "authenticated", "available", "basic", "best-of-breed", "broad", "brokered",
        "capability", "cashless", "combined", "compatible", "complete", "complex",
        "composable", "comprehensive", "conceptual", "concerned", "confident",
        "connective", "conputerized", "consistent", "critical", "damaged",
        "defensive", "delegated", "difficult", "digital", "disclosed",
        "distinguising", "dynamic", "early", "emergent", "emerging", "end-to-end",
        "enforced", "existing", "federated", "fiduciary", "focused", "folded",
        "fragile", "fragmented", "full-blown", "general", "general-purpose",
        "global", "hard", "hardened", "higher", "immediate", "implemented",
        "implicit", "increasing", "individual", "influential", "internal", "late",
        "legal", "legitimate", "liable", "limiting", "linked", "local", "long-term",
        "manageable", "managed", "many", "minimum", "natural", "necessary",
        "negative", "networked", "new", "newer", "offline", "older", "online",
        "overlapping", "partial", "performant", "physical", "planned", "political",
        "portable", "positive", "potential", "previous", "problematic", "procedural",
        "productive", "profound", "proprietary", "protected", "provided", "public",
        "redundant", "related", "relevant", "reliable", "remaining", "required",
        "robust", "scalable", "secret", "securable", "secure", "self-service",
        "several", "similar", "simplified", "single", "strategic", "tectonic",
        "transactional", "true", "trusted", "viable", "visible", "volatile",
        "well-integrated"];

    ident.adverbs = [
        "actually", "administratively", "architecturally", "commonly", "completely",
        "consistently", "eventually", "exclusionary", "fiduciarily", "independently",
        "inherently", "largely", "legislatively", "loosely", "naively", "partially",
        "procedurally", "progressively", "properly", "properly", "robustly",
        "secretly", "structually", "tightly"];

    module.exports = {
        genPhrase: function(options) {
            let numToGen = 1;
            let answer = [];

            if (options) {
                updateDefaultSettings(options);
                numToGen = _.get(options, 'numPhrases', 1);
            }

            for (let n = 0; n < numToGen; ++n) {
                init();
                let result = addPhrase();
                answer.push(chance.capitalize(result));
            }
            return answer;
        }
    };
}());
