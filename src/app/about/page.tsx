import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, GitCompare, FileDown, Zap, Target, Users, Brain, Shield, Sparkles, CheckCircle } from "lucide-react"

export default function AboutPage() {
  const features = [
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "AI-Powered Analysis",
      description:
        "Advanced GPT-4 based scoring across multiple writing dimensions including clarity, coherence, and style.",
    },
    {
      icon: <GitCompare className="h-5 w-5" />,
      title: "Version Comparison",
      description:
        "Compare different versions of your writing to track improvements and identify areas for enhancement.",
    },
    {
      icon: <FileDown className="h-5 w-5" />,
      title: "Export Reports",
      description: "Generate professional PDF and DOCX reports with detailed analysis and recommendations.",
    },
    {
      icon: <Target className="h-5 w-5" />,
      title: "Customizable Rubrics",
      description: "Flexible scoring criteria that adapt to different writing styles and requirements.",
    },
  ]

  const benefits = [
    "Instant feedback on writing quality",
    "Objective scoring across multiple dimensions",
    "Track writing improvement over time",
    "Professional report generation",
    "Easy-to-understand explanations",
    "Support for various writing types",
  ]

  const techStack = [
    { name: "Next.js", description: "React framework for production" },
    { name: "GPT-4", description: "Advanced AI language model" },
    { name: "TypeScript", description: "Type-safe JavaScript" },
    { name: "Tailwind CSS", description: "Utility-first CSS framework" },
    { name: "pdf-lib", description: "PDF generation library" },
    { name: "docx", description: "Word document creation" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-full">
              <Brain className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              About AI Writing Scorer
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            An intelligent writing analysis tool that helps writers improve their craft through AI-powered feedback and
            comprehensive scoring across multiple dimensions.
          </p>
        </div>

        {/* Overview */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              What is AI Writing Scorer?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 leading-relaxed">
              AI Writing Scorer is a sophisticated tool that leverages the power of GPT-4 to provide detailed, objective
              analysis of written content. Whether you're a student, professional writer, or content creator, our
              platform helps you understand your writing's strengths and areas for improvement.
            </p>
            <p className="text-slate-700 leading-relaxed">
              The tool evaluates multiple aspects of writing including clarity, coherence, grammar, style, and
              engagement, providing actionable feedback that helps you refine your writing skills over time.
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-emerald-600" />
              Key Features
            </CardTitle>
            <CardDescription>Powerful tools to enhance your writing process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 p-2 bg-emerald-100 rounded-lg text-emerald-600">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              Why Choose AI Writing Scorer?
            </CardTitle>
            <CardDescription>Benefits that make a difference in your writing journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-600" />
              How It Works
            </CardTitle>
            <CardDescription>Simple steps to improve your writing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Submit Your Text</h3>
                  <p className="text-slate-600 text-sm">
                    Paste your writing into our analysis tool or upload a document for evaluation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">AI Analysis</h3>
                  <p className="text-slate-600 text-sm">
                    Our GPT-4 powered engine analyzes your text across multiple writing dimensions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Receive Feedback</h3>
                  <p className="text-slate-600 text-sm">
                    Get detailed scores, explanations, and actionable recommendations for improvement.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Export & Share</h3>
                  <p className="text-slate-600 text-sm">
                    Download professional reports in PDF or DOCX format for your records or sharing.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              Built With Modern Technology
            </CardTitle>
            <CardDescription>Reliable, secure, and performant technology stack</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {techStack.map((tech, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      {tech.name}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{tech.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Ready to Improve Your Writing?</h2>
            <p className="text-emerald-100 mb-4">
              Start analyzing your writing today and see the difference AI-powered feedback can make.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Start Scoring
              </a>
              <a
                href="/compare"
                className="inline-flex items-center justify-center px-6 py-3 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 transition-colors"
              >
                <GitCompare className="mr-2 h-4 w-4" />
                Compare Versions
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
