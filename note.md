Love this idea. Here’s how I’d design an end-to-end “Change My Name” app for the UK — what it can truly automate, what it can only assist, and the flow to make it painless.

Product vision (what the app does)
• Generate the legal document (unenrolled deed poll) with correct wording + witnesses, or prep an enrolled deed poll pack (LOC020/021/027) if the user wants a High Court public record. ￼
• Guide the user down the right route (marriage/divorce vs deed poll), then auto-prep evidence needed for each agency (passport, DVLA, HMRC, banks, etc.). ￼
• Pre-fill forms, letters and checklists, offer printing & postage, track statuses, and nudge users until all records are updated.
• Identity & witness orchestration: verify the user, schedule witnesses, capture witness details, and ensure the deed is signed correctly (wet-ink where required). ￼ ￼

Important constraints (so we design realistically)
• Unenrolled deed poll is valid and widely accepted; must be signed with 2 witnesses (18+) and some orgs dislike close relatives/same-address witnesses. ￼
• Enrolled deed poll can now be applied for online but still requires printing, witnesses, and posting forms to the High Court (fee ~£50.32). ￼
• Passport updates need deed poll/statutory declaration/affidavit plus evidence you’re using the new name. HMPO staff guidance expects a dated, wet-signed deed if queried. ￼ ￼
• DVLA still needs original documents and a paper D1/D2 application by post (you get the form at the Post Office). ￼
• HMRC can be updated online by the user after sign-in; there’s no public API to change personal details on their behalf. ￼

End-to-end user flow (happy-path)

0. Onboarding
   • KYC (document + liveness), reason for change (marriage/divorce/other), target agencies to update, urgency.

1. Route selection & rules
   • If marriage/divorce → skip deed poll where accepted; generate tailored evidence pack.
   • Else → Unenrolled deed poll by default; offer Enrolment add-on for institutions that insist on it. ￼

2. Name validation & document generation
   • Validate name rules (no symbols except hyphen/apostrophe, not offensive, pronounceable). Generate the unenrolled deed poll PDF with correct wording + fields for two witnesses. ￼

3. Witness orchestration
   • Book witnesses (friend/colleague) or partner with local solicitors; capture witness full name, address, occupation. Provide signing checklist (wet-ink, both old & new name signatures). ￼ ￼

4a) Enrolment (optional)
• Pre-fill LOC020/LOC021/LOC027, generate Gazette notice text, instructions to print, sign before 2 witnesses, and post to RCJ; collect fee and track status. ￼

4b) Evidence vault
• Securely store deed poll + ID, proof of address, marriage/divorce docs. Create “evidence bundles” per agency.

5. Agency updates (assisted automation)
   • Passport: deep-link to HMPO change flow; app uploads checklist + “evidence of use” guidance (e.g., payslip letter template). ￼
   • DVLA: generate cover letter + packing slip; ship a ready-to-post kit with D1 and return envelope; track when originals are sent/returned. ￼
   • HMRC: deep-link to “Tell HMRC your name has changed”; confirm when user completes. ￼
   • Banks/utilities/employer/GP: generate tailored letters/emails and upload instructions; where portals exist, deep-link; where post needed, supply pack.

6. Tracking & nudges
   • A Kanban-style board (Not started / Sent / In review / Completed) with SLA expectations per agency and reminders for missing steps.

7. Completion
   • “All updated” certificate + exportable audit log of changes and timestamps.

Integration touchpoints (what’s possible today)

Organisation Update method Evidence typically needed Programmatic?
HM Passport Office Online application + evidence upload/post Deed poll/statutory declaration/affidavit + proof you use new name No public API → deep link & guidance. ￼
DVLA (licence) Paper D1/D2 + original supporting docs by post Original deed poll/marriage/divorce etc. No API; assist with pack & tracking. ￼
HMRC (Personal Tax) Online after sign-in None beyond sign-in; may later request evidence No API for third parties; deep link. ￼
Enrolled Deed Poll (High Court) Online form → print, witness, post; fee £50.32; Gazette publication IDs listed on site No API; pre-fill forms & track. ￼
Banks/Utilities/Employer/NHS Portal/email/post varies Deed poll copy; sometimes ID/PoA No standard API; templates + instructions.

Core components (system design)
• Name Rules Engine: validates name against GOV.UK guidance (characters, pronouncability, public interest). ￼
• Document Generator: creates unenrolled deed poll PDF (with gov-style wording), enrolment pack (LOC020/021/027), cover letters, and bank/HR templates. ￼
• Witness Module: booking, witness KYC (light), capture of details for the deed, signing checklist (wet-ink, both names). ￼ ￼
• Evidence Vault: encrypted storage for ID, proofs, signed deed; versioned bundles per agency.
• Task Orchestrator: per-agency playbooks, deadlines, checklists, and notifications.
• Printing & Post: integration with a print-and-mail provider for deed polls, DVLA packs, enrolled forms.
• Compliance & Audit: GDPR/DPA 2018 controls, data minimisation, retention policies, access logs.

Security & compliance (high-level)
• GDPR lawful basis = contract (service delivery) + consent for sensitive data; strong encryption at rest/in transit, strict retention (e.g., auto-purge 90 days after completion), role-based access, and full audit trails.
• Explicit guidance that many bodies expect wet-ink signatures; app prevents users from relying solely on e-sign for deeds. ￼

MVP → Phase roadmap
• MVP (4–6 weeks of build effort, ballpark)
• Name rules, deed poll generator, witness capture, per-agency checklists, passport/DVLA/HMRC packs, printer integration, status board.
• Phase 2
• Witness marketplace (solicitors), certified copies service, mobile “scan & verify” of completed deeds, postal tracking, employer/HR integrations.
• Phase 3
• Bank/utility partner APIs where available, richer HMPO evidence assistants (auto-compile payslip letters), analytics + success scores.

Risks & mitigations
• Agency variability (some banks insist on enrolled deeds): upfront intake asks where the user needs updates; nudge them to enrol if needed. ￼
• Post/Originals (DVLA/HMCTS rely on post): provide print-and-post kits + tracked postage options. ￼
• Evidence of use for passport: generate “evidence of use” letters and show acceptable examples. ￼
• Incorrect witnessing: step-by-step checklist (2 adult witnesses; avoid close relatives/same address; wet-ink). ￼

⸻

If you want, I can turn this into a BPMN swimlane (Customer, Witness, App, HMCTS, HM Passport Office, DVLA, HMRC) and a one-page agency matrix you can drop into a discovery pack.
