SCHEMES = [
    {
        "name": "PM Kisan Samman Nidhi",
        "description_en": "Income support of Rs 6,000 per year for eligible farmer families.",
        "description_hi": "Yogya kisaan parivaron ke liye saal bhar mein Rs 6,000 ki aay sahayata.",
        "how_to_apply": "Apply through the PM-Kisan portal, CSC center, or local agriculture office with Aadhaar, bank details, and land records.",
        "min_age": 18,
        "max_age": 0,
        "monthly_income_limit": 16667,
        "gender": "any",
        "states": [],
        "occupations": ["farmer"],
    },
    {
        "name": "PM Awas Yojana (Gramin)",
        "description_en": "Housing support for rural families living in kutcha homes or without safe housing.",
        "description_hi": "Gaon mein kutcha ghar ya asurakshit aawas mein rehne wale parivaron ke liye aawas sahayata.",
        "how_to_apply": "Contact the gram panchayat or block office and verify inclusion in the rural housing beneficiary list.",
        "min_age": 18,
        "max_age": 0,
        "monthly_income_limit": 10000,
        "gender": "any",
        "states": [],
        "occupations": [],
    },
    {
        "name": "Ayushman Bharat PM-JAY",
        "description_en": "Health insurance coverage up to Rs 5 lakh per family for eligible low-income households.",
        "description_hi": "Yogya kam aay wale parivaron ke liye prati parivar Rs 5 lakh tak ka swasthya bima cover.",
        "how_to_apply": "Check eligibility at a PM-JAY kiosk or hospital help desk using Aadhaar or ration card details.",
        "min_age": 0,
        "max_age": 0,
        "monthly_income_limit": 21000,
        "gender": "any",
        "states": [],
        "occupations": [],
    },
    {
        "name": "Sukanya Samriddhi Yojana",
        "description_en": "Savings scheme for parents or guardians of a girl child below 10 years.",
        "description_hi": "10 saal se kam umr ki ladki ke mata-pita ya abhivavak ke liye bachat yojana.",
        "how_to_apply": "Open the account at a post office or participating bank with birth certificate and guardian KYC.",
        "min_age": 0,
        "max_age": 10,
        "monthly_income_limit": 0,
        "gender": "female",
        "states": [],
        "occupations": [],
    },
    {
        "name": "MGNREGA",
        "description_en": "Guaranteed wage employment for rural adults seeking work, up to 100 days per year.",
        "description_hi": "Kaam maangne wale grameen vayaskon ke liye saal mein 100 din tak ka rojgaar guarantee.",
        "how_to_apply": "Register at the gram panchayat for a job card and submit a work demand request.",
        "min_age": 18,
        "max_age": 0,
        "monthly_income_limit": 0,
        "gender": "any",
        "states": [],
        "occupations": ["unemployed", "labour", "unorganised"],
    },
    {
        "name": "Pradhan Mantri Ujjwala Yojana",
        "description_en": "Free LPG connection support for women from low-income households.",
        "description_hi": "Kam aay wale parivar ki mahilaon ke liye muft LPG connection sahayata.",
        "how_to_apply": "Visit the nearest LPG distributor or CSC with Aadhaar, ration card, and bank details.",
        "min_age": 18,
        "max_age": 0,
        "monthly_income_limit": 15000,
        "gender": "female",
        "states": [],
        "occupations": [],
    },
    {
        "name": "Beti Bachao Beti Padhao",
        "description_en": "Girl child support and awareness initiative with stronger focus in select states.",
        "description_hi": "Ladkiyon ki suraksha aur shiksha ko badhava dene wali yojana, kuch rajyon mein vishesh zor ke saath.",
        "how_to_apply": "Reach out to the district women and child development office or education department.",
        "min_age": 0,
        "max_age": 18,
        "monthly_income_limit": 0,
        "gender": "female",
        "states": ["Haryana", "Uttar Pradesh", "Uttarakhand", "Punjab", "Bihar", "Madhya Pradesh"],
        "occupations": [],
    },
    {
        "name": "PM MUDRA Yojana",
        "description_en": "Business loan support for small entrepreneurs under Shishu, Kishor, and Tarun categories.",
        "description_hi": "Chhote udyamiyon ke liye Shishu, Kishor aur Tarun shreniyon mein vyavsayik rin sahayata.",
        "how_to_apply": "Apply at a participating bank, NBFC, or microfinance institution with a simple business plan.",
        "min_age": 18,
        "max_age": 65,
        "monthly_income_limit": 0,
        "gender": "any",
        "states": [],
        "occupations": ["business", "self-employed", "entrepreneur"],
    },
    {
        "name": "National Scholarship Portal (NSP)",
        "description_en": "Scholarship support for eligible students from school through higher education.",
        "description_hi": "School se lekar higher education tak ke yogya vidyarthiyon ke liye scholarship sahayata.",
        "how_to_apply": "Submit the application online on the NSP portal with education and income documents.",
        "min_age": 5,
        "max_age": 30,
        "monthly_income_limit": 25000,
        "gender": "any",
        "states": [],
        "occupations": ["student"],
    },
    {
        "name": "Atal Pension Yojana",
        "description_en": "Pension scheme for workers aged 18 to 40, especially useful for unorganised sector workers.",
        "description_hi": "18 se 40 saal ke karmiyon ke liye pension yojana, khaaskar asangathit kshetra ke karmiyon ke liye upyogi.",
        "how_to_apply": "Enroll through a bank or post office savings account and choose a pension contribution plan.",
        "min_age": 18,
        "max_age": 40,
        "monthly_income_limit": 0,
        "gender": "any",
        "states": [],
        "occupations": ["unorganised", "labour", "farmer", "self-employed"],
    },
    {
        "name": "PM Jan Dhan Yojana",
        "description_en": "Basic zero-balance bank account with RuPay card and financial inclusion benefits.",
        "description_hi": "RuPay card aur vittiya samaveshan labhon ke saath basic zero-balance bank account.",
        "how_to_apply": "Open an account at a bank branch or camp with Aadhaar or another valid ID.",
        "min_age": 10,
        "max_age": 0,
        "monthly_income_limit": 0,
        "gender": "any",
        "states": [],
        "occupations": [],
    },
    {
        "name": "Indira Gandhi National Old Age Pension",
        "description_en": "Monthly pension support for senior citizens from low-income households.",
        "description_hi": "Kam aay wale vriddh nagrikon ke liye mahinewar pension sahayata.",
        "how_to_apply": "Apply through the local social welfare office, gram panchayat, or state pension portal.",
        "min_age": 60,
        "max_age": 0,
        "monthly_income_limit": 8000,
        "gender": "any",
        "states": [],
        "occupations": [],
    },
]


