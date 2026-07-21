import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-5">
          <div>
            <h2 className="text-xl font-bold text-blue-700">
              StudentHub India
            </h2>

            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Your complete student guide for colleges, exams, jobs,
              scholarships and useful student tools.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Colleges
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/colleges">All Colleges</Link>
              </li>
              <li>
                <Link href="/colleges?type=engineering">
                  Engineering Colleges
                </Link>
              </li>
              <li>
                <Link href="/colleges?state=andhra-pradesh">
                  AP Colleges
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Exams
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/exams">All Exams</Link>
              </li>
              <li>
                <Link href="/exams/ap-eamcet">AP EAMCET</Link>
              </li>
              <li>
                <Link href="/exams/ts-eamcet">TS EAMCET</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Tools
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/tools/cgpa-calculator">CGPA Calculator</Link>
              </li>
              <li>
                <Link href="/tools/attendance-calculator">
                  Attendance Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/college-predictor">
                  College Predictor
                </Link>
              </li>
              <li>
                <Link href="/compare">Compare Colleges</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Company
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/verification-policy">Verification Policy</Link>
              </li>
              <li>
                <Link href="/sources-policy">Sources Policy</Link>
              </li>
              <li>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-and-conditions">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/disclaimer">Disclaimer</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-5 text-center text-sm text-slate-500 dark:border-slate-800">
          © {currentYear} StudentHub India. All rights reserved.
        </div>
      </div>
    </footer>
  );
}