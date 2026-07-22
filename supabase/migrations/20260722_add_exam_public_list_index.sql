-- Speeds up the public Exams list ordered by exam date.
-- Safe: this only adds an index. It does not change or delete data.

create index if not exists exams_published_exam_date_idx
  on public.exams (exam_date asc nulls last)
  where status = 'published';