def _normalize(value):
    return str(value or "").strip().lower()


def _matches_gender(scheme_gender, user_gender):
    if scheme_gender == "any":
        return True
    return _normalize(scheme_gender) == _normalize(user_gender)


def _matches_states(allowed_states, user_state):
    if not allowed_states:
        return True
    return _normalize(user_state) in {_normalize(state) for state in allowed_states}


def _matches_occupation(allowed_occupations, user_occupation):
    if not allowed_occupations:
        return True
    normalized_user = _normalize(user_occupation)
    normalized_allowed = {_normalize(item) for item in allowed_occupations}
    return normalized_user in normalized_allowed


def _matches_income(limit, monthly_income):
    if not limit:
        return True
    return monthly_income <= limit


def _matches_age(min_age, max_age, age):
    if min_age and age < min_age:
        return False
    if max_age and age > max_age:
        return False
    return True


def _scheme_reason(scheme, profile, language):
    reasons = []
    if scheme["occupations"]:
        reasons.append(
            "occupation match"
            if language == "en"
            else "rojgaar ya pesha ka milan"
        )
    if scheme["gender"] != "any":
        reasons.append("gender fit" if language == "en" else "ling anukool")
    if scheme["states"]:
        reasons.append("state-specific benefit" if language == "en" else "rajya vishesh labh")
    if scheme["monthly_income_limit"]:
        reasons.append(
            "income within limit"
            if language == "en"
            else "aay seema ke andar"
        )
    if scheme["min_age"] or scheme["max_age"]:
        reasons.append("age eligible" if language == "en" else "umar ke hisaab se yogya")

    if not reasons:
        return (
            f"Matches the basic profile details shared by {profile.get('name', 'the applicant')}."
            if language == "en"
            else f"{profile.get('name', 'aavedak')} ke diye gaye mool profile vivaron se mel khata hai."
        )

    joined = ", ".join(reasons)
    return (
        f"Matched because of {joined}."
        if language == "en"
        else f"Yeh yojana isliye mili kyunki {joined}."
    )


def get_eligible_schemes(profile, language="en"):
    age = int(profile.get("age", 0) or 0)
    monthly_income = int(profile.get("monthly_income", 0) or 0)
    gender = profile.get("gender", "")
    state = profile.get("state", "")
    occupation = profile.get("occupation", "")

    eligible = []
    for scheme in SCHEMES:
        if not _matches_age(scheme["min_age"], scheme["max_age"], age):
            continue
        if not _matches_income(scheme["monthly_income_limit"], monthly_income):
            continue
        if not _matches_gender(scheme["gender"], gender):
            continue
        if not _matches_states(scheme["states"], state):
            continue
        if not _matches_occupation(scheme["occupations"], occupation):
            continue

        eligible.append(
            {
                "name": scheme["name"],
                "description": scheme["description_hi"]
                if language == "hi"
                else scheme["description_en"],
                "how_to_apply": scheme["how_to_apply"],
                "reason": _scheme_reason(scheme, profile, language),
            }
        )

    return {
        "eligible_schemes": eligible,
        "total_count": len(eligible),
        "summary": (
            f"Found {len(eligible)} matching schemes."
            if language == "en"
            else f"{len(eligible)} upyukt yojanaen mili."
        ),
    }
