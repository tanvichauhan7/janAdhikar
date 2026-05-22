import 'dotenv/config';
import process from 'node:process';
import express from 'express';
import {
  EMPTY_PROFILE,
  OCCUPATIONS,
  PROFILE_META,
  SCHEMES,
  STATES,
} from './src/appData.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const REQUIRED_FIELDS = PROFILE_META.map((meta) => meta.key);

const OCCUPATION_ALIASES = [
  ['Farmer', ['farmer', 'agriculture', 'farming']],
  ['Private Sector', ['private sector', 'private job', 'private employee', 'pvt', 'pvt job', 'corporate', 'company']],
  ['Government Employee', ['government employee', 'govt employee', 'govt job', 'government job', 'sarkari', 'naukri', 'sarkari naukri']],
  ['Self-Employed', ['self employed', 'self-employed', 'freelancer', 'shop owner', 'vendor', 'daily wage', 'daily wages', 'labour', 'labor', 'laborer']],
  ['Unemployed', ['unemployed', 'jobless', 'no job']],
  ['Student', ['student', 'studying', 'college', 'school']],
  ['Business', ['business', 'businessman', 'businesswoman', 'entrepreneur']],
];

app.use(express.json());

function normalizeProfile(profile = {}) {
  return {
    ...EMPTY_PROFILE,
    ...profile,
  };
}

function getMissingFields(profile) {
  return REQUIRED_FIELDS.filter((field) => !profile[field]);
}

function normalizeText(text = '') {
  return String(text).trim();
}

function normalizeComparable(value = '') {
  return value.toLowerCase().replace(/[^a-z]/g, '');
}

function normalizeNumericNoise(value = '') {
  return value.replace(/(\d)[oO](?=\b)/g, '$10');
}

function isSingleEditAway(left, right) {
  if (Math.abs(left.length - right.length) > 1) {
    return false;
  }

  let indexLeft = 0;
  let indexRight = 0;
  let differences = 0;

  while (indexLeft < left.length && indexRight < right.length) {
    if (left[indexLeft] === right[indexRight]) {
      indexLeft += 1;
      indexRight += 1;
      continue;
    }

    differences += 1;
    if (differences > 1) {
      return false;
    }

    if (left.length > right.length) {
      indexLeft += 1;
    } else if (right.length > left.length) {
      indexRight += 1;
    } else {
      indexLeft += 1;
      indexRight += 1;
    }
  }

  if (indexLeft < left.length || indexRight < right.length) {
    differences += 1;
  }

  return differences <= 1;
}

function toTitleCase(value) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function createCandidate(value, confidence) {
  return value === null || value === undefined || value === ''
    ? null
    : { value, confidence };
}

const STATE_LOOKUP = new Map(
  STATES.map((state) => [normalizeComparable(state), state]),
);

const RESERVED_NAME_TOKENS = new Set([
  'age',
  'bihar',
  'male',
  'female',
  'student',
  'farmer',
  'private',
  'sector',
  'government',
  'employee',
  'govt',
  'sarkari',
  'naukri',
  'income',
  'salary',
  'occupation',
  'state',
  'name',
  'from',
  'mahila',
  'ladki',
  'ladka',
  'self',
  'employed',
  'business',
  'job',
  'lakh',
  'lakhs',
  'lac',
  'lacs',
  'yr',
  'years',
  'rs',
  'rupees',
  'im',
  'am',
  'please',
  'help',
  'need',
  'support',
  'me',
  'my',
  'mujhe',
  'mera',
  'meri',
  'main',
  'mai',
  'ka',
  'ki',
  'kaise',
  'chahiye',
  'batao',
  'ration',
  'card',
]);

function findStateFromValue(value) {
  if (!value) {
    return null;
  }

  return STATE_LOOKUP.get(normalizeComparable(value)) ?? null;
}

function parseIncome(text) {
  const normalized = normalizeNumericNoise(text)
    .toLowerCase()
    .replace(/,/g, '')
    .replace(/\s+/g, ' ');

  const lakhMatch = normalized.match(/(?:₹|rs\.?|rupees?)?\s*(\d+(?:\.\d+)?)\s*(?:l|lkh|lac|lacs|lakh|lakhs)\b/i);
  if (lakhMatch) {
    return createCandidate(Math.round(Number.parseFloat(lakhMatch[1]) * 100000), 0.93);
  }

  const thousandMatch = normalized.match(/(?:₹|rs\.?|rupees?)?\s*(\d+(?:\.\d+)?)\s*(?:k|thousand)\b/i);
  if (thousandMatch) {
    return createCandidate(Math.round(Number.parseFloat(thousandMatch[1]) * 1000), 0.9);
  }

  const labelledMatch = normalized.match(
    /(?:income|salary|earning|earnings|earn|annual income)\s*[:=~-]?\s*₹?\s*([\d,]{5,9})\b/i,
  );
  if (labelledMatch) {
    return createCandidate(Number.parseInt(labelledMatch[1].replace(/,/g, ''), 10), 0.94);
  }

  const rupeeMatch = normalized.match(/(?:₹|rs\.?|rupees?)\s*([\d,]{5,9})\b/i);
  if (rupeeMatch) {
    return createCandidate(Number.parseInt(rupeeMatch[1].replace(/,/g, ''), 10), 0.9);
  }

  const plainNumberMatch = normalized.match(/\b(\d{5,7})\b/);
  if (plainNumberMatch) {
    return createCandidate(Number.parseInt(plainNumberMatch[1], 10), 0.74);
  }

  return null;
}

