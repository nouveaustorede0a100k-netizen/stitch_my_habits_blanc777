import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const goalSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  period: z.enum(['day', 'week', 'month', 'year']),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  startDate: z.string().transform((str) => new Date(str)),
  dueDate: z.string().transform((str) => new Date(str)).optional().nullable(),
  motivation: z.string().optional(),
  parentGoalId: z.string().optional().nullable(),
})

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period')
    const status = searchParams.get('status')

    const goals = await prisma.goal.findMany({
      where: {
        userId: session.user.id,
        ...(period ? { period } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        subGoals: true,
        progressLogs: {
          orderBy: {
            date: 'desc',
          },
          take: 10,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des objectifs' },
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
    const data = goalSchema.parse(body)

    const goal = await prisma.goal.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    })

    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating goal:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'objectif' },
      { status: 500 }
    )
  }
}

