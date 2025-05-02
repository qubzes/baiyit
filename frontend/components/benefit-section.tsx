import { Zap, ShieldCheck, Truck, RotateCcw } from "lucide-react"

export function BenefitSection() {
  const benefits = [
    {
      icon: Zap,
      title: "AI-Powered Shopping",
      description: "Get personalized recommendations and assistance from our AI shopping assistant.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      description: "All transactions are encrypted and secured with the latest technology.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Free shipping on orders over $50 with quick and reliable delivery.",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "30-day hassle-free return policy on all purchases.",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {benefits.map((benefit, index) => (
        <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 rounded-full bg-accent-sky/10 flex items-center justify-center mx-auto mb-4">
            <benefit.icon className="h-6 w-6 text-accent-sky" />
          </div>
          <h3 className="text-lg font-medium text-primary-navy mb-2">{benefit.title}</h3>
          <p className="text-gray-600 text-sm">{benefit.description}</p>
        </div>
      ))}
    </div>
  )
}
