export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        Disclaimer
      </h1>

      <div className="mt-8 space-y-6 text-slate-700 dark:text-slate-300">
        <p>
          StudentHub India provides educational information for students. The
          information on this website is for general guidance only.
        </p>

        <h2 className="text-2xl font-bold">No Official Affiliation</h2>
        <p>
          StudentHub India is not officially affiliated with any college, exam
          authority, scholarship provider or government department unless clearly
          mentioned.
        </p>

        <h2 className="text-2xl font-bold">Verify Official Sources</h2>
        <p>
          Students should always verify admission, exam, fee, scholarship and job
          details from the official websites before making decisions.
        </p>

        <h2 className="text-2xl font-bold">No Guarantee</h2>
        <p>
          We do not guarantee admission, job selection, scholarship approval or
          exam success.
        </p>
      </div>
    </main>
  );
}