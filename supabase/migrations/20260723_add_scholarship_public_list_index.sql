-- Speeds up the public Scholarships list ordered by application deadline.
-- Safe: this only adds an index. It does not change or delete data.

create index if not exists scholarships_published_application_end_idx
  on public.scholarships (application_end asc nulls last)
  where status = 'published';