"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/atomic-design/atoms"
import { motion } from "framer-motion"

interface Plan {
  name: string;
  price: string;
  features: string[];
}

interface PricingProps {
  plans: Plan[];
}

export default function Pricing({ plans }: PricingProps) {
  return (
    <div className="bg-background py-16 sm:py-24 relative overflow-hidden" id="pricing">
      {/* Add background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary-light rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary-light rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -45, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-xl text-muted-foreground">Choose the plan that&apos;s right for your organization</p>
        </motion.div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className="border border-border rounded-lg shadow-sm divide-y divide-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)" }}
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-foreground">{plan.name}</h3>
                <p className="mt-4 text-3xl font-extrabold text-foreground">{plan.price}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.name === "Enterprise" ? "Contact us for pricing" : "per month"}
                </p>
                <Button className="mt-6 w-full">{plan.name === "Enterprise" ? "Contact sales" : "Get started"}</Button>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h4 className="text-sm font-medium text-foreground tracking-wide uppercase">What&apos;s included</h4>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" aria-hidden="true" />
                      </div>
                      <p className="ml-3 text-sm text-muted-foreground">{feature}</p>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground">Don&apos;t need all the features? Start with basic.</p>
                <p className="text-sm text-muted-foreground">Need more power? We&apos;ve got you covered.</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

