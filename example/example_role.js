'use strict';
/**
 * example_role.js
 *
 * Copy this object into the ROLES[] array in build.js.
 * One object = one job posting = one tailored resume + cover letter + ATS scan.
 *
 * Tips:
 *  - slug: filename-safe string, no spaces. Used for output filenames.
 *  - keywords: pull 10 exact phrases from the job description.
 *              All 10 should appear naturally in summary + b1 + b2 + b3.
 *              Target ATS score ≥90% before applying.
 *  - coverBody: 3 paragraphs. Hook → Proof → Close.
 *               Never open with "I'm applying for X because..."
 */

module.exports = {
  slug: 'Acme-Sr-PM-Platform',        // used as output filename prefix
  company: 'Acme Corp',
  title: 'Senior Program Manager, Platform',
  salary: '$160K–$190K',
  location: 'Remote US',
  url: 'https://boards.greenhouse.io/acme/jobs/1234567',

  // ── Most Recent Role (top of resume Experience section) ──────────────────
  currentTitle: 'Senior Program Manager',
  currentDates: 'Mar 2024 – Present',
  currentCompany: 'Your Current Company  |  City, ST',

  // ── Tailored Professional Summary ────────────────────────────────────────
  // 3–4 sentences. Weave in the top keywords from the job description.
  summary:
    'Senior Program Manager with 8+ years driving cross-functional program delivery ' +
    'across platform engineering and operations. Proven track record of aligning ' +
    'stakeholder management across product, engineering, and business teams to ' +
    'accelerate roadmap execution while maintaining operational excellence. ' +
    'Experienced in risk mitigation, process improvement, and scaling programs ' +
    'from ideation through launch in high-velocity, data-driven environments.',

  // ── Three Tailored Bullets for Most Recent Role ───────────────────────────
  // Each bullet: one strong metric + one keyword from the list below.
  b1: 'Led cross-functional program delivery for a platform re-architecture spanning ' +
      '6 engineering pods and 3 product lines, reducing time-to-deploy by 35% through ' +
      'process improvement and automated release gates.',

  b2: 'Built and maintained stakeholder management cadence for C-suite and VP-level ' +
      'audiences, delivering biweekly program health dashboards that surfaced risk ' +
      'mitigation actions 3+ weeks ahead of escalation.',

  b3: 'Drove operational excellence across a $12M annual program portfolio, ' +
      'standardizing intake, prioritization, and OKR alignment processes that cut ' +
      'planning cycle time by 40%.',

  // ── ATS Keywords ─────────────────────────────────────────────────────────
  // 10 phrases — must appear in summary + b1 + b2 + b3 combined.
  // Run node build.js to see your ATS score. Iterate until ≥90%.
  keywords: [
    'cross-functional',
    'program delivery',
    'stakeholder management',
    'risk mitigation',
    'process improvement',
    'operational excellence',
    'data-driven',
    'roadmap',
    'OKR',
    'platform',
  ],

  // ── Cover Letter Body (3 paragraphs) ─────────────────────────────────────
  // Hook: Lead with something specific about the company or problem space.
  // Proof: One concrete accomplishment tied to their top need.
  // Close: Confident, no begging.
  coverBody: [
    'Acme\'s platform engineering work sits at the intersection of scale and ' +
    'simplicity — two things that rarely coexist without disciplined program ' +
    'management. That tension is exactly where I\'ve spent the last several years, ' +
    'and it\'s why this Senior Program Manager role caught my attention.',

    'At [Current Company], I led a platform re-architecture across six engineering ' +
    'pods that reduced deploy time by 35% and cut planning cycle overhead by nearly ' +
    'half — not by adding process, but by removing the friction buried inside it. ' +
    'I built the stakeholder rhythm that kept C-suite visibility clean and gave ' +
    'engineers space to execute. That\'s the kind of program environment I build ' +
    'wherever I land.',

    'I\'d welcome the chance to talk through how that experience maps to what ' +
    'Acme is building. I\'m confident the fit is strong.',
  ],
};
