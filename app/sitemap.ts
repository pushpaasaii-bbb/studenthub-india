import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://studenthubindia.com";

  return [
    {
  url: `${baseUrl}/blog`,
  lastModified: new Date(),
  changeFrequency: "daily",
  priority: 0.9,
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
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
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
      url: `${baseUrl}/study-materials`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}  
