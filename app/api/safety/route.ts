import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface PIIDetection {
    type: string;
    value: string;
    start: number;
    end: number;
    confidence: number;
}

interface SafetyResult {
    pii: PIIDetection[];
    injection: {
        detected: boolean;
        confidence: number;
        patterns: string[];
    };
    moderation: {
        flagged: boolean;
        categories: Record<string, boolean>;
    };
}

// PII patterns
const PII_PATTERNS: { type: string; regex: RegExp }[] = [
    { type: 'EMAIL', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
    { type: 'PHONE', regex: /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/g },
    { type: 'SSN', regex: /\d{3}[-]?\d{2}[-]?\d{4}/g },
    { type: 'CREDIT_CARD', regex: /\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}/g },
    { type: 'IP_ADDRESS', regex: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g },
];

// Injection patterns
const INJECTION_PATTERNS = [
    { pattern: /ignore\s+(all\s+)?previous\s+instructions/i, name: 'ignore_instructions' },
    { pattern: /forget\s+(everything|all|your)/i, name: 'forget_context' },
    { pattern: /you\s+are\s+now\s+(DAN|a\s+new)/i, name: 'role_override' },
    { pattern: /system\s*prompt/i, name: 'system_prompt_access' },
    { pattern: /jailbreak/i, name: 'jailbreak_mention' },
    { pattern: /without\s+(any\s+)?restrictions/i, name: 'remove_restrictions' },
    { pattern: /pretend\s+(you\s+are|to\s+be)/i, name: 'pretend_role' },
    { pattern: /bypass\s+(your\s+)?safety/i, name: 'bypass_safety' },
];

function detectPII(text: string): PIIDetection[] {
    const detections: PIIDetection[] = [];

    for (const { type, regex } of PII_PATTERNS) {
        let match;
        const re = new RegExp(regex.source, regex.flags);
        while ((match = re.exec(text)) !== null) {
            detections.push({
                type,
                value: match[0],
                start: match.index,
                end: match.index + match[0].length,
                confidence: 0.95,
            });
        }
    }

    return detections.sort((a, b) => a.start - b.start);
}

function detectInjection(text: string): { detected: boolean; confidence: number; patterns: string[] } {
    const foundPatterns: string[] = [];

    for (const { pattern, name } of INJECTION_PATTERNS) {
        if (pattern.test(text)) {
            foundPatterns.push(name);
        }
    }

    const detected = foundPatterns.length > 0;
    const confidence = Math.min(0.95, foundPatterns.length * 0.3 + 0.1);

    return { detected, confidence, patterns: foundPatterns };
}

function moderateContent(text: string): { flagged: boolean; categories: Record<string, boolean> } {
    const lowerText = text.toLowerCase();

    const categories: Record<string, boolean> = {
        hate: false,
        violence: false,
        sexual: false,
        selfHarm: false,
        dangerous: false,
    };

    // Simple keyword-based detection (in production, use a proper content moderation API)
    const hateWords = ['hate', 'racist', 'discriminate'];
    const violenceWords = ['kill', 'attack', 'weapon', 'bomb'];
    const dangerousWords = ['hack', 'exploit', 'malware', 'password'];

    categories.hate = hateWords.some(word => lowerText.includes(word));
    categories.violence = violenceWords.some(word => lowerText.includes(word));
    categories.dangerous = dangerousWords.some(word => lowerText.includes(word));

    const flagged = Object.values(categories).some(Boolean);

    return { flagged, categories };
}

export async function POST(req: NextRequest) {
    try {
        const { text, checks = ['pii', 'injection', 'moderation'] } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const result: SafetyResult = {
            pii: [],
            injection: { detected: false, confidence: 0, patterns: [] },
            moderation: { flagged: false, categories: {} },
        };

        if (checks.includes('pii')) {
            result.pii = detectPII(text);
        }

        if (checks.includes('injection')) {
            result.injection = detectInjection(text);
        }

        if (checks.includes('moderation')) {
            result.moderation = moderateContent(text);
        }

        return NextResponse.json(result);
    } catch {
        return NextResponse.json(
            { error: 'Failed to process safety check' },
            { status: 500 }
        );
    }
}
