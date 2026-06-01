# quaid-scanner Report: /Users/karstenwade/Projects/AINative-Studio/src/ai-kit-showcase

**Score:** 🔴 0.8/10 — CRITICAL risk
**Maturity:** sandbox | **Depth:** standard | **Duration:** 0.5s
**Scanned:** 2026-06-01T21:04:20.353Z

## Pillar Scores

| Pillar | Score | Weight | Findings |
|--------|-------|--------|----------|
| Security | 0.0 | 25% | 0C 31W 1I |
| Governance | 0.0 | 20% | 2C 3W 11I |
| Community | 0.0 | 15% | 0C 4W 8I |
| AI Readiness | 2.5 | 15% | 0C 5W 0I |
| Inclusive Language | 0.5 | 15% | 0C 5W 4I |
| Technical Rigor | 3.0 | 10% | 1C 2W 2I |

## Critical Findings

### license-detection-scanner:missing
**Pillar:** Governance | **Category:** license

No license detected. Without a license, the project is under exclusive copyright by default.

_(source: local file check)_

**Suggestion:** Add a LICENSE file to the repository root. Visit https://choosealicense.com/ for guidance.

**Reference:** https://choosealicense.com/

### vendor-neutrality-critical-concentration
**Pillar:** Governance | **Category:** vendor-neutrality

Project is dominated by gmail.com (100% of commits)

_(source: computed heuristic)_

**Suggestion:** Diversify contributors across multiple organizations to reduce single-vendor risk

**Reference:** https://chaoss.community/metric-project-sponsorship/

### test-coverage-1
**Pillar:** Technical Rigor | **Category:** test-coverage

No test files detected in the repository

_(source: local file check)_

**Suggestion:** Add a test suite to improve code reliability and enable coverage tracking

**Reference:** https://chaoss.community/metric-test-coverage/

## Warnings

