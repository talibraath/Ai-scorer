"use client"

import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Download,
  Loader2,
  GitCompare,
  FileDown,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
} from "lucide-react"

export default function ComparePage() {
  const [textA, setTextA] = useState("")
  const [textB, setTextB] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)

  async function handleCompare() {
    if (!textA.trim() || !textB.trim()) {
      alert("Please enter text in both fields.")
      return
    }
    setLoading(true)
    try {
      const res = await axios.post("/api/compare", { textA, textB })
      setResult(res.data)
    } catch (err) {
        console.error(err);
      alert("Comparison failed.")
    }
    setLoading(false)
  }

  async function handleExportPdf() {
    if (!result) return
    setExporting(true)

    const res = await fetch("/api/export/pdf", {
      method: "POST",
      body: JSON.stringify({
        scores: result.versionB,
        average:
          Object.values(result.versionB)
            .map((v: any) => v.score)
            .reduce((a: number, b: number) => a + b, 0) / Object.keys(result.versionB).length,
        rewritePrompt: "See deltas and low scores for improvement.",
        metadata: {
          sectionId: "Comparison",
          version: "vB",
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    setExporting(false)

    if (!res.ok) {
      alert("Failed to generate PDF.")
      return
    }

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "comparison-report.pdf"
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  async function handleExportDocx() {
    if (!result) return
    setExporting(true)

    const res = await fetch("/api/export/docx", {
      method: "POST",
      body: JSON.stringify({
        scores: result.versionB,
        average:
          Object.values(result.versionB)
            .map((v: any) => v.score)
            .reduce((a: number, b: number) => a + b, 0) / Object.keys(result.versionB).length,
        rewritePrompt: "See deltas and low scores for improvement.",
        metadata: {
          sectionId: "Comparison",
          version: "vB",
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    setExporting(false)

    if (!res.ok) {
      alert("Failed to generate DOCX.")
      return
    }

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "comparison-report.docx"
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 6) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const getDeltaDisplay = (delta: number) => {
    if (delta > 0) {
      return {
        icon: <TrendingUp className="h-4 w-4" />,
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        text: `+${delta.toFixed(1)}`,
      }
    } else if (delta < 0) {
      return {
        icon: <TrendingDown className="h-4 w-4" />,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        text: delta.toFixed(1),
      }
    } else {
      return {
        icon: <Minus className="h-4 w-4" />,
        color: "text-slate-500",
        bg: "bg-slate-50",
        border: "border-slate-200",
        text: "0.0",
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-full">
              <GitCompare className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Compare Writing Versions
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Compare two versions of your writing to see improvements and changes across all scoring dimensions
          </p>
        </div>

        {/* Input Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Text Comparison
            </CardTitle>
            <CardDescription>Enter your original text and revised version to see detailed comparison</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Version A */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-slate-50 text-slate-700">
                    Version A
                  </Badge>
                  <span className="text-sm text-slate-500">Original</span>
                </div>
                <Textarea
                  className="min-h-[200px] resize-none border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Paste your original text here..."
                  value={textA}
                  onChange={(e) => setTextA(e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  {textA.length} characters • {textA.split(/\s+/).filter((word) => word.length > 0).length} words
                </p>
              </div>

              {/* Arrow indicator */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <ArrowRight className="h-6 w-6 text-slate-400" />
                  <span className="text-xs text-slate-500">Compare</span>
                </div>
              </div>

              {/* Version B */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Version B
                  </Badge>
                  <span className="text-sm text-slate-500">Revised</span>
                </div>
                <Textarea
                  className="min-h-[200px] resize-none border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Paste your revised text here..."
                  value={textB}
                  onChange={(e) => setTextB(e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  {textB.length} characters • {textB.split(/\s+/).filter((word) => word.length > 0).length} words
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleCompare}
                disabled={loading || !textA.trim() || !textB.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Comparing...
                  </>
                ) : (
                  <>
                    <GitCompare className="mr-2 h-4 w-4" />
                    Compare Versions
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-slate-700">
                    {Object.values(result.versionA).reduce((sum: number, item: any) => sum + item.score, 0) /
                      Object.keys(result.versionA).length}
                  </div>
                  <p className="text-sm text-slate-500">Version A Average</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {Object.values(result.versionB).reduce((sum: number, item: any) => sum + item.score, 0) /
                      Object.keys(result.versionB).length}
                  </div>
                  <p className="text-sm text-slate-500">Version B Average</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardContent className="pt-6 text-center">
                  <div
                    className={`text-2xl font-bold ${
                      Object.values(result.deltas).reduce((sum: number, delta: any) => sum + delta, 0) > 0
                        ? "text-green-600"
                        : Object.values(result.deltas).reduce((sum: number, delta: any) => sum + delta, 0) < 0
                          ? "text-red-600"
                          : "text-slate-500"
                    }`}
                  >
                    {Object.values(result.deltas).reduce((sum: number, delta: any) => sum + delta, 0) > 0 ? "+" : ""}
                    {(
                      Object.values(result.deltas).reduce((sum: number, delta: any) => sum + delta, 0) /
                      Object.keys(result.deltas).length
                    ).toFixed(1)}
                  </div>
                  <p className="text-sm text-slate-500">Average Change</p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Comparison */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Detailed Comparison</CardTitle>
                <CardDescription>Score breakdown and changes across all writing dimensions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.keys(result.deltas).map((category, index) => {
                    const deltaInfo = getDeltaDisplay(result.deltas[category])
                    return (
                      <div key={category}>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                          <div className="md:col-span-1">
                            <h4 className="font-semibold text-slate-900 capitalize">
                              {category.replace(/([A-Z])/g, " $1").trim()}
                            </h4>
                          </div>

                          <div className="text-center">
                            <Badge variant="outline" className={getScoreColor(result.versionA[category].score)}>
                              {result.versionA[category].score}
                            </Badge>
                            <p className="text-xs text-slate-500 mt-1">Version A</p>
                          </div>

                          <div className="flex justify-center">
                            <ArrowRight className="h-4 w-4 text-slate-400" />
                          </div>

                          <div className="text-center">
                            <Badge variant="outline" className={getScoreColor(result.versionB[category].score)}>
                              {result.versionB[category].score}
                            </Badge>
                            <p className="text-xs text-slate-500 mt-1">Version B</p>
                          </div>

                          <div className="text-center">
                            <div
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${deltaInfo.bg} ${deltaInfo.color} ${deltaInfo.border} border`}
                            >
                              {deltaInfo.icon}
                              {deltaInfo.text}
                            </div>
                          </div>
                        </div>
                        {index < Object.keys(result.deltas).length - 1 && <Separator className="mt-4" />}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Export Section */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-emerald-600" />
                  Export Comparison Report
                </CardTitle>
                <CardDescription>Download your comparison analysis in your preferred format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleExportPdf}
                    disabled={exporting}
                    variant="outline"
                    className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                  >
                    {exporting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FileDown className="mr-2 h-4 w-4" />
                    )}
                    Download PDF
                  </Button>
                  <Button
                    onClick={handleExportDocx}
                    disabled={exporting}
                    variant="outline"
                    className="flex-1 border-violet-200 text-violet-700 hover:bg-violet-50"
                  >
                    {exporting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FileDown className="mr-2 h-4 w-4" />
                    )}
                    Download DOCX
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
