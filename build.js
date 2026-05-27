'use strict';
/**
 * job-application-bot / build.js
 *
 * Generates tailored resumes and cover letters for each role defined in ROLES[],
 * runs a lightweight ATS keyword-match scan, converts to PDF via LibreOffice,
 * and produces a self-contained HTML summary with all PDFs embedded as base64
 * download links — no external hosting required.
 *
 * Dependencies: docx, libreoffice (headless)
 *   npm install docx
 *
 * Usage:
 *   node build.js
 *
 * Output folder is set via OUT_DIR below.
 */

const { Document, Packer, Paragraph, TextRun, AlignmentType, LevelFormat } = require('docx');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const APPLICANT = {
  name: 'YOUR NAME',
  location: 'Your City, ST',
  phone: '(555) 000-0000',
  email: 'you@email.com',
  linkedin: 'linkedin.com/in/yourhandle',
};

const OUT_DIR = path.join(__dirname, 'output', new Date().toISOString().slice(0, 10));

// ─── ROLE DATA ────────────────────────────────────────────────────────────────
// Each role gets its own tailored summary, 3 employer bullets, 10 ATS keywords,
// and a 3-paragraph cover letter body. See example/example_role.js for a template.
const ROLES = [
  // Paste role objects here — see example/example_role.js
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function divider() {
  return new Paragraph({
    spacing: { after: 60, before: 60 },
    border: { bottom: { style: 'single', size: 6, color: '333333' } },
    children: [],
  });
}

function sectionHeader(text) {
  return new Paragraph({
    spacing: { after: 40, before: 20 },
    children: [new TextRun({ text, bold: true, size: 22, font: 'Arial', allCaps: true })],
  });
}

function jobLine(title, dates) {
  return new Paragraph({
    spacing: { after: 0, before: 20 },
    children: [
      new TextRun({ text: title, bold: true, size: 20, font: 'Arial' }),
      new TextRun({ text: `  |  ${dates}`, size: 20, font: 'Arial', italics: true }),
    ],
  });
}

function companyLine(text) {
  return new Paragraph({
    spacing: { after: 20 },
    children: [new TextRun({ text, size: 20, font: 'Arial', italics: true })],
  });
}

function bullet(text, ref) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 20 },
    children: [new TextRun({ text, size: 20, font: 'Arial' })],
  });
}

function para(text) {
  return new Paragraph({
    spacing: { after: 100 },
    children: [new TextRun({ text, size: 20, font: 'Arial' })],
  });
}

// ─── RESUME BUILDER ───────────────────────────────────────────────────────────
function buildResume(role) {
  const numbering = {
    config: [{
      reference: 'bullets',
      levels: [{
        level: 0,
        format: LevelFormat.BULLET,
        text: '•',
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 360, hanging: 180 } } },
      }],
    }],
  };

  const contact = `${APPLICANT.location}  •  ${APPLICANT.phone}  •  ${APPLICANT.email}  •  ${APPLICANT.linkedin}`;

  const children = [
    // Header
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40, before: 0 },
      children: [new TextRun({ text: APPLICANT.name, bold: true, size: 32, font: 'Arial' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60, before: 0 },
      children: [new TextRun({ text: contact, size: 20, font: 'Arial' })],
    }),

    // Summary
    divider(),
    sectionHeader('Professional Summary'),
    para(role.summary),

    // Experience
    divider(),
    sectionHeader('Professional Experience'),

    // Most Recent Role (tailored bullets)
    jobLine(role.currentTitle, role.currentDates),
    companyLine(role.currentCompany),
    bullet(role.b1, 'bullets'),
    bullet(role.b2, 'bullets'),
    bullet(role.b3, 'bullets'),

    // Prior roles — edit/extend as needed
    jobLine('Program Manager', 'Jul 2023 – Feb 2024'),
    companyLine('Prior Employer  |  City, ST'),
    bullet('Add a tailored bullet for this role.', 'bullets'),
    bullet('Add a tailored bullet for this role.', 'bullets'),

    jobLine('Program Manager', 'Oct 2019 – Jul 2023'),
    companyLine('Prior Employer  |  City, ST'),
    bullet('Add a tailored bullet for this role.', 'bullets'),
    bullet('Add a tailored bullet for this role.', 'bullets'),

    // Education
    divider(),
    sectionHeader('Education'),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: 'University Name', bold: true, size: 20, font: 'Arial' }),
        new TextRun({ text: '  –  City, ST   |   Degree   |   Graduated Month Year', size: 20, font: 'Arial' }),
      ],
    }),

    // Skills & Certs
    divider(),
    sectionHeader('Technical Skills & Certifications'),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: 'Program & Operations:  ', bold: true, size: 20, font: 'Arial' }),
        new TextRun({ text: 'Program Execution, Cross-Functional Coordination, Stakeholder Management, Risk Mitigation, Process Improvement, Operational Excellence, Change Management', size: 20, font: 'Arial' }),
      ],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: 'Tools:  ', bold: true, size: 20, font: 'Arial' }),
        new TextRun({ text: 'Jira, Confluence, Smartsheet, Excel, Power BI, Tableau, Google Workspace', size: 20, font: 'Arial' }),
      ],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: 'Certifications:  ', bold: true, size: 20, font: 'Arial' }),
        new TextRun({ text: 'PMP  |  Lean Six Sigma Green Belt', size: 20, font: 'Arial' }),
      ],
    }),
  ];

  return new Document({
    numbering,
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
        },
      },
      children,
    }],
  });
}

