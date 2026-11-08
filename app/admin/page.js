import AdminApp from '@/components/AdminApp';

export const metadata = { title: 'Panel de administración', robots: { index: false, follow: false } };

export default function AdminPage() {
  return <AdminApp />;
}
