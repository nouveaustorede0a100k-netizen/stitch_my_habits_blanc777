import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getStartOfDay } from '@/lib/utils'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { completed } = await request.json()
    const today = getStartOfDay()

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

    // Check if log exists for today
    const existingLog = await prisma.habitLog.findUnique({
      where: {
        habitId_date: {
          habitId: params.id,
          date: today,
        },
      },
    })

    if (existingLog) {
      // Update existing log
      const updatedLog = await prisma.habitLog.update({
        where: { id: existingLog.id },
        data: { completed },
      })
      return NextResponse.json(updatedLog)
    } else {
      // Create new log
      const newLog = await prisma.habitLog.create({
        data: {
          habitId: params.id,
          userId: session.user.id,
          date: today,
          completed,
        },
      })
      return NextResponse.json(newLog, { status: 201 })
    }
  } catch (error) {
    console.error('Error toggling habit:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'habitude' },
      { status: 500 }
    )
  }
}

