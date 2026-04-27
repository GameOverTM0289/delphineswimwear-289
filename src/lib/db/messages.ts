import { prisma, dbReady } from '@/lib/prisma';

export async function subscribeNewsletter(email: string) {
  if (!dbReady() || !prisma) throw new Error('DATABASE_NOT_CONFIGURED');
  return prisma.newsletterSubscriber.upsert({
    where: { email },
    update: { status: 'active', unsubscribedAt: null },
    create: { email, status: 'active' },
  });
}

export async function recordContactMessage(input: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  if (!dbReady() || !prisma) throw new Error('DATABASE_NOT_CONFIGURED');
  return prisma.contactMessage.create({
    data: {
      name: input.name,
      email: input.email,
      subject: input.subject || null,
      message: input.message,
    },
  });
}

export async function listContactMessages() {
  if (!dbReady() || !prisma) return [];
  return prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
}