- **[TIMEOUT-binary-artifacts]** Scanner "binary-artifacts" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[TIMEOUT-dep-pinning-docker]** Scanner "dep-pinning-docker" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[dep-pinning-packages-1]** Loosely pinned dependency "@ainative/ai-kit": "^0.1.0-alpha.4" uses ^ prefix in dependencies *(Consider pinning "@ainative/ai-kit" to an exact version for reproducible builds)*
- **[dep-pinning-packages-2]** Loosely pinned dependency "@ainative/ai-kit-core": "^0.1.4" uses ^ prefix in dependencies *(Consider pinning "@ainative/ai-kit-core" to an exact version for reproducible builds)*
- **[dep-pinning-packages-3]** Loosely pinned dependency "@ainative/ai-kit-nextjs": "^0.1.0-alpha.3" uses ^ prefix in dependencies *(Consider pinning "@ainative/ai-kit-nextjs" to an exact version for reproducible builds)*
- **[dep-pinning-packages-4]** Loosely pinned dependency "@ainative/ai-kit-safety": "^0.1.1" uses ^ prefix in dependencies *(Consider pinning "@ainative/ai-kit-safety" to an exact version for reproducible builds)*
- **[dep-pinning-packages-5]** Loosely pinned dependency "@ainative/ai-kit-tools": "^0.1.0-alpha.2" uses ^ prefix in dependencies *(Consider pinning "@ainative/ai-kit-tools" to an exact version for reproducible builds)*
- **[dep-pinning-packages-6]** Loosely pinned dependency "@ainative/ai-kit-observability": "^0.1.1" uses ^ prefix in dependencies *(Consider pinning "@ainative/ai-kit-observability" to an exact version for reproducible builds)*
- **[dep-pinning-packages-7]** Loosely pinned dependency "react": "^18.3.1" uses ^ prefix in dependencies *(Consider pinning "react" to an exact version for reproducible builds)*
- **[dep-pinning-packages-8]** Loosely pinned dependency "react-dom": "^18.3.1" uses ^ prefix in dependencies *(Consider pinning "react-dom" to an exact version for reproducible builds)*
- **[dep-pinning-packages-9]** Loosely pinned dependency "zustand": "^4.5.0" uses ^ prefix in dependencies *(Consider pinning "zustand" to an exact version for reproducible builds)*
- **[dep-pinning-packages-10]** Loosely pinned dependency "recharts": "^2.10.0" uses ^ prefix in dependencies *(Consider pinning "recharts" to an exact version for reproducible builds)*
- **[dep-pinning-packages-11]** Loosely pinned dependency "lucide-react": "^0.460.0" uses ^ prefix in dependencies *(Consider pinning "lucide-react" to an exact version for reproducible builds)*
- **[dep-pinning-packages-12]** Loosely pinned dependency "framer-motion": "^11.0.0" uses ^ prefix in dependencies *(Consider pinning "framer-motion" to an exact version for reproducible builds)*
- **[dep-pinning-packages-13]** Loosely pinned dependency "clsx": "^2.1.0" uses ^ prefix in dependencies *(Consider pinning "clsx" to an exact version for reproducible builds)*
- **[dep-pinning-packages-14]** Loosely pinned dependency "tailwind-merge": "^2.2.0" uses ^ prefix in dependencies *(Consider pinning "tailwind-merge" to an exact version for reproducible builds)*
- **[dep-pinning-packages-15]** Loosely pinned dependency "@types/node": "^20.10.0" uses ^ prefix in devDependencies *(Consider pinning "@types/node" to an exact version for reproducible builds)*
- **[dep-pinning-packages-16]** Loosely pinned dependency "@types/react": "^18.3.1" uses ^ prefix in devDependencies *(Consider pinning "@types/react" to an exact version for reproducible builds)*
- **[dep-pinning-packages-17]** Loosely pinned dependency "@types/react-dom": "^18.3.0" uses ^ prefix in devDependencies *(Consider pinning "@types/react-dom" to an exact version for reproducible builds)*
- **[dep-pinning-packages-18]** Loosely pinned dependency "@testing-library/react": "^14.1.2" uses ^ prefix in devDependencies *(Consider pinning "@testing-library/react" to an exact version for reproducible builds)*
- **[dep-pinning-packages-19]** Loosely pinned dependency "@testing-library/jest-dom": "^6.1.5" uses ^ prefix in devDependencies *(Consider pinning "@testing-library/jest-dom" to an exact version for reproducible builds)*
- **[dep-pinning-packages-20]** Loosely pinned dependency "@vitejs/plugin-react": "^4.2.1" uses ^ prefix in devDependencies *(Consider pinning "@vitejs/plugin-react" to an exact version for reproducible builds)*
- **[dep-pinning-packages-21]** Loosely pinned dependency "autoprefixer": "^10.4.16" uses ^ prefix in devDependencies *(Consider pinning "autoprefixer" to an exact version for reproducible builds)*
- **[dep-pinning-packages-22]** Loosely pinned dependency "postcss": "^8.4.32" uses ^ prefix in devDependencies *(Consider pinning "postcss" to an exact version for reproducible builds)*
- **[dep-pinning-packages-23]** Loosely pinned dependency "tailwindcss": "^3.4.0" uses ^ prefix in devDependencies *(Consider pinning "tailwindcss" to an exact version for reproducible builds)*
- **[dep-pinning-packages-24]** Loosely pinned dependency "typescript": "^5.3.0" uses ^ prefix in devDependencies *(Consider pinning "typescript" to an exact version for reproducible builds)*
- **[dep-pinning-packages-25]** Loosely pinned dependency "vitest": "^1.6.1" uses ^ prefix in devDependencies *(Consider pinning "vitest" to an exact version for reproducible builds)*
- **[dep-pinning-packages-26]** Loosely pinned dependency "jsdom": "^27.2.0" uses ^ prefix in devDependencies *(Consider pinning "jsdom" to an exact version for reproducible builds)*
- **[dep-pinning-packages-27]** Loosely pinned dependency "@vitest/coverage-v8": "^1.6.1" uses ^ prefix in devDependencies *(Consider pinning "@vitest/coverage-v8" to an exact version for reproducible builds)*
- **[TIMEOUT-openssf-local-checks]** Scanner "openssf-local-checks" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[TIMEOUT-openssf-scorecard]** Scanner "openssf-scorecard" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[TIMEOUT-clearly-defined]** Scanner "clearly-defined" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[license-content-validation-1]** No LICENSE file found in repository root *(Add a LICENSE file with a recognized open source license)*
- **[TIMEOUT-license-header-scanner]** Scanner "license-header-scanner" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[contributor-data-1]** 1 unique contributor with 4 commits in the last 12 months *(Single contributor detected — consider recruiting additional maintainers)*
- **[contributor-funnel-2]** Conversion rates: casual→regular 0%, regular→core 0% *(Low casual-to-regular conversion suggests contributor onboarding friction)*
- **[psych-safety-1]** No Code of Conduct found *(Add a CODE_OF_CONDUCT.md — see https://www.contributor-covenant.org/)*
- **[support-channels-1]** No SUPPORT.md or .github/SUPPORT.md found *(Add a SUPPORT.md documenting how users can get help)*
- **[agentic-rules-2]** CLAUDE.md lacks recognized structural sections *(Add sections like "Critical Rules", "Project Structure", "Common Tasks" to improve agent guidance.)*
- **[TIMEOUT-ai-repo-detection]** Scanner "ai-repo-detection" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[TIMEOUT-dataset-provenance]** Scanner "dataset-provenance" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[TIMEOUT-model-card-detection]** Scanner "model-card-detection" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[TIMEOUT-model-card-scoring]** Scanner "model-card-scoring" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[AK-PREREQ-MISSING-README.md]** README.md contains tool commands but no Prerequisites or Requirements section *(Consider adding a Prerequisites section listing required tools and versions)*
- **[TIMEOUT-diminishing-language-scanner]** Scanner "diminishing-language-scanner" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[TIMEOUT-inclusive-code-scanner]** Scanner "inclusive-code-scanner" failed: Cannot read properties of undefined (reading 'termListUrl') *(Check scanner implementation for errors)*
- **[TIMEOUT-inclusive-doc-scanner]** Scanner "inclusive-doc-scanner" failed: Cannot read properties of undefined (reading 'termListUrl') *(Check scanner implementation for errors)*
- **[TIMEOUT-inclusive-naming-scanner]** Scanner "inclusive-naming-scanner" failed: Cannot read properties of undefined (reading 'termListUrl') *(Check scanner implementation for errors)*
- **[interaction-templates-1]** No issue templates configured *(Add .github/ISSUE_TEMPLATE/ with bug report and feature request templates)*
- **[linter-config-1]** No linter configuration found *(Add a linter (ESLint, Prettier, Ruff, golangci-lint, etc.) and configure it to run in CI)*

## Info

- **[branch-protection-1]** GitHub token not provided. Cannot check branch protection settings.
- **[asset-protection-1]** No trademark policy found (optional)
- **[asset-protection-2]** No export control documentation found (optional)
- **[asset-protection-3]** No CLA or DCO requirement detected
- **[asset-protection-4]** Contributor friction level: Low
- **[bus-factor-1]** Bus factor: 1, Elephant factor: 100% (1 contributors, 4 commits in last 12 months)
- **[dep-license-scanning-1]** package.json found but node_modules not installed — cannot scan dependency licenses
- **[governance-classification-1]** No governance model detected — governance files exist but no recognizable model pattern found
- **[governance-detection-1]** No governance documentation found
- **[license-compatibility-1]** Cannot check license compatibility — no LICENSE file found
- **[vendor-neutrality-domain-count]** Found 1 unique email domain(s) across 4 commits
- **[vendor-neutrality-no-succession]** No succession planning documentation found
- **[burnout-detection-1]** Burnout detection requires a GitHub token
- **[contributor-data-2]** Contributor emails span 1 domain
- **[contributor-funnel-1]** Contributor funnel: 0 core, 0 regular, 1 casual (1 total)
- **[funding-1]** No funding infrastructure detected
- **[issue-closure-1]** Issue closure analysis requires a GitHub token
- **[response-classification-1]** Response classification requires a GitHub token
- **[response-time-1]** Response time analysis requires a GitHub token
- **[stale-bot-1]** No stale bot configured
- **[AK-TOOL-NPM-README.md:16]** Assumed knowledge: "npm" command used without Node.js listed as prerequisite
- **[AK-TOOL-NPM-README.md:19]** Assumed knowledge: "npm" command used without Node.js listed as prerequisite
- **[AK-TOOL-NPM-README.md:22]** Assumed knowledge: "npm" command used without Node.js listed as prerequisite
- **[AK-TOOL-NPM-README.md:25]** Assumed knowledge: "npm" command used without Node.js listed as prerequisite
- **[release-cadence-1]** No releases or version tags found
- **[semver-validation-1]** No git tags found — cannot validate SemVer

## Recommendations

- **[HIGH impact / medium effort]** Add a LICENSE file to the repository root. Visit https://choosealicense.com/ for guidance.
  - https://choosealicense.com/
- **[HIGH impact / medium effort]** Diversify contributors across multiple organizations to reduce single-vendor risk
  - https://chaoss.community/metric-project-sponsorship/
- **[HIGH impact / medium effort]** Add a test suite to improve code reliability and enable coverage tracking
  - https://chaoss.community/metric-test-coverage/
- **[MEDIUM impact / low effort]** Increase scannerTimeout in configuration or check network connectivity
- **[MEDIUM impact / low effort]** Consider pinning "@ainative/ai-kit" to an exact version for reproducible builds
- **[MEDIUM impact / low effort]** Increase scannerTimeout in configuration or check network connectivity
- **[MEDIUM impact / low effort]** Add a LICENSE file with a recognized open source license
- **[MEDIUM impact / low effort]** Single contributor detected — consider recruiting additional maintainers
- **[MEDIUM impact / low effort]** Low casual-to-regular conversion suggests contributor onboarding friction
- **[MEDIUM impact / low effort]** Add a CODE_OF_CONDUCT.md — see https://www.contributor-covenant.org/
- **[MEDIUM impact / low effort]** Add a SUPPORT.md documenting how users can get help
- **[MEDIUM impact / low effort]** Add sections like "Critical Rules", "Project Structure", "Common Tasks" to improve agent guidance.
- **[MEDIUM impact / low effort]** Increase scannerTimeout in configuration or check network connectivity
- **[MEDIUM impact / low effort]** Consider adding a Prerequisites section listing required tools and versions
- **[MEDIUM impact / low effort]** Increase scannerTimeout in configuration or check network connectivity
- **[MEDIUM impact / low effort]** Check scanner implementation for errors
- **[MEDIUM impact / low effort]** Add .github/ISSUE_TEMPLATE/ with bug report and feature request templates
- **[MEDIUM impact / low effort]** Add a linter (ESLint, Prettier, Ruff, golangci-lint, etc.) and configure it to run in CI

## Score Rationale

Overall score is a weighted sum of six pillar scores (each scored 0–10).

| Pillar | Weight | Raw Score | Contribution |
|--------|--------|-----------|-------------|
| Security | 25% | 0.0 | 0.00 |
| Governance | 20% | 0.0 | 0.00 |
| Community | 15% | 0.0 | 0.00 |
| AI Readiness | 15% | 2.5 | 0.38 |
| Inclusive Language | 15% | 0.5 | 0.07 |
| Technical Rigor | 10% | 3.0 | 0.30 |
| **Overall** | **100%** | | **0.80** |

---
*quaid-scanner v0.1.2 | 2026-06-01T21:04:20.353Z*
*Commit: 2313d49272d6fcc6e730279f05eb2ddefe3cf001*