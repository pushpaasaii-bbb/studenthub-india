import CollegeCard from "../components/CollegeCard";

const colleges = [
  {
    id: 1,
    name: "Indian Institute of Technology Bombay",
    slug: "iit-bombay",
    city: "Mumbai",
    state: "Maharashtra",
    type: "IIT",
    nirfRank: 3,
    fees: 230000,
  },
  {
    id: 2,
    name: "Indian Institute of Technology Delhi",
    slug: "iit-delhi",
    city: "New Delhi",
    state: "Delhi",
    type: "IIT",
    nirfRank: 2,
    fees: 225000,
  },
  {
    id: 3,
    name: "Indian Institute of Technology Madras",
    slug: "iit-madras",
    city: "Chennai",
    state: "Tamil Nadu",
    type: "IIT",
    nirfRank: 1,
    fees: 220000,
  },
];
export default function CollegesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          All India Engineering Colleges
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Explore IITs, NITs, State Universities and Private Engineering Colleges
          across India.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {colleges.map((college: (typeof colleges)[number]) => (
          <CollegeCard
            key={college.id}
            name={college.name}
            slug={college.slug}
            location={`${college.city}, ${college.state}`}
            type={college.type}
            nirfRank={college.nirfRank}
            fees={`₹${college.fees.toLocaleString()}`}
          />
        ))}
      </div>
    </main>
  );
}