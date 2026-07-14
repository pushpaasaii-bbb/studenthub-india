import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600;

type SitemapRecord = {
  slug: string;
  created_at: string | null;
  updated_at: string | null;
};

const PAGE_FETCH_SIZE = 1000;

const getBaseUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    ""
  );

const getLastModified = (record: SitemapRecord) =>
  new Date(record.updated_at || record.created_at || new Date().toISOString());

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/colleges`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/exams`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/jobs-v2`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/schools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/scholarships`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return staticPages;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const getPublishedRecords = async (
    tableName: string
  ): Promise<SitemapRecord[]> => {
    const records: SitemapRecord[] = [];
    let from = 0;

    while (true) {
      const { data, error } = await supabase
        .from(tableName)
        .select("slug, created_at, updated_at")
        .eq("status", "published")
        .order("id", { ascending: true })
        .range(from, from + PAGE_FETCH_SIZE - 1);

      if (error) {
        console.error(
          `Could not create sitemap entries for ${tableName}:`,
          error
        );
        return records;
      }

      const batch = (data || []) as SitemapRecord[];
      records.push(...batch);

      if (batch.length < PAGE_FETCH_SIZE) {
        break;
      }

      from += PAGE_FETCH_SIZE;
    }

    return records;
  };

  const [colleges, exams, jobs, schools, scholarships, careers] =
    await Promise.all([
      getPublishedRecords("colleges"),
      getPublishedRecords("exams"),
      getPublishedRecords("jobs_v2"),
      getPublishedRecords("schools"),
      getPublishedRecords("scholarships"),
      getPublishedRecords("careers"),
    ]);

  const collegePages: MetadataRoute.Sitemap = colleges.map((college) => ({
    url: `${baseUrl}/colleges/${college.slug}`,
    lastModified: getLastModified(college),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const examPages: MetadataRoute.Sitemap = exams.map((exam) => ({
    url: `${baseUrl}/exams/${exam.slug}`,
    lastModified: getLastModified(exam),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const jobPages: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${baseUrl}/jobs-v2/${job.slug}`,
    lastModified: getLastModified(job),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const schoolPages: MetadataRoute.Sitemap = schools.map((school) => ({
    url: `${baseUrl}/schools/${school.slug}`,
    lastModified: getLastModified(school),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const scholarshipPages: MetadataRoute.Sitemap = scholarships.map(
    (scholarship) => ({
      url: `${baseUrl}/scholarships/${scholarship.slug}`,
      lastModified: getLastModified(scholarship),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  const careerPages: MetadataRoute.Sitemap = careers.map((career) => ({
    url: `${baseUrl}/careers/${career.slug}`,
    lastModified: getLastModified(career),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...collegePages,
    ...examPages,
    ...jobPages,
    ...schoolPages,
    ...scholarshipPages,
    ...careerPages,
  ];
}