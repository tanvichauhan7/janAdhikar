const COPY = {
  en: {
    title: 'Check welfare scheme eligibility',
    body: 'Enter the applicant details below. Monthly income should be in rupees.',
    name: 'Name',
    age: 'Age',
    gender: 'Gender',
    state: 'State',
    occupation: 'Occupation',
    income: 'Monthly income (Rs)',
    submit: 'Find schemes',
    female: 'Female',
    male: 'Male',
    other: 'Other',
  },
  hi: {
    title: 'Yojana eligibility check karein',
    body: 'Neeche applicant ki details bhariye. Monthly income rupaye mein bhariye.',
    name: 'Naam',
    age: 'Umr',
    gender: 'Ling',
    state: 'Rajya',
    occupation: 'Pesha',
    income: 'Mahina ki aay (Rs)',
    submit: 'Yojana dhoondhiye',
    female: 'Mahila',
    male: 'Purush',
    other: 'Anya',
  },
};

function updateValue(setFormData, key, value) {
  setFormData((prev) => ({ ...prev, [key]: value }));
}

export default function EligibilityForm({
  formData,
  setFormData,
  language,
  states,
  occupations,
  onSubmit,
}) {
  const copy = COPY[language];

  return (
    <section className="form-panel">
      <div className="panel-intro">
        <span className="eyebrow">{copy.title}</span>
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
      </div>

      <form className="eligibility-form" onSubmit={onSubmit}>
        <label>
          <span>{copy.name}</span>
          <input
            type="text"
            value={formData.name}
            onChange={(event) => updateValue(setFormData, 'name', event.target.value)}
            placeholder={language === 'hi' ? 'Jaise Rekha Devi' : 'For example, Rekha Devi'}
            required
          />
        </label>

        <div className="two-col">
          <label>
            <span>{copy.age}</span>
            <input
              type="number"
              min="0"
              max="120"
              value={formData.age}
              onChange={(event) => updateValue(setFormData, 'age', event.target.value)}
              required
            />
          </label>

          <label>
            <span>{copy.gender}</span>
            <select
              value={formData.gender}
              onChange={(event) => updateValue(setFormData, 'gender', event.target.value)}
            >
              <option value="female">{copy.female}</option>
              <option value="male">{copy.male}</option>
              <option value="other">{copy.other}</option>
            </select>
          </label>
        </div>

        <label>
          <span>{copy.state}</span>
          <select
            value={formData.state}
            onChange={(event) => updateValue(setFormData, 'state', event.target.value)}
          >
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>{copy.occupation}</span>
          <select
            value={formData.occupation}
            onChange={(event) => updateValue(setFormData, 'occupation', event.target.value)}
          >
            {occupations.map((occupation) => (
              <option key={occupation} value={occupation}>
                {occupation}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>{copy.income}</span>
          <input
            type="number"
            min="0"
            step="100"
            value={formData.monthly_income}
            onChange={(event) => updateValue(setFormData, 'monthly_income', event.target.value)}
            placeholder="9000"
            required
          />
        </label>

        <button type="submit" className="submit-btn">
          {copy.submit}
        </button>
      </form>
    </section>
  );
}
