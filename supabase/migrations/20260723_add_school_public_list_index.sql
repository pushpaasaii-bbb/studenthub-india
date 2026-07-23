-- Speeds up the public Schools list ordered by school name.
-- Safe: this only adds an index. It does not change or delete data.

create index if not exists schools_published_name_idx
  on public.schools (name asc)
  where status = 'published';