function parseName(text, currentProfile) {
  const patterns = [
    /(?:my name is|name is|myself|this is)\s+([a-z]+(?:\s+[a-z]+){0,2})/i,
    /(?:i am|i'm)\s+([a-z]+(?:\s+[a-z]+){0,2})(?=\s*(?:,|from|age|male|female|student|farmer|private|government|govt|income|salary|occupation|$))/i,
    /^\s*([a-z]+(?:\s+[a-z]+){0,2})(?=\s+(?:\d{1,2}[mf]?\b|male\w*\b|female\w*\b|from\b|student\b|farmer\b|private\b|government\b|govt\b|income\b|salary\b|occupation\b))/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) {
      continue;
    }

    const candidate = match[1].trim();
    if (!/[a-z]/i.test(candidate) || /\d/.test(candidate)) {
      continue;
    }

    const normalizedCandidate = candidate.toLowerCase();
    if (
      normalizedCandidate === 'male' ||
      normalizedCandidate === 'female' ||
      normalizedCandidate === 'student'
    ) {
      continue;
    }

    return createCandidate(toTitleCase(candidate), 0.94);
  }

  const normalized = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) {
    return null;
  }

  const tokens = normalized.split(' ');
  const fullNameCandidate = tokens.join(' ');
  const allTokensValid = tokens.every(
    (token) =>
      token.length >= 2 &&
      !STATE_LOOKUP.has(normalizeComparable(token)) &&
      !RESERVED_NAME_TOKENS.has(token),
  );

  if (allTokensValid && tokens.length <= 3) {
    return createCandidate(toTitleCase(fullNameCandidate), 0.88);
  }

  if (currentProfile?.name) {
    return null;
  }

  const [firstToken, secondToken = ''] = tokens;
  const secondTokenLooksStructured =
    !secondToken ||
    /^\d{1,2}[mf]?$/.test(secondToken) ||
    /\d/.test(secondToken) ||
    STATE_LOOKUP.has(normalizeComparable(secondToken)) ||
    RESERVED_NAME_TOKENS.has(secondToken);

  if (
    firstToken &&
    firstToken.length >= 2 &&
    secondTokenLooksStructured &&
    !STATE_LOOKUP.has(normalizeComparable(firstToken)) &&
    !RESERVED_NAME_TOKENS.has(firstToken)
  ) {
    return createCandidate(toTitleCase(firstToken), 0.68);
  }

  return null;
}

function parseAge(text) {
  const sanitizedText = normalizeNumericNoise(text);
  const targetedMatch = sanitizedText.match(/(?:age(?:\s+is)?|aged)\s*[:=]?\s*(\d{1,2})(?!\d)/i);
  if (targetedMatch) {
    return createCandidate(Number.parseInt(targetedMatch[1], 10), 0.96);
  }

  const shorthandMatch = sanitizedText.match(/\b(\d{1,2})\s*([mf])\b/i);
  if (shorthandMatch) {
    return createCandidate(Number.parseInt(shorthandMatch[1], 10), 0.95);
  }

  const contextualMatch = sanitizedText.match(
    /\b(\d{1,2})\b(?=\s*,?\s*(?:from|male|female|student|farmer|private|government|govt|self-employed|self employed|unemployed|business|mahila|ladki|ladka)\b)/i,
  );
  if (contextualMatch) {
    return createCandidate(Number.parseInt(contextualMatch[1], 10), 0.82);
  }

  const numberOnlyMatch = sanitizedText.trim().match(/^(\d{1,2})$/);
  if (numberOnlyMatch) {
    return createCandidate(Number.parseInt(numberOnlyMatch[1], 10), 0.88);
  }

  const yearsMatch = sanitizedText.match(/(\d{1,2})\s*(?:years?|yrs?)/i);
  if (yearsMatch) {
    return createCandidate(Number.parseInt(yearsMatch[1], 10), 0.9);
  }

  return null;
}

