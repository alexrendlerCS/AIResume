"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center text-xl font-bold">
              AI Resume Tailor
            </Link>
          </div>
          <div className="flex items-center">
            {session ? (
              <>
                <span className="mr-4">Welcome, {session.user?.name || session.user?.email}</span>
                <Button onClick={() => signOut()} variant="outline">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" className="mr-2">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

