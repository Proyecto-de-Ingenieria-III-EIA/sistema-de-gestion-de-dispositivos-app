export const metadata = {
  title: 'Login',
  description: 'Login to your account',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {children}
    </div>
  )
}