function parseGender(text) {
  const normalized = text.toLowerCase();

  if (/\b(\d{1,2}\s*f|f|female\w*|woman|girl|she|her|ladki|mahila)\b/.test(normalized)) {
    return createCandidate('Female', 0.95);
  }

  if (/\b(\d{1,2}\s*m|m|male\w*|man|boy|he|him|ladka)\b/.test(normalized)) {
    return createCandidate('Male', 0.95);
  }

  return null;
}

function parseState(text) {
  const normalized = normalizeComparable(text);
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => normalizeComparable(token));

  for (const state of STATES) {
    const comparableState = normalizeComparable(state);
    if (normalized.includes(comparableState)) {
      return createCandidate(state, 0.92);
    }

    if (tokens.some((token) => token && isSingleEditAway(token, comparableState))) {
      return createCandidate(state, 0.72);
    }
  }

  return null;
}

function parseOccupation(text) {
  const normalized = text.toLowerCase();

  for (const [occupation, aliases] of OCCUPATION_ALIASES) {
    if (aliases.some((alias) => normalized.includes(alias))) {
      return createCandidate(occupation, 0.9);
    }
  }

  return null;
}

function heuristicExtractProfile(text, currentProfile) {
  const updatedProfile = normalizeProfile(currentProfile);
  const confidence = {};
  const cleanText = normalizeText(text);

  const candidateValues = {
    name: parseName(cleanText, updatedProfile),
    age: parseAge(cleanText),
    gender: parseGender(cleanText),
    state: parseState(cleanText),
    income: parseIncome(cleanText),
    occupation: parseOccupation(cleanText),
  };

  for (const field of REQUIRED_FIELDS) {
    const candidate = candidateValues[field];
    const nextValue = candidate?.value;
    if (nextValue === null || nextValue === undefined || nextValue === '') {
      continue;
    }

    if (field === 'age' && (nextValue < 1 || nextValue > 120)) {
      continue;
    }

    if (field === 'state') {
      const detectedState = findStateFromValue(nextValue);
      if (!detectedState) {
        continue;
      }

      updatedProfile.state = detectedState;
      confidence[field] = candidate.confidence;
      continue;
    }

    updatedProfile[field] = nextValue;
    confidence[field] = candidate.confidence;
  }

  return {
    updatedProfile,
    missingFields: getMissingFields(updatedProfile),
    confidence,
    source: 'heuristic',
  };
}

function sanitizeLlmProfile(rawProfile, currentProfile) {
  const mergedProfile = normalizeProfile(currentProfile);
  const confidence = {};

  if (!rawProfile || typeof rawProfile !== 'object') {
    return {
      updatedProfile: mergedProfile,
      missingFields: getMissingFields(mergedProfile),
      confidence,
      source: 'heuristic',
    };
  }

  for (const field of REQUIRED_FIELDS) {
    const value = rawProfile[field];
    if (value === null || value === undefined || value === '') {
      continue;
    }

    if (field === 'name') {
      mergedProfile.name = toTitleCase(String(value));
    } else if (field === 'age') {
      const age = Number.parseInt(value, 10);
      if (age >= 1 && age <= 120) {
        mergedProfile.age = age;
      }
    } else if (field === 'gender') {
      const normalizedGender = String(value).toLowerCase();
      if (normalizedGender === 'male' || normalizedGender === 'female') {
        mergedProfile.gender = normalizedGender === 'male' ? 'Male' : 'Female';
      }
    } else if (field === 'state') {
      const detectedState = STATES.find(
        (state) => state.toLowerCase() === String(value).toLowerCase(),
      );
      if (detectedState) {
        mergedProfile.state = detectedState;
      }
    } else if (field === 'income') {
      const income = Number.parseInt(value, 10);
      if (!Number.isNaN(income) && income > 0) {
        mergedProfile.income = income;
      }
    } else if (field === 'occupation') {
      const detectedOccupation = OCCUPATIONS.find(
        (occupation) => occupation.toLowerCase() === String(value).toLowerCase(),
      );
      if (detectedOccupation) {
        mergedProfile.occupation = detectedOccupation;
      }
    }

    if (mergedProfile[field]) {
      confidence[field] = 0.92;
    }
  }

  return {
    updatedProfile: mergedProfile,
    missingFields: getMissingFields(mergedProfile),
    confidence,
    source: 'llm',
  };
}

async function llmExtractProfile(text, currentProfile) {
  if (!OPENAI_API_KEY) {
    return null;
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'Extract a user profile from a government scheme eligibility chat. Return only valid JSON with keys: name, age, gender, state, income, occupation. Use null for unknown values. Allowed gender values: Male, Female. Allowed occupation values: Private Sector, Government Employee, Farmer, Self-Employed, Unemployed, Student, Business.',
        },
        {
          role: 'user',
          content: JSON.stringify({ text, currentProfile }),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM request failed with status ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('LLM returned an empty response');
  }

  return sanitizeLlmProfile(JSON.parse(content), currentProfile);
}

