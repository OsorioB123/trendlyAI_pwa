'use client'

import { useEffect, useState } from 'react'
import { Loader } from 'lucide-react'
import ProfileContent from './ProfileContent'

// Force dynamic rendering to avoid SSG issues with Supabase
export const dynamic = 'force-dynamic'

export default function ProfilePage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  return <ProfileContent />
}