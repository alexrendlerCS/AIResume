import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AI Resume Tailor",
  description: "Tailor your resume to job descriptions using AI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

