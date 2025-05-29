"use client"

import type React from "react"

import { useState, useRef } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Download,
  Loader2,
  GitCompare,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Upload,
  FileType,
  FileIcon as FilePdf,
  FileTextIcon,
  Sparkles,
  AlertCircle,
  Info,
  ArrowRightLeft,
  BarChart3,
} from "lucide-react"
import * as mammoth from "mammoth"
import { PDFDocument } from "pdf-lib"

export default function ComparePage() {
  const [textA, setTextA] = useState("")
  const [textB, setTextB] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [uploadProgressA, setUploadProgressA] = useState(0)
  const [uploadProgressB, setUploadProgressB] = useState(0)
  const [fileNameA, setFileNameA] = useState<string | null>(null)
  const [fileNameB, setFileNameB] = useState<string | null>(null)
  const fileInputRefA = useRef<HTMLInputElement>(null)
  const fileInputRefB = useRef<HTMLInputElement>(null)

  async function extractTextFromFile(file: File, setProgress: (progress: number) => void): Promise<string> {
    const extension = file.name.split(".").pop()?.toLowerCase()
    if (!extension) return ""

    setProgress(10)

    if (extension === "txt") {
      setProgress(30)
      const text = await file.text()
      setProgress(100)
      setTimeout(() => setProgress(0), 1000)
      return text
    }

    if (extension === "docx") {
      setProgress(30)
      const arrayBuffer = await file.arrayBuffer()
      setProgress(60)
      const { value } = await mammoth.extractRawText({ arrayBuffer })
      setProgress(100)
      setTimeout(() => setProgress(0), 1000)
      return value
    }

    if (extension === "pdf") {
      setProgress(30)
      const arrayBuffer = await file.arrayBuffer()
      setProgress(50)
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      setProgress(70)
      const numPages = pdfDoc.getPageCount()
      let text = ""

      for (let i = 0; i < numPages; i++) {
        const page = pdfDoc.getPage(i)
        // Note: pdf-lib doesn't have direct text extraction, this is a placeholder
        // In a real implementation, you'd use a library like pdfjs-dist
        text += `[Content from page ${i + 1}]\n`
        setProgress(70 + Math.floor((i / numPages) * 30))
      }

      setTimeout(() => setProgress(0), 1000)
      return text
    }

    throw new Error("Unsupported file type")
  }

  async function handleFileUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (text: string) => void,
    setFileName: (name: string | null) => void,
    setProgress: (progress: number) => void,
  ) {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    try {
      const extractedText = await extractTextFromFile(file, setProgress)
      setter(extractedText)
    } catch (err) {
      console.error("File read error:", err)
      alert("Failed to read the file. Supported formats: PDF, DOCX, TXT.")
      setFileName(null)
    }
  }

  const handleFileClickA = () => fileInputRefA.current?.click()
  const handleFileClickB = () => fileInputRefB.current?.click()

  async function handleCompare() {
    if (!textA.trim() || !textB.trim()) {
      alert("Please enter text in both fields.")
      return
    }
    setLoading(true)
    try {
      const res = await axios.post("/api/compare", { textA, textB })
      setResult(res.data)
      // Scroll to results
      setTimeout(() => {
        document.getElementById("comparison-results")?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } catch (err) {
      console.error(err)
      alert("Comparison failed.")
    }
    setLoading(false)
  }

  async function handleExport(type: "pdf" | "docx") {
    if (!result) return
    setExporting(true)

    const res = await fetch(`/api/export/${type}`, {
      method: "POST",
      body: JSON.stringify({
        scores: result.versionB,
        average:
          Object.values(result.versionB).reduce((a: number, b: any) => a + b.score, 0) /
          Object.keys(result.versionB).length,
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
    if (!res.ok) return alert(`Failed to generate ${type.toUpperCase()}.`)

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `comparison-report.${type}`
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
        icon: <TrendingUp className="h-5 w-5" />,
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        text: `+${delta.toFixed(1)}`,
      }
    } else if (delta < 0) {
      return {
        icon: <TrendingDown className="h-5 w-5" />,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        text: delta.toFixed(1),
      }
    } else {
      return {
        icon: <Minus className="h-5 w-5" />,
        color: "text-slate-500",
        bg: "bg-slate-50",
        border: "border-slate-200",
        text: "0.0",
      }
    }
  }

  const getFileIcon = (fileName: string | null) => {
    if (!fileName) return <FileType className="h-5 w-5" />
    const ext = fileName.split(".").pop()?.toLowerCase()
    if (ext === "pdf") return <FilePdf className="h-5 w-5 text-red-500" />
    if (ext === "docx") return <FileTextIcon className="h-5 w-5 text-blue-500" />
    return <FileType className="h-5 w-5 text-gray-500" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-emerald-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-6 pt-10">
          <div className="inline-flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600">
            <div className="bg-white p-3 rounded-full">
              <ArrowRightLeft className="h-10 w-10 text-emerald-600" />
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-emerald-800 to-slate-800 bg-clip-text text-transparent">
              Compare Writing Versions
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Compare two versions of your writing to see improvements and changes across all scoring dimensions
            </p>
          </div>
        </div>

        {/* Input Section */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <GitCompare className="h-5 w-5 text-emerald-600" />
              Text Comparison
            </CardTitle>
            <CardDescription>Enter your original text and revised version to see detailed comparison</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Version A */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-slate-50 text-slate-700 px-3 py-1 text-sm">
                    Version A (Original)
                  </Badge>
                  <Tabs defaultValue="paste" className="w-[200px]">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="paste" className="text-xs">
                        Paste
                      </TabsTrigger>
                      <TabsTrigger value="upload" className="text-xs">
                        Upload
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="paste" className="mt-0"></TabsContent>
                    <TabsContent value="upload" className="mt-0">
                      <input
                        type="file"
                        accept=".txt,.docx,.pdf"
                        ref={fileInputRefA}
                        onChange={(e) => handleFileUpload(e, setTextA, setFileNameA, setUploadProgressA)}
                        className="hidden"
                      />
                      <Button variant="outline" size="sm" onClick={handleFileClickA} className="w-full text-xs">
                        <Upload className="h-3 w-3 mr-1" /> Select File
                      </Button>
                    </TabsContent>
                  </Tabs>
                </div>

                <Textarea
                  className="min-h-[250px] resize-none border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Paste your original text here..."
                  value={textA}
                  onChange={(e) => setTextA(e.target.value)}
                />

                {uploadProgressA > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getFileIcon(fileNameA)}
                        <span className="text-sm font-medium text-slate-700">{fileNameA}</span>
                      </div>
                      <span className="text-xs text-slate-500">{uploadProgressA}%</span>
                    </div>
                    <Progress value={uploadProgressA} className="h-1" />
                  </div>
                )}

                {fileNameA && uploadProgressA === 0 && (
                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      {getFileIcon(fileNameA)}
                      <span className="text-sm font-medium text-slate-700">{fileNameA}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFileNameA(null)
                        setTextA("")
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}

                <div className="text-xs text-slate-500">
                  {textA.length} characters • {textA.split(/\s+/).filter((word) => word.length > 0).length} words
                </div>
              </div>

              {/* Version B */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 text-sm"
                  >
                    Version B (Revised)
                  </Badge>
                  <Tabs defaultValue="paste" className="w-[200px]">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="paste" className="text-xs">
                        Paste
                      </TabsTrigger>
                      <TabsTrigger value="upload" className="text-xs">
                        Upload
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="paste" className="mt-0"></TabsContent>
                    <TabsContent value="upload" className="mt-0">
                      <input
                        type="file"
                        accept=".txt,.docx,.pdf"
                        ref={fileInputRefB}
                        onChange={(e) => handleFileUpload(e, setTextB, setFileNameB, setUploadProgressB)}
                        className="hidden"
                      />
                      <Button variant="outline" size="sm" onClick={handleFileClickB} className="w-full text-xs">
                        <Upload className="h-3 w-3 mr-1" /> Select File
                      </Button>
                    </TabsContent>
                  </Tabs>
                </div>

                <Textarea
                  className="min-h-[250px] resize-none border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Paste your revised text here..."
                  value={textB}
                  onChange={(e) => setTextB(e.target.value)}
                />

                {uploadProgressB > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getFileIcon(fileNameB)}
                        <span className="text-sm font-medium text-slate-700">{fileNameB}</span>
                      </div>
                      <span className="text-xs text-slate-500">{uploadProgressB}%</span>
                    </div>
                    <Progress value={uploadProgressB} className="h-1" />
                  </div>
                )}

                {fileNameB && uploadProgressB === 0 && (
                  <div className="flex items-center justify-between bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                    <div className="flex items-center gap-2">
                      {getFileIcon(fileNameB)}
                      <span className="text-sm font-medium text-slate-700">{fileNameB}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFileNameB(null)
                        setTextB("")
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}

                <div className="text-xs text-slate-500">
                  {textB.length} characters • {textB.split(/\s+/).filter((word) => word.length > 0).length} words
                </div>
              </div>
            </div>

            {textA && textB && (
              <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle>Ready for comparison</AlertTitle>
                <AlertDescription>
                  Both texts are ready to be compared. Click the button below to analyze the differences.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleCompare}
                disabled={loading || !textA.trim() || !textB.trim()}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Comparing...
                  </>
                ) : (
                  <>
                    <GitCompare className="mr-2 h-5 w-5" />
                    Compare Versions
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div id="comparison-results" className="space-y-8 pt-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur rounded-xl overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-100 p-4">
                  <CardTitle className="text-center text-base">Version A Average</CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-slate-700">
                    {(
                      Object.values(result.versionA).reduce((sum: number, item: any) => sum + item.score, 0) /
                      Object.keys(result.versionA).length
                    ).toFixed(1)}
                  </div>
                  <p className="text-sm text-slate-500 mt-2">Original Score</p>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur rounded-xl overflow-hidden">
                <CardHeader className="bg-emerald-50 border-b border-emerald-100 p-4">
                  <CardTitle className="text-center text-base">Version B Average</CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-emerald-600">
                    {(
                      Object.values(result.versionB).reduce((sum: number, item: any) => sum + item.score, 0) /
                      Object.keys(result.versionB).length
                    ).toFixed(1)}
                  </div>
                  <p className="text-sm text-slate-500 mt-2">Revised Score</p>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-emerald-50 border-b border-slate-100 p-4">
                  <CardTitle className="text-center text-base">Average Change</CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center">
                  <div
                    className={`text-4xl font-bold ${
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
                  <p className="text-sm text-slate-500 mt-2">Overall Improvement</p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Comparison */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                  Detailed Comparison
                </CardTitle>
                <CardDescription>Score breakdown and changes across all writing dimensions</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {Object.keys(result.deltas).map((category, index) => {
                    const deltaInfo = getDeltaDisplay(result.deltas[category])
                    return (
                      <div key={category} className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="md:w-1/4">
                            <h4 className="font-semibold text-slate-900 capitalize text-lg">
                              {category.replace(/([A-Z])/g, " $1").trim()}
                            </h4>
                            <div className="mt-2">
                              <div
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${deltaInfo.bg} ${deltaInfo.color} ${deltaInfo.border} border`}
                              >
                                {deltaInfo.icon}
                                {deltaInfo.text}
                              </div>
                            </div>
                          </div>
                          <div className="md:w-3/4">
                            <div className="flex flex-col sm:flex-row gap-6 items-center">
                              <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-100 w-full">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-slate-700">Version A</span>
                                  <Badge variant="outline" className={getScoreColor(result.versionA[category].score)}>
                                    {result.versionA[category].score}/10
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-600">{result.versionA[category].explanation}</p>
                              </div>

                              <div className="hidden sm:block">
                                <ArrowRight className="h-6 w-6 text-slate-400" />
                              </div>

                              <div className="flex-1 bg-emerald-50 rounded-lg p-4 border border-emerald-100 w-full">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-emerald-700">Version B</span>
                                  <Badge variant="outline" className={getScoreColor(result.versionB[category].score)}>
                                    {result.versionB[category].score}/10
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-600">{result.versionB[category].explanation}</p>
                              </div>
                            </div>

                            {result.deltas[category] > 0 && (
                              <div className="mt-4 bg-green-50 border border-green-100 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-green-800 font-medium mb-1">
                                  <Sparkles className="h-4 w-4 text-green-600" />
                                  Improvement Detected
                                </div>
                                <p className="text-sm text-green-700">
                                  The revised version shows significant improvement in this category.
                                </p>
                              </div>
                            )}

                            {result.deltas[category] < 0 && (
                              <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-amber-800 font-medium mb-1">
                                  <AlertCircle className="h-4 w-4 text-amber-600" />
                                  Potential Regression
                                </div>
                                <p className="text-sm text-amber-700">
                                  The revised version scored lower in this category. Consider reviewing these changes.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Export Section */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-emerald-600" />
                  Export Comparison Report
                </CardTitle>
                <CardDescription>Download your comparison analysis in your preferred format</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => handleExport("pdf")}
                    disabled={exporting}
                    variant="outline"
                    className="flex-1 border-red-200 text-red-700 hover:bg-red-50 py-6"
                    size="lg"
                  >
                    {exporting ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <FilePdf className="mr-2 h-5 w-5" />
                    )}
                    Download PDF Report
                  </Button>
                  <Button
                    onClick={() => handleExport("docx")}
                    disabled={exporting}
                    variant="outline"
                    className="flex-1 border-violet-200 text-violet-700 hover:bg-violet-50 py-6"
                    size="lg"
                  >
                    {exporting ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <FileTextIcon className="mr-2 h-5 w-5" />
                    )}
                    Download DOCX Report
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