// ─── COVER LETTER BUILDER ─────────────────────────────────────────────────────
function buildCoverLetter(role) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const contact = `${APPLICANT.location}  •  ${APPLICANT.phone}  •  ${APPLICANT.email}  •  ${APPLICANT.linkedin}`;

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40, before: 0 },
      children: [new TextRun({ text: APPLICANT.name, bold: true, size: 32, font: 'Arial' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60, before: 0 },
      children: [new TextRun({ text: contact, size: 20, font: 'Arial' })],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: today, size: 20, font: 'Arial' })],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: `Dear Hiring Team at ${role.company},`, size: 20, font: 'Arial' })],
    }),
    ...role.coverBody.map(p => para(p)),
    new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: 'Sincerely,', size: 20, font: 'Arial' })],
    }),
    new Paragraph({
      spacing: { after: 0 },
      children: [new TextRun({ text: APPLICANT.name.split(' ')[0] + ' ' + APPLICANT.name.split(' ').slice(-1)[0], size: 20, font: 'Arial' })],
    }),
  ];

  return new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children,
    }],
  });
}

// ─── ATS SCORER ───────────────────────────────────────────────────────────────
// Checks how many of the role's target keywords appear in the tailored content.
// Target: 90%+ before finalizing. If below, revise the summary/bullets.
function calcATS(role) {
  const fullText = [role.summary, role.b1, role.b2, role.b3].join(' ').toLowerCase();
  const matched = role.keywords.filter(kw => fullText.includes(kw.toLowerCase()));
  const missing = role.keywords.filter(kw => !fullText.includes(kw.toLowerCase()));
  return {
    score: Math.round((matched.length / role.keywords.length) * 100),
    matched,
    missing,
  };
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  if (ROLES.length === 0) {
    console.log('No roles defined. Add role objects to the ROLES array (see example/example_role.js).');
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const results = [];

  for (const role of ROLES) {
    console.log(`\nBuilding: ${role.slug}`);

    const resumeDoc = buildResume(role);
    const clDoc = buildCoverLetter(role);
    const resumeDocxPath = path.join(OUT_DIR, `${role.slug} - Resume.docx`);
    const clDocxPath = path.join(OUT_DIR, `${role.slug} - Cover Letter.docx`);
    const resumePdfPath = path.join(OUT_DIR, `${role.slug} - Resume.pdf`);
    const clPdfPath = path.join(OUT_DIR, `${role.slug} - Cover Letter.pdf`);

    const [rBuf, cBuf] = await Promise.all([
      Packer.toBuffer(resumeDoc),
      Packer.toBuffer(clDoc),
    ]);
    fs.writeFileSync(resumeDocxPath, rBuf);
    fs.writeFileSync(clDocxPath, cBuf);

    try {
      execSync(`libreoffice --headless --convert-to pdf "${resumeDocxPath}" --outdir "${OUT_DIR}"`, { stdio: 'inherit' });
      execSync(`libreoffice --headless --convert-to pdf "${clDocxPath}" --outdir "${OUT_DIR}"`, { stdio: 'inherit' });
      console.log('  PDFs created.');
    } catch (e) {
      console.log(`  PDF warning (LibreOffice not found): ${e.message}`);
    }

    const ats = calcATS(role);
    const resumePdfB64 = fs.existsSync(resumePdfPath)
      ? `data:application/pdf;base64,${fs.readFileSync(resumePdfPath).toString('base64')}`
      : null;
    const clPdfB64 = fs.existsSync(clPdfPath)
      ? `data:application/pdf;base64,${fs.readFileSync(clPdfPath).toString('base64')}`
      : null;

    results.push({ role, ats, resumePdfB64, clPdfB64 });

    const flag = ats.score < 90 ? ' ← ITERATE BEFORE APPLYING' : '';
    console.log(`  ATS: ${ats.score}%${flag}`);
    if (ats.missing.length) console.log(`  Missing keywords: ${ats.missing.join(', ')}`);
  }

  // ─── HTML SUMMARY ───────────────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10);
  const htmlPath = path.join(OUT_DIR, `Job Summary - ${today}.html`);

  const rows = results.map(r => `
    <tr>
      <td>⬜</td>
      <td><a href="${r.role.url}" target="_blank">${r.role.company}</a></td>
      <td>${r.role.title}</td>
      <td>${r.role.location}</td>
      <td>${r.role.salary}</td>
      <td class="ats ${r.ats.score >= 90 ? 'green' : r.ats.score >= 75 ? 'yellow' : 'red'}">${r.ats.score}%</td>
      <td class="small">${r.ats.matched.slice(0, 5).join(', ')}</td>
      <td class="small red-text">${r.ats.missing.join(', ') || '—'}</td>
      <td>
        ${r.resumePdfB64 ? `<a class="btn" href="${r.resumePdfB64}" download="${r.role.slug} - Resume.pdf">Resume PDF</a>` : ''}
        ${r.clPdfB64 ? `<a class="btn" href="${r.clPdfB64}" download="${r.role.slug} - Cover Letter.pdf">Cover PDF</a>` : ''}
      </td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Job Applications – ${today}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 13px; padding: 24px; background: #f9f9f9; }
  h1 { font-size: 20px; margin-bottom: 4px; }
  .subtitle { color: #666; margin-bottom: 16px; font-size: 12px; }
  table { border-collapse: collapse; width: 100%; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,.08); border-radius: 8px; overflow: hidden; }
  th { background: #333; color: #fff; padding: 9px 12px; text-align: left; font-size: 12px; }
  td { padding: 8px 12px; border-bottom: 1px solid #eee; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #f5f5f5; }
  .ats { font-weight: bold; text-align: center; }
  .green { color: #2e7d32; } .yellow { color: #e65100; } .red { color: #c62828; }
  .red-text { color: #c62828; } .small { font-size: 11px; }
  .btn { display: inline-block; padding: 4px 10px; background: #1a73e8; color: #fff; border-radius: 4px; text-decoration: none; font-size: 11px; margin-right: 4px; }
  .btn:hover { background: #0d5bba; }
</style>
</head>
<body>
<h1>📋 Job Applications – ${today}</h1>
<div class="subtitle">${results.length} roles · Generated ${new Date().toLocaleString()}</div>
<table>
  <thead>
    <tr><th>✓</th><th>Company</th><th>Role</th><th>Location</th><th>Salary</th><th>ATS</th><th>Keywords Matched</th><th>Missing</th><th>Downloads</th></tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
</body>
</html>`;

  fs.writeFileSync(htmlPath, html);
  console.log(`\n✅ Done → ${htmlPath}`);
}

main().catch(console.error);
