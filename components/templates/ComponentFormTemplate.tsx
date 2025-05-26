import { ComponentForm } from "@/components/atomic-design/organisms/ComponentForm"


export default function ComponentFormTemplate() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-24 px-4 sm:px-6 lg:px-8 bg-secondary/20">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Component Registration</h1>
            <p className="text-muted-foreground">Register your component in our system</p>
          </div>
          <ComponentForm />
        </div>
      </main>
    </div>
  )
}
