export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        About StudentHub India
      </h1>

      <div className="mt-8 space-y-6 text-slate-700 dark:text-slate-300">
        <p>
          StudentHub India is an educational platform created to help students
          across India make informed decisions about colleges, entrance exams,
          scholarships, jobs and career opportunities.
        </p>

        <h2 className="text-2xl font-bold">Our Mission</h2>
        <p>
          Our mission is to provide students with reliable, easy-to-understand
          and accessible information in one place.
        </p>

        <h2 className="text-2xl font-bold">What We Provide</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>College information and rankings</li>
          <li>Entrance exam guidance</li>
          <li>Scholarship opportunities</li>
          <li>Government job updates</li>
          <li>Student calculators and tools</li>
          <li>Educational blogs and resources</li>
        </ul>

        <h2 className="text-2xl font-bold">Our Vision</h2>
        <p>
          We aim to become one of India&apos;s most trusted student information and
          career guidance platforms.
        </p>
      </div>
    </main>
  );
}