import type React from "react"
import Link from "next/link"
import { BarChart3, GitCompare, Info, Home } from "lucide-react"
import "./globals.css"

export const metadata = {
  title: "AI Writing Scorer",
  description: "Evaluate and improve your writing with AI-powered analysis",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <nav className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                  <BarChart3 className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                    AI Writing Scorer
                  </h1>
                  <p className="text-xs text-slate-500 hidden sm:block">Powered by AI Analysis</p>
                </div>
              </Link>

              {/* Navigation */}
              <ul className="flex items-center gap-1">
                <li>
                  <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                  >
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/compare"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                  >
                    <GitCompare className="h-4 w-4" />
                    <span className="hidden sm:inline">Compare</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                  >
                    <Info className="h-4 w-4" />
                    <span className="hidden sm:inline">About</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-16 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700">AI Writing Scorer</p>
                  <p className="text-sm text-slate-500">Enhance your writing with AI</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-4">
                  <Link href="/" className="hover:text-emerald-600 transition-colors">
                    Home
                  </Link>
                  <Link href="/compare" className="hover:text-emerald-600 transition-colors">
                    Compare
                  </Link>
                  <Link href="/about" className="hover:text-emerald-600 transition-colors">
                    About
                  </Link>
                </div>
                <div className="h-4 w-px bg-slate-300 hidden md:block" />
                <p>&copy; {new Date().getFullYear()} AI Writing Scorer. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
