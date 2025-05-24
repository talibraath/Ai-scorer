"use client"

import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Download, Loader2, BarChart3, FileDown } from "lucide-react"

export default function Home() {
  const [text, setText] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)

  async function handleScore() {
    if (!text.trim()) return alert("Please enter some text.")
    setLoading(true)
    try {
      const res = await axios.post("/api/score", { text })
      setResult(res.data)
    } catch (err) {
        console.error(err);

    }
    setLoading(false)
  }

  async function handleExport(type: "pdf" | "docx") {
    if (!result) return
    setExporting(true)

    const res = await fetch(`/api/export/${type}`, {
      method: "POST",
      body: JSON.stringify({
        scores: result.scores,
        average: result.average,
        rewritePrompt: result.rewritePrompt || "N/A",
        metadata: {
          sectionId: "Draft-001",
          version: "v1.0",
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    setExporting(false)

    if (!res.ok) {
      alert(`Failed to generate ${type.toUpperCase()}.`)
      return
    }

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `scoring-report.${type}`
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

  const getAverageColor = (average: number) => {
    if (average >= 8) return "text-green-600"
    if (average >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-full">
              <BarChart3 className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              AI Writing Scorer
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get detailed feedback on your writing with AI-powered analysis across multiple dimensions
          </p>
        </div>

        {/* Input Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Submit Your Text
            </CardTitle>
            <CardDescription>Paste your writing below to receive comprehensive scoring and feedback</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              className="min-h-[200px] resize-none border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
              placeholder="Paste your text here for analysis..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {text.length} characters • {text.split(/\s+/).filter((word) => word.length > 0).length} words
              </p>
              <Button
                onClick={handleScore}
                disabled={loading || !text.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analyze Writing
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Average Score Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium text-slate-700">Overall Score</h3>
                  <div className={`text-6xl font-bold ${getAverageColor(result.average)}`}>{result.average}</div>
                  <p className="text-slate-500">out of 10</p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Scores */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Detailed Analysis</CardTitle>
                <CardDescription>Breakdown of scores across different writing dimensions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(result.scores).map(([category, data]: any, index) => (
                    <div key={category}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-slate-900 capitalize">
                              {category.replace(/([A-Z])/g, " $1").trim()}
                            </h4>
                            <Badge variant="outline" className={`${getScoreColor(data.score)} font-semibold`}>
                              {data.score}/10
                            </Badge>
                          </div>
                          <p className="text-slate-600 leading-relaxed">{data.explanation}</p>
                        </div>
                      </div>
                      {index < Object.entries(result.scores).length - 1 && <Separator className="mt-6" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Export Section */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-emerald-600" />
                  Export Report
                </CardTitle>
                <CardDescription>Download your analysis report in your preferred format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => handleExport("pdf")}
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
                    onClick={() => handleExport("docx")}
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
