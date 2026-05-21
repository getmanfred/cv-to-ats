import type { JobAnalysisResult } from '@/types/job'
import { withGeminiRetry } from '@/lib/api-retry'
import { nanComplete } from '@/lib/nan-client'

function buildJobPrompt(jdText: string, lang: 'es' | 'en', isManfred: boolean): string {
  const langInstruction = lang === 'en'
    ? 'Respond in English. Write ALL text values in English.'
    : 'Respond in Spanish (Castilian). Write ALL text values in Spanish.'

  const manfredContext = isManfred
    ? `\nMANFRED OFFER (IMPORTANT): This offer comes from getmanfred.com. Manfred is a curated tech job marketplace where a real human recruiter reads every application and personally responds to every candidate. This is a significant quality signal — it must appear as the FIRST item in "senalesPositivas" with titulo "Manfredo Certified" and a description explaining that this is a vetted offer from Manfred: a human will read the application and respond personally.\n`
    : ''

  return `You are an expert recruiter and career advisor. Your tone is direct, honest, and has a slight sense of humor when warranted. You analyze job offers and tell candidates what the offer really says — and what it conspicuously does not say.

CURRENT DATE: The year is 2026. All your assessments, market references, salary benchmarks, and technology context must reflect this. Do not reference 2024 or earlier as "current".
${manfredContext}
LANGUAGE: ${langInstruction}

Analyze the job offer below. Return ONLY valid JSON — no markdown, no text outside the JSON object.

Score calibration (0-100). Score the offer as a whole based on transparency, clarity, and respect for the candidate:
- 85-100: Excellent offer. Transparent salary, clear role, realistic requirements, concrete culture signals, respectful process.
- 65-84: Good offer with minor gaps. Mostly transparent but missing some information.
- 45-64: Average offer. Notable gaps or some red flags but worth investigating.
- 25-44: Below average. Several red flags or key information is missing.
- 0-24: Poor offer. Multiple red flags, vague, unrealistic requirements, or deceptive language.

Analyze these dimensions to form your score and findings:
1. Salary transparency — is it mentioned? is it a range? is it vague ("según valía", "competitive salary")?
2. Requirements sanity — are there too many technologies for the experience level? are years-of-experience requirements absurd relative to the technology's age?
3. Work modality — is remote/hybrid/on-site clearly stated? are the specific conditions (e.g. number of days) given?
4. Role clarity — does the candidate know what they will actually do day-to-day?
5. Culture signals — are there concrete culture indicators, or just empty phrases like "buen ambiente" and "empresa líder"?
6. Hiring process — is the selection process described? how many stages? is there a timeline?
7. Benefits quality — are the benefits meaningful, or are they filler (free fruit, table football, "flexible hours" as a perk)?
8. Suspicious urgency — does "immediate incorporation" suggest high rotation? is there unusual pressure?
9. Salary-requirements coherence — if a salary is mentioned, does it match the seniority and number of requirements?
10. Team and project context — is there any information about the team size, project stage, or company context?
11. Obsolete or declining tech stack — if the PRIMARY tech stack is predominantly obsolete or has sharply declining market demand (e.g. Delphi, COBOL, legacy VB.NET, ColdFusion), flag this as a señalAlerta: it may limit the candidate's future marketability. Only flag if the stack is genuinely obsolete — do not penalise established technologies like Java, PHP, or older but active stacks.
12. Role scope inflation ("rol trampa") — if the role combines responsibilities that typically belong to multiple distinct roles (e.g. developer + DevOps + data analyst + QA + support) while compensation appears to be for a single role, add a señalAlerta. This is about understated work scope, not about requiring many technologies.
13. Benefits vs. salary coherence — if the offer advertises a meaningful list of benefits while the stated salary is below or significantly below market, flag this in a señalAlerta: "total compensation" framing can obscure weak base pay.

MANDATORY SCORE ADJUSTMENTS — apply these on top of the base score before returning the final value:

PRESENCIALIDAD — context-aware rules (evaluate the role before applying any penalty):
- HARDWARE / PHYSICAL ROLES: If the role involves hardware, electronics, embedded systems, IoT, robotics, mechatronics, lab work, manufacturing, or any work that physically requires being on-site with equipment or machinery — apply ZERO penalty for on-site requirements. Do NOT add a señalAlerta about remote being unavailable. It is expected and appropriate for the role. You may mention it neutrally in the resumen if relevant.
- C-LEVEL AND COMMERCIAL ROLES: If the role is C-level (CEO, CTO, COO, CFO, VP, Director, Head of) or commercial/client-facing (Sales, Account Executive, BDR, SDR, Account Manager, Customer Success, Business Development) — apply only -5 for fully on-site. No penalty for hybrid. Physical presence is standard and expected for leadership and client-facing work.
- ALL OTHER ROLES: Hybrid work (some days remote, some days in office): subtract 5 points. Fully on-site / presencial with no remote option whatsoever: subtract 15 points AND add a señalAlerta about it.

SALARY BOOST: If the offer explicitly states a salary (range or fixed number) AND your independent market estimate (salarioMercado) indicates the offered salary is above the market median for this role — add +10 points. If the offer is 20% or more above your market estimate — add +15 points instead. Only apply this bonus when a concrete salary figure is stated in the offer and your estimate is confident.

OTHER: Free fruit, free snacks, coffee machine, or similar trivial in-office perks mentioned as if they were a meaningful benefit: subtract 5 points AND add a señalAlerta about it.

All adjustments are cumulative. Clamp the final score to the 0-100 range.

Required JSON fields:

- "score": number 0-100

- "puesto": job title extracted from the offer. Empty string if not found.

- "empresa": company name extracted from the offer. Empty string if not found.

- "resumen": 2-3 sentences. Give a direct, honest assessment of the offer with slight humor where appropriate. Be specific: reference actual content from the offer. Do NOT start with flattery or praise. If the offer is poor, say so clearly from the first sentence. If it is excellent, explain why concisely.

- "veredicto": one punchy headline, maximum 10 words. Newspaper-style. Captures the essence of the offer with a touch of irony if warranted. Should feel like a headline, not a description.

- "senalesPositivas": array of 2-6 positive signals found in the offer. Each item: { "titulo": short label (3-6 words), "descripcion": 2-3 sentences. Quote or reference specific text from the offer when possible. Explain concretely why this is a good sign and what it implies for the candidate's experience }. Include at least two even if the offer is poor.

- "senalesAlerta": array of 2-7 red flags or concerns. Each item: { "titulo": short label (3-6 words), "descripcion": 2-3 sentences. Quote or reference specific text from the offer when possible. Explain why this matters, what it typically signals in practice, and what the candidate should ask about }. Include at least two even if the offer is excellent.

- "loQueNoDice": array of 3-6 strings. Important information that is conspicuously absent from the offer. Be specific about what exactly is missing and why it matters. Frame as factual observations. Example: "No menciona el rango salarial, lo que dificulta evaluar si encaja con las expectativas", "No especifica cuántos días de teletrabajo son posibles", "No describe el proceso de selección ni el número de fases".

- "traduccionReal": scan the FULL offer text for coded or toxic language — phrases whose implied meaning in practice differs from their literal reading. For each detected phrase:
  - "frase": the exact phrase or close paraphrase as it appears in the offer
  - "traduccion": what it really implies in practice (max 25 words, direct, slightly ironic)
  Return an array of 0-4 items. Return null if none detected. Only include phrases that genuinely appear in the offer — do NOT invent them.
  Patterns to look for (non-exhaustive): "somos una familia" / "we're like a family" (blurred work-life boundaries); "buen rollo" / "buen ambiente" (unverifiable vague promise); "rockstar" / "ninja" / "wizard" (unclear seniority, informal title); "entorno fast-paced" / "fast-paced environment" (high workload, possible rotation); "autonomía total" without context (no management support); "startup mindset" / "mentalidad startup" (long hours expected); "apasionado/a" / "passionate" as a requirement (subjective gatekeeping); "incorporación inmediata" alone without explanation (rotation indicator); "empresa líder" without evidence (empty phrase); "salario según valía" / "competitive salary" (no transparent range); "posibilidad de teletrabajo" vague and unspecified (may not materialise).

- "procesoEstimado": your estimate of the hiring process for this role, based on: role seniority, inferred company type (startup, consultancy, product company, enterprise), tech stack, and any process information explicitly mentioned in the offer.
  - "fases": estimated number of interview stages (integer, typically 2-5)
  - "descripcion": 2-3 sentences describing what to typically expect at each stage (HR screening, technical test with estimated hours if relevant, technical interview, culture/values interview, etc.)
  - "confianza": "alta" if the offer explicitly describes the process; "media" if reasonably inferable from context; "baja" if little context available
  Return null only if the role is so vague that no meaningful estimate is possible.

- "salarioMercado": your independent market salary estimate for this specific role. Base it on: job title, seniority inferred from the requirements, location (use Spain/EUR as default if not stated), and tech stack. Rules:
  1. This is your own estimate — do NOT copy the salary stated in the offer. Estimate independently from market knowledge.
  2. If a salary IS mentioned in the offer, compare it against your estimate in the "nota" field (e.g. "La oferta está un 15% por debajo de la media de mercado para este perfil").
  3. If the role is too vague to estimate reliably (no title, no requirements, no tech), return null.
  4. "nota": one sentence explaining the main factors used (seniority assumed, location assumed, stack weight) and any notable gap vs. the offer's stated salary if applicable.
  {
    "min": <number — annual gross, full number e.g. 42000>,
    "max": <number — annual gross, full number e.g. 60000>,
    "moneda": "<EUR | USD | GBP>",
    "nota": "<string>"
  }

COMPANY REPUTATION CONTEXT RULE:
If you recognise the company name (from "empresa") with high confidence and have relevant market context about it, add one item to "senalesPositivas" or "senalesAlerta" that briefly frames what kind of company it is and what that typically means for candidates (e.g. consulting firm with variable project exposure, established product company, fast-growing startup). Frame it as market context, not a verdict. Use neutral, informative language — no harsh judgements. If you are not confident you recognise the company, say nothing about it.

RULES:
- Be specific: quote or reference actual phrases or content from the offer in señales descriptions
- "loQueNoDice" contains absences with a brief note on why each absence matters
- Never be cruel, offensive, or attack the company — gentle irony only
- If the offer is genuinely excellent, score it high and explain why honestly
- All text values must be in the specified language

JSON structure:
{
  "score": <number>,
  "puesto": "<string>",
  "empresa": "<string>",
  "resumen": "<string>",
  "veredicto": "<string>",
  "senalesPositivas": [{ "titulo": "<string>", "descripcion": "<string>" }],
  "senalesAlerta": [{ "titulo": "<string>", "descripcion": "<string>" }],
  "loQueNoDice": ["<string>", ...],
  "salarioMercado": { "min": <number>, "max": <number>, "moneda": "<string>", "nota": "<string>" } | null,
  "traduccionReal": [{ "frase": "<string>", "traduccion": "<string>" }] | null,
  "procesoEstimado": { "fases": <number>, "descripcion": "<string>", "confianza": "<alta|media|baja>" } | null
}

JOB OFFER:
---
${jdText}
---`
}

