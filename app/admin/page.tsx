import { redirect } from 'next/navigation'

export default function AdminPage() {
  // Redirigir automáticamente a la página de login
  redirect('/admin/login')
} 