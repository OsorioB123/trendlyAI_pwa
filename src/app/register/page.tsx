import { redirect } from 'next/navigation'

// Route alias - redirect /register to /(auth)/register
export default function RegisterPage() {
  redirect('/(auth)/register')
}