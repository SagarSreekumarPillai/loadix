import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            🚀 AI-Powered Logistics Platform
          </Badge>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Streamline EU Logistics with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}AI Intelligence
            </span>
          </h1>
          <p className="mb-8 text-xl text-slate-600">
            Optimize end-to-end supply chains with AI-driven insights, route optimization, 
            and EU compliance automation. Reduce costs, improve efficiency, and stay ahead of regulations.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900">
              Intelligent Logistics Solutions
            </h2>
            <p className="text-lg text-slate-600">
              Built specifically for EU market challenges and compliance requirements
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="mb-2 text-2xl">🤖</div>
                <CardTitle>AI-Powered Forecasting</CardTitle>
                <CardDescription>
                  Predict demand patterns and optimize capacity planning with machine learning
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="mb-2 text-2xl">🗺️</div>
                <CardTitle>Smart Route Optimization</CardTitle>
                <CardDescription>
                  AI-driven routes considering traffic, fuel costs, and EU emissions regulations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="mb-2 text-2xl">📋</div>
                <CardTitle>EU Compliance Automation</CardTitle>
                <CardDescription>
                  Automated customs documentation and regulatory compliance checks
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="mb-2 text-2xl">📊</div>
                <CardTitle>Real-Time Analytics</CardTitle>
                <CardDescription>
                  Live tracking, performance metrics, and operational insights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="mb-2 text-2xl">🌱</div>
                <CardTitle>CO₂ Footprint Tracking</CardTitle>
                <CardDescription>
                  Monitor and optimize emissions for Fit for 55 compliance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="mb-2 text-2xl">🔗</div>
                <CardTitle>Carrier Integration</CardTitle>
                <CardDescription>
                  Connect with fragmented EU carrier networks seamlessly
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-slate-900">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Ready to Transform Your Logistics?
          </h2>
          <p className="mb-8 text-lg text-slate-300">
            Join leading EU logistics companies already using Lodix to optimize their operations
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Start Free Trial
          </Button>
        </div>
      </section>
    </div>
  )
}
