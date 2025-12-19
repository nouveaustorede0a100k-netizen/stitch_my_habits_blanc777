import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateHabitSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
  specificDays: z.array(z.number()).optional(),
  reminderTime: z.string().optional(),
  reminderEnabled: z.boolean().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  motivation: z.string().optional(),
  isActive: z.boolean().optional(),
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const habit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        logs: {
          orderBy: {
            date: 'desc',
          },
          take: 100,
        },
      },
    })

    if (!habit) {
      return NextResponse.json({ error: 'Habitude non trouvée' }, { status: 404 })
    }

    return NextResponse.json(habit)
  } catch (error) {
    console.error('Error fetching habit:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'habitude' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const data = updateHabitSchema.parse(body)

    // Check ownership
    const habit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!habit) {
      return NextResponse.json({ error: 'Habitude non trouvée' }, { status: 404 })
    }

    const updatedHabit = await prisma.habit.update({
      where: { id: params.id },
      data: {
        ...data,
        specificDays: data.specificDays
          ? JSON.stringify(data.specificDays)
          : undefined,
      },
    })

    return NextResponse.json(updatedHabit)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating habit:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'habitude' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Check ownership
    const habit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!habit) {
      return NextResponse.json({ error: 'Habitude non trouvée' }, { status: 404 })
    }

    await prisma.habit.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Habitude supprimée' })
  } catch (error) {
    console.error('Error deleting habit:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'habitude' },
      { status: 500 }
    )
  }
}

