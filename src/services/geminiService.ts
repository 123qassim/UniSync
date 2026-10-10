/**
 * Apex AI Assistant Service
 *
 * Server-side AI adapter utilizing @google/genai with gemini-3.8-flash.
 * Strictly protects credentials on the server and provides a clearly labeled
 * demo mode fallback when an API key is not configured or unavailable.
 * Supports both UniPath career guidance and ZeroQ admissions/marketplace inquiries.
 */

import { GoogleGenAI } from '@google/genai';

interface ApexAICallOptions {
  userPrompt: string;
  context?: {
    module?: 'unipath' | 'zeroq' | 'brainmate';
    programmeName?: string;
    currentYear?: number;
    completedUnits?: string[];
    careerInterests?: string[];
    targetCareer?: string;
    // ZeroQ context
    studentName?: string;
    institutionName?: string;
    applicationStatus?: string;
    credentialStatus?: string;
    missingDocumentsCount?: number;
    voucherCount?: number;
  };
}

export interface ApexAICallResponse {
  text: string;
  isDemoFallback: boolean;
  provider: 'gemini-3.8-flash' | 'demo-adapter';
}

export async function askApexAI(options: ApexAICallOptions): Promise<ApexAICallResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  const moduleName = options.context?.module || 'unipath';
  const contextStr = options.context
    ? `Student & Module Context:
- Active Module: ${moduleName.toUpperCase()}
- Student: ${options.context.studentName || 'Brian Otieno'}
- Institution / University: ${options.context.institutionName || 'Maseno University'}
- Programme: ${options.context.programmeName || 'BSc Computer Science'}
- Application Status: ${options.context.applicationStatus || 'Approved'}
- Digital Student ID Status: ${options.context.credentialStatus || 'Demo Verified'}
- Outstanding Documents: ${options.context.missingDocumentsCount ?? 0}
- Active Campus Vouchers: ${options.context.voucherCount ?? 1}`
    : 'General university onboarding and career discovery context.';

  const systemInstruction = `You are Apex AI, the intelligent academic discovery, admissions onboarding, and student guidance advisor embedded within the UniSync ecosystem (ZeroQ and UniPath modules).
Your mission in ZeroQ:
1. Explain Kenyan university admission and KUCCPS placement verification steps clearly.
2. Guide students through document submission, face check demonstration, and digital student QR identity issuance.
3. Help students navigate campus commerce, merchant store discovery, M-Pesa simulated payment, and voucher redemption.
4. Answer questions about university requirements, reporting dates, accommodation, and fees.

CRITICAL RULES:
- Never fabricate official transcripts, official placement allocations, or legal university contracts.
- Remind students that KUCCPS is the official placement body and that ZeroQ is a digital onboarding platform.
- When asked for official placement status, explain how to access the official portal at students.kuccps.net.
- When answering marketplace or product questions (e.g. calculator under KSh 1,500), cite available campus merchants like Campus Essentials Shop or Student Tech Store.
- Speak with warmth, clarity, Kenyan educational context, and practical reassurance.`;

  // If no Gemini API key is configured, use the honest, high-fidelity demo fallback
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return {
      text: generateDemoFallbackResponse(options.userPrompt, options.context),
      isDemoFallback: true,
      provider: 'demo-adapter',
    };
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `${contextStr}\n\nStudent Query: "${options.userPrompt}"`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const outputText = response.text || 'I was unable to generate a response for this query. Please try again.';
    return {
      text: outputText,
      isDemoFallback: false,
      provider: 'gemini-3.8-flash',
    };
  } catch (error) {
    console.error('Apex AI (Gemini) error:', error);
    return {
      text: `${generateDemoFallbackResponse(options.userPrompt, options.context)}\n\n*(Notice: Live Gemini service encountered a temporary error. Provided response generated via ZeroQ local guidance adapter).*`,
      isDemoFallback: true,
      provider: 'demo-adapter',
    };
  }
}

function generateDemoFallbackResponse(
  prompt: string,
  context?: ApexAICallOptions['context']
): string {
  const q = prompt.toLowerCase();
  const pName = context?.programmeName || 'BSc Computer Science';
  const uni = context?.institutionName || 'Maseno University';

  if (q.includes('kuccps') || q.includes('placement')) {
    return `### KUCCPS Placement Verification Guidance

- **Official Placement Body**: KUCCPS (Kenya Universities and Colleges Central Placement Service) is the sole statutory authority that determines government-sponsored placements.
- **Checking Official Results**: You can view official placement outcomes on the official portal at [students.kuccps.net](https://students.kuccps.net) using your KCSE Index Number and Year.
- **ZeroQ Onboarding**: In ZeroQ, you can upload your downloaded placement letter for ${uni} to initiate your digital onboarding and hostel booking.`;
  }

  if (q.includes('document') || q.includes('requirement')) {
    return `### Required Admission Documents for ${uni}

To complete onboarding for **${pName}**, ensure you submit:
1. **KUCCPS Placement Offer Letter** (downloaded from the student portal)
2. **KCSE Official Result Slip** (verified by your high school principal)
3. **National ID Card** or certified Birth Certificate
4. **Passport Size Photographs** (white background)
5. **Duly signed Medical Examination Report Form**

You can upload these directly in the **ZeroQ Document Centre** for registrar review.`;
  }

  if (q.includes('qr') || q.includes('student id') || q.includes('code not active')) {
    return `### ZeroQ Digital Student ID Status

Your Digital Student QR Code activates once all mandatory onboarding milestones are complete:
1. University application approved by the admissions desk
2. All 5 required documents verified
3. Face check demonstration completed
4. Registrar identity approval recorded

Once active, your card displays **DEMO-MS-2026-0042** and can be scanned at campus library gates, cafeterias, and partner merchants.`;
  }

  if (q.includes('calculator') || q.includes('price') || q.includes('1500') || q.includes('1,500')) {
    return `### Campus Marketplace: Scientific Calculators

- **Casio fx-991EX ClassWiz**: Available at **Campus Essentials Shop** (Siriba Student Center Stall 4) for **KSh 1,200** (under your KSh 1,500 budget).
- **Payment & Voucher**: You can order directly in the ZeroQ Marketplace with Demo M-Pesa to generate an instant collection voucher!`;
  }

  if (q.includes('voucher') || q.includes('order')) {
    return `### Active Campus Vouchers

- **Current Active Voucher**: **ZQ-DEMO-2026-00841**
- **Merchant**: Campus Essentials Shop (Siriba Stall 4)
- **Item**: Semester Stationery Starter Bundle (Value: **KSh 500**)
- **How to Redeem**: Present your scannable voucher QR code to the merchant, or read out code \`ZQ-DEMO-2026-00841\`.`;
  }

  if (q.includes('stationery') || q.includes('shop')) {
    return `### Partner Merchants for Stationery

1. **Campus Essentials Shop** (Siriba Student Center) — Exercise books, scientific calculators, backpacks.
2. **Maseno Stationery Hub** (Opposite Library Gate B) — Laser printing, thesis binding, pens, highlighters.`;
  }

  return `### ZeroQ Student Advisor

Welcome to **${uni}**! I'm Apex AI. I can guide you through:
- KUCCPS placement verification and document uploads
- Face check demonstration and your Digital Student QR Card
- Ordering textbooks, stationery, and cafeteria meals with M-Pesa in the Campus Marketplace
- Redeeming vouchers at partner campus stalls

What would you like assistance with next?`;
}
