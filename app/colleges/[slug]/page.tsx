import SaveCollegeButton from "../../components/SaveCollegeButton";
import Link from "next/link";
import colleges from "../../data/colleges.json";

type PageProps = {
  params: {
    slug: string;
  };
};

export default function CollegeDetailsPage({ params }: PageProps) {
  const college = colleges.find((item) => item.slug === params.slug);

  if (!college) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          College not found
        </h1>

        <Link
          href="/colleges"
          className="mt-6 inline-block rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white"
        >
          Back to Colleges
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/colleges" className="text-sm font-semibold text-blue-700">
        ← Back to Colleges
      </Link>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-semibold text-orange-600">
          {college.type}
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
          {college.name}
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          {college.city}, {college.state}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-blue-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-500">NIRF Rank</p>
            <p className="text-2xl font-bold text-blue-700">
              #{college.nirfRank}
            </p>
          </div>

          <div className="rounded-xl bg-orange-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-500">Annual Fees</p>
            <p className="text-2xl font-bold text-orange-600">
              ₹{college.fees.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl bg-green-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-500">College Type</p>
            <p className="text-2xl font-bold text-green-700">
              {college.type}
            </p>
          </div>
        </div>
<div className="mt-8">
  <h2 className="text-2xl font-bold">
    About {college.shortName}
  </h2>

  <p className="mt-3 text-slate-600 dark:text-slate-400">
    {college.name} is one of India'&apos;s leading engineering institutions.
    Located in {college.city}, {college.state}, this {college.type}
    institution is recognized for academic excellence, research,
    placements, and industry collaborations.
  </p>
</div>

<div className="mt-8">
  <h2 className="text-2xl font-bold">
    Popular Courses
  </h2>

  <ul className="mt-3 list-disc pl-6">
    <li>Computer Science Engineering</li>
    <li>Electronics Engineering</li>
    <li>Mechanical Engineering</li>
    <li>Civil Engineering</li>
    <li>Artificial Intelligence</li>
  </ul>
</div>
        <a
          href={college.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Visit Official Website
        </a>
        <SaveCollegeButton
  collegeName={college.name}
  collegeSlug={college.slug}
/>
      </section>
    </main>
  );
}