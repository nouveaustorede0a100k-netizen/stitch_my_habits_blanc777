import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Navigation from '@/components/Navigation'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden bg-background-main dark:bg-background-dark">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#e3f2fd] dark:from-slate-900 to-transparent -z-10 rounded-b-[3rem]"></div>
      {children}
      <Navigation />
    </div>
  )
}

