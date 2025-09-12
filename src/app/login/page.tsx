import { redirect } from 'next/navigation'

// Route alias - redirect /login to /(auth)/login
export default function LoginPage() {
  redirect('/(auth)/login')
}