# CAET Advanced Tracking Tool

Practical Qualification Standards (PQS) tracking system for the CAET Advanced certification program.

**Built by:** Aircraft Electronics Association (AEA)  
**Stack:** Next.js 14 + Supabase + Tailwind CSS  
**Deployment:** AWS (S3 + CloudFront) or Vercel

## What This Does

Tracks technicians through the CAET Advanced certification practical pathway:
1. ✅ Written Exam (USI — external prerequisite)
2. 🔧 PQS Practical Tasks (75 tasks across 13 sections, evaluator sign-off)
3. 📁 Portfolio Submission (7 required documents)
4. 🎤 Oral Board (2 committee members, rubric-based scoring)
5. 🏆 CAET Advanced Certified

## User Roles

| Role | Access |
|------|--------|
| **Technician** | View progress, study guides, submit portfolio, schedule oral |
| **Evaluator** | Sign off PQS tasks, view candidate roster |
| **Committee Member** | Score oral boards, review portfolios |
| **AEA Admin** | National dashboard, pipeline analytics, recertification |

## PQS Sections (75 Tasks)

1. Regulatory Compliance (4 tasks)
2. Maintenance Documentation (5 tasks)
3. Wiring Diagrams & Drawings (4 tasks)
4. Wire Harness Fabrication & Testing (6 tasks)
5. Audio Panel & Intercom (5 tasks)
6. Navigation Systems (6 tasks)
7. Communication Systems (4 tasks)
8. Transponder & ADS-B (6 tasks)
9. Pitot-Static Systems (8 tasks)
10. Autopilot Systems (7 tasks)
11. Compass Systems (6 tasks)
12. EFB & Connectivity (6 tasks)
13. Flight Management Systems (8 tasks)

## Getting Started

```bash
npm install
cp .env.example .env.local  # Add Supabase credentials
npm run dev
```

## License

Proprietary — Aircraft Electronics Association
