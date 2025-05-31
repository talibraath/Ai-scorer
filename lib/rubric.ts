const rubric = {
  "Clarity": {
    Definition: "How easily readers understand the ideas without confusion or re-reading",
    Measures: [
      "Sentence structure accessibility",
      "Word choice precision",
      "Conceptual clarity",
      "Elimination of ambiguity"
    ],
    "Scoring Guidelines": {
      "9.0-10.0": "Complex ideas expressed with minimal reader effort",
      "8.0-8.9": "Generally clear with occasional dense passages",
      "6.0-7.9": "Understandable but requires focus; some unclear sections",
      "1.0-5.9": "Frequent confusion; requires multiple readings"
    }
  },
  "Structure & Flow": {
    Definition: "Logical sequencing and smooth transitions between ideas",
    Measures: [
      "Information architecture",
      "Paragraph organization",
      "Transition quality",
      "Overall coherence"
    ],
    "Scoring Guidelines": {
      "9.0-10.0": "Seamless logical progression; perfect transitions",
      "8.0-8.9": "Good structure with minor flow interruptions",
      "6.0-7.9": "Adequate organization; some abrupt shifts",
      "1.0-5.9": "Poor sequencing; confusing organization"
    }
  },
  "Style & Voice": {
    Definition: "Tone appropriateness, personality, and consistency",
    Measures: [
      "Voice distinctiveness",
      "Tone matching audience/purpose",
      "Consistency across document",
      "Avoidance of robotic phrasing"
    ],
    "Scoring Guidelines": {
      "9.0-10.0": "Distinctive, engaging voice perfectly matched to purpose",
      "8.0-8.9": "Strong voice with minor inconsistencies",
      "6.0-7.9": "Adequate tone; some bland or inconsistent sections",
      "1.0-5.9": "Robotic, inappropriate, or highly inconsistent voice"
    }
  },
  "Originality": {
    Definition: "Freshness of ideas, phrasing, and approach",
    Measures: [
      "Novel perspectives or insights",
      "Unique phrasing and expressions",
      "Avoidance of clichés and AI patterns",
      "Creative analogies or examples"
    ],
    "Scoring Guidelines": {
      "9.0-10.0": "Highly original ideas and distinctive expression",
      "8.0-8.9": "Generally fresh with some standard phrasing",
      "6.0-7.9": "Mix of original and conventional elements",
      "1.0-5.9": "Clichéd, generic, or obviously AI-generated"
    }
  },
  "Credibility": {
    Definition: "Factual accuracy, logical consistency, and trustworthiness",
    Measures: [
      "Claim supportability",
      "Logical reasoning",
      "Source reliability (when applicable)",
      "Internal consistency"
    ],
    "Scoring Guidelines": {
      "9.0-10.0": "Impeccable logic and verifiable claims",
      "8.0-8.9": "Generally credible with minor gaps",
      "6.0-7.9": "Mostly sound but some questionable elements",
      "1.0-5.9": "Poor logic, unsupported claims, or contradictions"
    }
  },
  "Emotional Resonance": {
    Definition: "Ability to engage readers emotionally and persuasively",
    Measures: [
      "Reader engagement level",
      "Persuasive power",
      "Emotional appropriateness to purpose",
      "Memorability"
    ],
    "Scoring Guidelines": {
      "9.0-10.0": "Compelling, moving, highly persuasive",
      "8.0-8.9": "Engaging with good emotional connection",
      "6.0-7.9": "Adequate engagement; somewhat compelling",
      "1.0-5.9": "Flat, unengaging, or emotionally inappropriate"
    }
  },
  "Relevance": {
    Definition: "Alignment with intended purpose, audience, and context",
    Measures: [
      "Purpose fulfillment",
      "Audience appropriateness",
      "Context sensitivity",
      "Goal achievement"
    ],
    "Scoring Guidelines": {
      "9.0-10.0": "Perfect alignment with all objectives",
      "8.0-8.9": "Strong relevance with minor drift",
      "6.0-7.9": "Generally on-target with some tangents",
      "1.0-5.9": "Poor alignment or significant irrelevance"
    }
  },
  "Readability": {
    Definition: "Scanning efficiency, formatting, and accessibility",
    Measures: [
      "Paragraph length variation",
      "Sentence rhythm and variety",
      "Visual formatting support",
      "Skimmability"
    ],
    "Scoring Guidelines": {
      "9.0-10.0": "Perfectly scannable and accessible",
      "8.0-8.9": "Easy to read with good formatting",
      "6.0-7.9": "Readable but could be more accessible",
      "1.0-5.9": "Dense, hard to scan, poor formatting"
    }
  },
  "Precision": {
    Definition: "Economy of language and elimination of unnecessary words",
    Measures: [
      "Word efficiency",
      "Elimination of redundancy",
      "Conciseness without losing meaning",
      "Removal of filler language"
    ],
    "Scoring Guidelines": {
      "9.0-10.0": "Every word earns its place; perfect economy",
      "8.0-8.9": "Generally concise with minor wordiness",
      "6.0-7.9": "Some redundancy or unnecessary elaboration",
      "1.0-5.9": "Verbose, repetitive, or filled with filler"
    }
  },
  "Improvement Trajectory": {
    Definition: "Measurable enhancement compared to previous version",
    Measures: [
      "Score improvements across categories",
      "Specific problem resolution",
      "Overall quality advancement",
      "Regression identification when applicable"
    ],
    "Scoring Guidelines": {
      "9.0-10.0": "Significant improvement across multiple categories",
      "8.0-8.9": "Clear improvement in several areas",
      "6.0-7.9": "Modest improvement or mixed results",
      "1.0-5.9": "No improvement, regression, or first draft (N/A)"
    },
    "Special Protocol": "Score each version independently, then compare. Require ≥0.3 average improvement across ≥2 categories to claim progress. Allow for regression scoring when quality decreases."
  }
};

export default rubric;
