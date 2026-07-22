-- Speeds up public published-exam list and detail queries.
-- Safe: does not change or delete any exam data.

create index if not exists exams_status_slug_idx
  on public.exams (status, slug);

create index if not exists exams_status_exam_name_idx
  on public.exams (status, exam_name);