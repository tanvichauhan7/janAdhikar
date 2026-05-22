export const STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
];

export const OCCUPATIONS = [
  'Private Sector',
  'Government Employee',
  'Farmer',
  'Self-Employed',
  'Unemployed',
  'Student',
  'Business',
];

export const SCHEMES = [
  {
    name: 'PM-Kisan Samman Nidhi',
    desc: '₹6,000/year for farmer families',
    minAge: 18,
    maxAge: null,
    maxIncome: 200000,
    occupation: 'Farmer',
    gender: null,
    states: null,
    details:
      'Benefit: Financial assistance of ₹6,000 per year in three installments.\nEligibility: Small and marginal farmer families.\nUseful documents: Aadhaar, land records, and bank account details.',
  },
  {
    name: 'Ayushman Bharat',
    desc: '₹5 lakh health coverage per family',
    minAge: null,
    maxAge: null,
    maxIncome: 250000,
    occupation: null,
    gender: null,
    states: null,
    details:
      'Benefit: Up to ₹5 lakh annual health insurance coverage per family.\nEligibility: Low-income and vulnerable families.\nUseful documents: Aadhaar, ration card, and family identification proof.',
  },
  {
    name: 'PM Awas Yojana',
    desc: 'Home loan interest subsidy',
    minAge: 18,
    maxAge: null,
    maxIncome: 300000,
    occupation: null,
    gender: null,
    states: null,
    details:
      'Benefit: Subsidy on home loan interest for affordable housing.\nEligibility: Families without a pucca house and within the income limits.\nUseful documents: Aadhaar, income proof, address proof, and property documents.',
  },
  {
    name: 'Ujjwala Yojana',
    desc: 'Free LPG connection to women',
    minAge: 18,
    maxAge: null,
    maxIncome: 180000,
    occupation: null,
    gender: 'Female',
    states: null,
    details:
      'Benefit: Free LPG connection support for eligible households.\nEligibility: Women from low-income households.\nUseful documents: Aadhaar, ration card, and bank account details.',
  },
  {
    name: 'Mukhyamantri Kanya Utthan Yojana',
    desc: 'Education support for eligible female students in Bihar',
    minAge: 17,
    maxAge: 25,
    maxIncome: 400000,
    occupation: 'Student',
    gender: 'Female',
    states: ['Bihar'],
    details:
      'Benefit: Financial support for higher education and empowerment of girl students.\nEligibility: Female students from Bihar within the age and income range.\nUseful documents: Aadhaar, domicile certificate, bank account, and education records.',
  },
  {
    name: 'PM Jan Dhan Yojana',
    desc: 'Zero-balance bank account + insurance',
    minAge: 18,
    maxAge: null,
    maxIncome: 150000,
    occupation: null,
    gender: null,
    states: null,
    details:
      'Benefit: Zero-balance bank account with insurance and basic banking access.\nEligibility: Any unbanked Indian citizen meeting the account opening rules.\nUseful documents: Aadhaar or other officially valid ID and address proof.',
  },
];

export const QUICK_REPLIES = {
  name: ['Rahul Kumar', 'Priya Singh', 'Amit Sharma'],
  age: ['25 years', '35 years', '45 years', '55 years'],
  gender: ['Male', 'Female'],
  state: ['Uttar Pradesh', 'Maharashtra', 'West Bengal', 'Bihar', 'Rajasthan'],
  income: ['₹1 lakh', '₹2 lakh', '₹3 lakh', '1.5 lakh'],
  occupation: ['Farmer', 'Private Sector', 'Self-Employed', 'Unemployed', 'Student'],
};

export const PROFILE_META = [
  { key: 'name', label: 'Name', icon: '👤' },
  { key: 'age', label: 'Age', icon: '🎂' },
  { key: 'gender', label: 'Gender', icon: '♾' },
  { key: 'state', label: 'State', icon: '📍' },
  { key: 'income', label: 'Annual income', icon: '₹' },
  { key: 'occupation', label: 'Occupation', icon: '💼' },
];

export const EMPTY_PROFILE = {
  name: null,
  age: null,
  gender: null,
  state: null,
  income: null,
  occupation: null,
};
