-- Adds verified official sources and publishes three source-backed schools.
-- Each source URL is the school’s official website.

update public.schools
set
  source_name = case slug
    when 'delhi-public-school-rk-puram'
      then 'Delhi Public School R. K. Puram'
    when 'kendriya-vidyalaya-iit-madras'
      then 'Kendriya Vidyalaya IIT Chennai'
    when 'hyderabad-public-school-begumpet'
      then 'The Hyderabad Public School, Begumpet'
  end,
  source_url = case slug
    when 'delhi-public-school-rk-puram'
      then 'https://dpsrkp.net/'
    when 'kendriya-vidyalaya-iit-madras'
      then 'https://chennaiiit.kvs.ac.in/en/'
    when 'hyderabad-public-school-begumpet'
      then 'https://www.hpsbegumpet.org.in/'
  end,
  website = case slug
    when 'kendriya-vidyalaya-iit-madras'
      then 'https://chennaiiit.kvs.ac.in/en/'
    else website
  end,
  last_verified_at = now(),
  verification_status = 'verified',
  status = 'published'
where slug in (
  'delhi-public-school-rk-puram',
  'kendriya-vidyalaya-iit-madras',
  'hyderabad-public-school-begumpet'
);