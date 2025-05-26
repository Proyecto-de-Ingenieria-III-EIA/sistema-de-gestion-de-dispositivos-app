"use client"

import { Button } from "@/components/atomic-design/atoms"
import { motion } from "framer-motion"
import Link from "next/link"

interface CTAProps {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

export default function CTA({ title, description, ctaText, ctaLink }: CTAProps) {
  return (
    <div className="bg-primary">
      <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl font-extrabold text-primary-foreground sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="mt-4 text-lg leading-6 text-primary-foreground/90"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link href={ctaLink}>
          <Button size="lg" variant="secondary" className="mt-8 bg-background text-primary hover:bg-secondary/90">
              {ctaText}
          </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

