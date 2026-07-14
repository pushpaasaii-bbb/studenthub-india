type AdminButtonProps = {
  children: React.ReactNode;
};

export default function AdminButton({ children }: AdminButtonProps) {
  return (
    <button className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800">
      {children}
    </button>
  );
}