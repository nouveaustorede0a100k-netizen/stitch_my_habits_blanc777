import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const habitSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  frequency: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
  specificDays: z.array(z.number()).optional(),
  reminderTime: z.string().optional(),
  reminderEnabled: z.boolean().default(true),
  icon: z.string().optional(),
  color: z.string().optional(),
  motivation: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    const habits = await prisma.habit.findMany({
      where: {
        userId: session.user.id,
        ...(active !== null ? { isActive: active === 'true' } : {}),
      },
      include: {
        logs: {
          take: 30,
          orderBy: {
            date: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(habits)
  } catch (error) {
    console.error('Error fetching habits:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des habitudes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const data = habitSchema.parse(body)

    const habit = await prisma.habit.create({
      data: {
        ...data,
        specificDays: data.specificDays ? JSON.stringify(data.specificDays) : null,
        userId: session.user.id,
      },
    })

    return NextResponse.json(habit, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating habit:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'habitude' },
      { status: 500 }
    )
  }
}

