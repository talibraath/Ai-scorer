"use client"

import type React from "react"

import { useState, useRef } from "react"
import axios from "axios"
import * as mammoth from "mammoth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Download,
  Loader2,
  BarChart3,
  Upload,
  FileType,
  FileIcon as FilePdf,
  FileTextIcon,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Home() {
  const [text, setText] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("paste")
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setUploadProgress(10)
    const ext = file.name.split(".").pop()?.toLowerCase()

    try {
      if (ext === "txt") {
        setUploadProgress(30)
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          setText(content)
          setUploadProgress(100)
          setTimeout(() => setUploadProgress(0), 1000)
        }
        reader.readAsText(file)
      } else if (ext === "docx") {
        setUploadProgress(30)
        const arrayBuffer = await file.arrayBuffer()
        setUploadProgress(60)
        const result = await mammoth.extractRawText({ arrayBuffer })
        setText(result.value)
        setUploadProgress(100)
        setTimeout(() => setUploadProgress(0), 1000)
      } else if (ext === "pdf") {
        setUploadProgress(30)
        const arrayBuffer = await file.arrayBuffer()
        setUploadProgress(50)

        // Dynamically import pdf processor (only runs on client)
        const { extractTextFromPDF } = await import("@/app/utils/pdfProcessor")
        const text = await extractTextFromPDF(arrayBuffer)
        setText(text)

        setUploadProgress(100)
        setTimeout(() => setUploadProgress(0), 1000)
      } else {
        alert("Unsupported file type. Please upload a .txt, .pdf, or .docx file.")
        setFileName(null)
        setUploadProgress(0)
      }
    } catch (error) {
      console.error("Error processing file:", error)
      alert("Error processing file. Please try again.")
      setFileName(null)
      setUploadProgress(0)
    }
  }

  async function handleScore() {
    if (!text.trim()) return alert("Please enter or upload some text.")
    setLoading(true)
    try {
      const res = await axios.post("/api/score", { text })
      setResult(res.data)
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } catch (err: any) {
      console.error("Error scoring:", err.message)
      alert(err.message)
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

    const getScoreIcon = (score: number) => {
      if (score >= 8) return <CheckCircle className="h-5 w-5 text-green-600" />
      if (score >= 6) return <Info className="h-5 w-5 text-yellow-600" />
      return <AlertCircle className="h-5 w-5 text-red-600" />
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
        <div className="max-w-6xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="text-center space-y-6 pt-10">
            <div className="inline-flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600">
              <div className="bg-white p-3 rounded-full">
                <BarChart3 className="h-10 w-10 text-emerald-600" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-emerald-800 to-slate-800 bg-clip-text text-transparent">
                AI Writing Scorer
              </h1>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Get detailed feedback on your writing with AI-powered analysis across multiple dimensions
              </p>
            </div>
          </div>

          {/* Input Section */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <FileText className="h-5 w-5 text-emerald-600" />
                Submit Your Text
              </CardTitle>
              <CardDescription>Analyze your writing for detailed feedback and scoring</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger
                    value="paste"
                    className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Paste Text
                  </TabsTrigger>
                  <TabsTrigger
                    value="upload"
                    className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="paste" className="space-y-4">
                  <Textarea
                    className="min-h-[250px] resize-none border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-base"
                    placeholder="Paste your text here for analysis..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <div>
                      {text.length} characters • {text.split(/\s+/).filter((word) => word.length > 0).length} words
                    </div>
                    {text.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={() => setText("")}>
                        Clear
                      </Button>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="space-y-6">
                  <div
                    className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      accept=".txt,.docx,.pdf"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-emerald-50 rounded-full">
                        <Upload className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">Click to upload or drag and drop</p>
                        <p className="text-sm text-slate-500">Support for TXT, PDF, and DOCX files</p>
                      </div>
                    </div>
                  </div>

                  {uploadProgress > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getFileIcon(fileName)}
                          <span className="text-sm font-medium text-slate-700">{fileName}</span>
                        </div>
                        <span className="text-xs text-slate-500">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-1" />
                    </div>
                  )}

                  {fileName && uploadProgress === 0 && (
                    <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                      <div className="flex items-center gap-2">
                        {getFileIcon(fileName)}
                        <span className="text-sm font-medium text-slate-700">{fileName}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setFileName(null)}>
                        Remove
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {text && (
                <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle>Ready for analysis</AlertTitle>
                  <AlertDescription>
                    Your text is ready to be analyzed. Click the button below to get detailed feedback.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleScore}
                  disabled={loading || !text.trim()}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Analyze Writing
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <div id="results" className="space-y-8 pt-4">
              {/* Overall Score Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-xl border-0 bg-white/90 backdrop-blur rounded-xl overflow-hidden md:col-span-3">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-8 md:w-1/3 flex flex-col justify-center items-center">
                        <h3 className="text-xl font-medium text-emerald-100 mb-2">Overall Score</h3>
                        <div className="text-8xl font-bold">{result.average}</div>
                        <div className="text-emerald-100 mt-2">out of 10</div>
                      </div>
                      <div className="p-8 md:w-2/3">
                        <h3 className="text-xl font-semibold text-slate-800 mb-4">Analysis Summary</h3>
                        <p className="text-slate-600 leading-relaxed">
                          Your writing has been analyzed across multiple dimensions. The overall score reflects the
                          average of all categories. See the detailed breakdown below for specific feedback in each area.
                        </p>
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <div className="text-sm text-slate-500">Words</div>
                            <div className="text-xl font-semibold text-slate-800">
                              {text.split(/\s+/).filter((word) => word.length > 0).length}
                            </div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <div className="text-sm text-slate-500">Characters</div>
                            <div className="text-xl font-semibold text-slate-800">{text.length}</div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <div className="text-sm text-slate-500">Categories</div>
                            <div className="text-xl font-semibold text-slate-800">
                              {Object.keys(result.scores).length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Analysis */}
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-emerald-600" />
                    Detailed Analysis
                  </CardTitle>
                  <CardDescription>Breakdown of scores across different writing dimensions</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    {Object.entries(result.scores).map(([category, data]: any, index) => (
                      <div key={category} className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="md:w-1/4">
                            <div className="flex items-center gap-3">
                              {getScoreIcon(data.score)}
                              <h4 className="font-semibold text-slate-900 capitalize text-lg">
                                {category.replace(/([A-Z])/g, " $1").trim()}
                              </h4>
                            </div>
                            <div className="mt-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(
                                        data.score,
                                      )}`}
                                    >
                                      Score: {data.score}/10
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">
                                      {data.score >= 8 ? "Excellent" : data.score >= 6 ? "Good" : "Needs improvement"}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                          <div className="md:w-3/4">
                            <p className="text-slate-700 leading-relaxed">{data.explanation}</p>
                            {data.score < 7 && (
                              <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-amber-800 font-medium mb-1">
                                  <Sparkles className="h-4 w-4 text-amber-600" />
                                  Improvement Suggestion
                                </div>
                                <p className="text-sm text-amber-700">
                                  Consider revising this aspect of your writing to improve clarity and effectiveness.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Export Section */}
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-emerald-600" />
                    Export Report
                  </CardTitle>
                  <CardDescription>Download your analysis report in your preferred format</CardDescription>
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
