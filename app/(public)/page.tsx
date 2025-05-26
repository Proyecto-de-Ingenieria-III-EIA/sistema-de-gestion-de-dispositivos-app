import Header from "../components/Header"
import Hero from "../components/Hero"
import Features from "../components/Features"
import Testimonials from "../components/Testimonials"
import Pricing from "../components/Pricing"
import CTA from "../components/CTA"
import Footer from "../components/Footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <Hero 
          title="Device Management & Loan System"
          subtitle="Streamline your organization's device management, loans, and support with our comprehensive solution"
          ctaText="Get Started"
          ctaLink="/auth/signin"
        />
        <Features 
          features={[
            {
              title: "Device Management",
              description: "Track and manage laptops, PCs, mobiles, and tablets with detailed inventory control",
              icon: "D"
            },
            {
              title: "Loan System",
              description: "Efficiently manage device and peripheral loans with automated approval workflows",
              icon: "L"
            },
            {
              title: "Support Tickets",
              description: "Create and track support tickets for device maintenance and technical issues",
              icon: "T"
            },
            {
              title: "Role-Based Access",
              description: "Secure access control with different permissions for admins, clients, and technical staff",
              icon: "S"
            }
          ]}
        />
        <Testimonials 
          testimonials={[
            {
              quote: "The device management system has revolutionized how we track and manage our IT assets.",
              author: "IT Manager",
              role: "Enterprise Client"
            },
            {
              quote: "The loan system makes it easy to manage device assignments and returns.",
              author: "Operations Director",
              role: "Educational Institution"
            },
            {
              quote: "Support ticket management has improved our response time and user satisfaction.",
              author: "Technical Lead",
              role: "Technology Company"
            }
          ]}
        />
        <Pricing 
          plans={[
            {
              name: "Basic",
              price: "Free",
              features: [
                "Up to 50 devices",
                "Basic loan management",
                "Email support",
                "Standard reporting"
              ]
            },
            {
              name: "Professional",
              price: "$99/month",
              features: [
                "Up to 500 devices",
                "Advanced loan management",
                "Priority support",
                "Custom reporting",
                "API access"
              ]
            },
            {
              name: "Enterprise",
              price: "Custom",
              features: [
                "Unlimited devices",
                "Full loan management",
                "24/7 support",
                "Advanced analytics",
                "Custom integrations",
                "Dedicated account manager"
              ]
            }
          ]}
        />
        <CTA 
          title="Ready to streamline your device management?"
          description="Join organizations that trust our platform for their device management needs"
          ctaText="Start Free Trial"
          ctaLink="/auth/signin"
        />
      </main>
      <Footer />
    </div>
  )
}

