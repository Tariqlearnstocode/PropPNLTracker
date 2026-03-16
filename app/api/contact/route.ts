import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { z } from 'zod';
import { checkRateLimit } from '@/utils/rate-limit';
import { sanitizeName, sanitizeEmail, sanitizeText } from '@/utils/sanitize';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email address').max(255),
  message: z.string().min(1, 'Message is required').max(2000),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP — 5 submissions per hour
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const { allowed } = checkRateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }

    let body: z.infer<typeof contactSchema>;
    try {
      body = contactSchema.parse(await request.json());
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid request', details: (err as z.ZodError).errors },
        { status: 400 }
      );
    }

    const name = sanitizeName(body.name);
    const email = sanitizeEmail(body.email);
    const message = sanitizeText(body.message, 2000);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('contact_submissions')
      .insert({ name, email, message });

    if (error) {
      console.error('Failed to save contact submission:', error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
