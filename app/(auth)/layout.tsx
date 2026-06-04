// Auth pages không cần Header/Footer — layout tối giản
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