export async function analyzeJobWithAI(jdText: string, lang: 'es' | 'en' = 'es', isManfred = false): Promise<JobAnalysisResult> {
  const prompt = buildJobPrompt(jdText, lang, isManfred)
  const text = await withGeminiRetry(() => nanComplete(prompt))

  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  let parsed: JobAnalysisResult
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    throw new Error('Error al procesar la respuesta. Por favor, inténtalo de nuevo.')
  }

  if (typeof parsed.score !== 'number' || !Array.isArray(parsed.senalesPositivas)) {
    throw new Error('La respuesta no tenía los campos necesarios. Por favor, inténtalo de nuevo.')
  }

  parsed.puesto            = parsed.puesto ?? ''
  parsed.empresa           = parsed.empresa ?? ''
  parsed.resumen           = parsed.resumen ?? ''
  parsed.veredicto         = parsed.veredicto ?? ''
  parsed.senalesPositivas  = parsed.senalesPositivas ?? []
  parsed.senalesAlerta     = parsed.senalesAlerta ?? []
  parsed.loQueNoDice       = parsed.loQueNoDice ?? []
  parsed.salarioMercado    = parsed.salarioMercado ?? null
  parsed.traduccionReal    = parsed.traduccionReal ?? null
  parsed.procesoEstimado   = parsed.procesoEstimado ?? null

  return parsed
}
