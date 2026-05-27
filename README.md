# job-application-bot

A local Node.js tool that generates tailored resumes and cover letters for each job you're targeting, runs an ATS keyword-match scan, converts everything to PDF via LibreOffice, and produces a self-contained HTML summary with embedded download links — no server, no external hosting required.

---

## What it does

For each role you define:

1. Builds a **tailored resume** (DOCX + PDF) with a custom summary and three employer-specific bullets
2. Writes a **cover letter** (DOCX + PDF) following a Hook → Proof → Close structure
3. Runs an **ATS scan** against 10 role-specific keywords — flags anything below 90%
4. Outputs a **self-contained HTML file** you can open in any browser to review all roles, ATS scores, and download links in one place

---

## Requirements

- **Node.js** ≥ 18
- **LibreOffice** (headless) — for PDF conversion
  - macOS: `brew install --cask libreoffice`
  - Ubuntu/Debian: `sudo apt-get install libreoffice`
  - Without LibreOffice, DOCX files are still generated; PDF links won't appear in the HTML summary

---

## Setup

```bash
git clone https://github.com/YOUR_USERNAME/job-application-bot.git
cd job-application-bot
npm install
```

---

## Usage

### 1. Configure your personal info

Open `build.js` and fill in the `APPLICANT` object at the top:

```js
const APPLICANT = {
  name: 'Jane Smith',
  location: 'Los Angeles, CA',
  phone: '(555) 123-4567',
  email: 'jane@email.com',
  linkedin: 'linkedin.com/in/janesmith',
};
```

Also update the static work history, education, and skills sections inside `buildResume()` to match your background.

### 2. Add roles

Copy the template from `example/example_role.js` and paste it into the `ROLES[]` array in `build.js`. One object per job posting.

Key fields to customize per role:
- `summary` — tailored professional summary (weave in keywords)
- `b1`, `b2`, `b3` — three bullets for your most recent role
- `keywords` — 10 phrases pulled from the job description
- `coverBody` — three paragraphs: hook, proof, close

### 3. Run the build

```bash
node build.js
```

Output lands in `output/YYYY-MM-DD/`. Open the HTML summary file in that folder to see all roles with ATS scores and download links.

### 4. Iterate on ATS

If any role scores below 90%, check the "Missing" column in the HTML summary, weave those keywords naturally into the summary or bullets, and re-run until everything hits ≥90%.

---

## Output structure

```
output/
  2026-05-26/
    Acme-Sr-PM-Platform - Resume.docx
    Acme-Sr-PM-Platform - Resume.pdf
    Acme-Sr-PM-Platform - Cover Letter.docx
    Acme-Sr-PM-Platform - Cover Letter.pdf
    Job Summary - 2026-05-26.html   ← open this
```

---

## ATS scoring

The built-in scorer checks how many of your 10 target keywords appear in the combined text of `summary + b1 + b2 + b3`. It's a local keyword-match scan — fast, offline, and sufficient for most ATS pre-screens. Target ≥90% before applying.

---

## Tips

- Pull keywords directly from the job description — exact phrases, not paraphrases
- Keep bullets metric-first: lead with a number, follow with the keyword
- Cover letters: never open with "I'm applying for X because..." — lead with something specific about the company or the problem they're solving
- The HTML summary has a checkbox column — use it to track what you've applied to

---

## License

MIT
