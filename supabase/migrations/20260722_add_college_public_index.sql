-- Speeds up the public college list ordered by NIRF rank.
-- Safe: does not change or delete any college data.

create index if not exists colleges_published_nirf_rank_idx
  on public.colleges (nirf_rank asc nulls last)
  where status = 'published';