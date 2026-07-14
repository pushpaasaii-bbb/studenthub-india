type AdminCardProps = {
  children: React.ReactNode;
};

export default function AdminCard({ children }: AdminCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      {children}
    </div>
  );
}