function formatCurrency(value) {
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

function evaluateScheme(scheme, profile) {
  const reasons = [];
  const blockers = [];

  if (scheme.minAge !== null && scheme.minAge !== undefined) {
    if (!profile.age) {
      blockers.push('Age is missing');
    } else if (profile.age < scheme.minAge) {
      blockers.push(`Minimum age is ${scheme.minAge}`);
    } else {
      reasons.push(`Age is at least ${scheme.minAge}`);
    }
  }

  if (scheme.maxAge !== null && scheme.maxAge !== undefined) {
    if (!profile.age) {
      blockers.push('Age is missing');
    } else if (profile.age > scheme.maxAge) {
      blockers.push(`Maximum age is ${scheme.maxAge}`);
    } else {
      reasons.push(`Age is within the upper limit of ${scheme.maxAge}`);
    }
  }

  if (scheme.maxIncome !== null && scheme.maxIncome !== undefined) {
    if (!profile.income) {
      blockers.push('Income is missing');
    } else if (profile.income > scheme.maxIncome) {
      blockers.push(`Income must be at or below ${formatCurrency(scheme.maxIncome)}`);
    } else {
      reasons.push(`Income is within the limit of ${formatCurrency(scheme.maxIncome)}`);
    }
  }

  if (scheme.occupation) {
    if (!profile.occupation) {
      blockers.push('Occupation is missing');
    } else if (profile.occupation !== scheme.occupation) {
      blockers.push(`Reserved for ${scheme.occupation.toLowerCase()}`);
    } else {
      reasons.push(`Occupation matches ${scheme.occupation.toLowerCase()}`);
    }
  }

  if (scheme.gender) {
    if (!profile.gender) {
      blockers.push('Gender is missing');
    } else if (profile.gender !== scheme.gender) {
      blockers.push(`Available for ${scheme.gender.toLowerCase()} applicants`);
    } else {
      reasons.push(`Gender matches the requirement`);
    }
  }

  if (Array.isArray(scheme.states) && scheme.states.length > 0) {
    if (!profile.state) {
      blockers.push('State is missing');
    } else if (!scheme.states.includes(profile.state)) {
      blockers.push(`Available only in ${scheme.states.join(', ')}`);
    } else {
      reasons.push(`State matches ${scheme.states.join(', ')}`);
    }
  }

  return {
    eligible: blockers.length === 0,
    reasons,
    blockers,
  };
}

function buildReasoningSummary(profile, eligibleSchemes) {
  if (eligibleSchemes.length === 0) {
    return `No direct scheme match found yet for ${profile.name || 'this profile'}. You can try updating income, occupation, or state details for a better match.`;
  }

  return `${profile.name || 'This user'} matches ${eligibleSchemes.length} scheme${eligibleSchemes.length === 1 ? '' : 's'} based on age, income, occupation, gender, and state rules.`;
}

app.post('/api/extract-profile', async (req, res) => {
  const text = normalizeText(req.body?.text);
  const currentProfile = normalizeProfile(req.body?.currentProfile);

  if (!text) {
    return res.status(400).json({
      updatedProfile: currentProfile,
      missingFields: getMissingFields(currentProfile),
      confidence: {},
      source: 'validation',
    });
  }

  try {
    let result = null;

    if (OPENAI_API_KEY) {
      try {
        result = await llmExtractProfile(text, currentProfile);
      } catch (llmError) {
        console.warn('LLM extraction failed, using heuristic fallback:', llmError.message);
      }
    }

    if (!result) {
      result = heuristicExtractProfile(text, currentProfile);
    }

    return res.json(result);
  } catch (error) {
    console.error('Profile extraction failed:', error);
    return res.json({
      updatedProfile: currentProfile,
      missingFields: getMissingFields(currentProfile),
      confidence: {},
      source: 'fallback',
    });
  }
});

app.post('/api/recommend-schemes', (req, res) => {
  const profile = normalizeProfile(req.body?.profile);

  const evaluated = SCHEMES.map((scheme) => {
    const evaluation = evaluateScheme(scheme, profile);

    return {
      ...scheme,
      reasoning: evaluation.eligible ? evaluation.reasons.join('. ') : evaluation.blockers.join('. '),
      eligible: evaluation.eligible,
    };
  });

  const eligible = evaluated.filter((scheme) => scheme.eligible);
  const ineligible = evaluated.filter((scheme) => !scheme.eligible);

  return res.json({
    eligible,
    ineligible,
    reasoningSummary: buildReasoningSummary(profile, eligible),
  });
});

app.listen(PORT, () => {
  console.log(`Jan Adhikar API running on http://localhost:${PORT}`);
});
