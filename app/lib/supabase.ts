import { createClient } from '@supabase/supabase-js'

// ============================================
// SUPABASE CLIENT SETUP
// These values come from your .env.local file
// ============================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create and export the Supabase client
// This single instance is used across the whole app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================
// TYPE DEFINITIONS
// These match our database table columns exactly
// ============================================

export type College = {
  id: string
  name: string
  slug: string
  state: string
  district: string
  type: 'government' | 'private' | 'deemed' | 'central'
  nirf_rank: number | null
  fees_min: number
  fees_max: number
  website: string | null
  phone: string | null
  address: string
  about: string
  established: number
  naac_grade: string | null
  rating: number
  total_reviews: number
  created_at: string
}

export type CollegeBranch = {
  id: string
  college_id: string
  branch_name: string
  branch_code: string
  total_seats: number
  tuition_fee: number
}

export type Cutoff = {
  id: string
  college_id: string
  branch_id: string
  year: number
  exam_type: 'AP_EAMCET' | 'TS_EAMCET' | 'JEE_MAIN' | 'JEE_ADVANCED'
  category: 'OC' | 'BC_A' | 'BC_B' | 'BC_C' | 'BC_D' | 'BC_E' | 'SC' | 'ST' | 'EWS' | 'OBC'
  opening_rank: number
  closing_rank: number
}

export type Exam = {
  id: string
  name: string
  slug: string
  type: 'entrance' | 'government_job' | 'scholarship'
  conducting_body: string
  state: string | null
  notification_date: string | null
  exam_date: string | null
  last_date: string | null
  about: string
  eligibility: string
  syllabus_url: string | null
  official_url: string | null
}

export type Job = {
  id: string
  title: string
  slug: string
  department: string
  state: string
  qualification: string
  vacancies: number
  last_date: string
  apply_url: string
  posted_on: string
  salary: string
  about: string
}

export type StudyMaterial = {
  id: string
  title: string
  slug: string
  branch: string
  semester: number
  subject: string
  type: 'notes' | 'question_paper' | 'syllabus' | 'formula_sheet'
  file_url: string
  downloads: number
  created_at: string
}

export type Scholarship = {
  id: string
  name: string
  slug: string
  provider: string
  category: string
  income_limit: number | null
  amount: number
  last_date: string
  apply_url: string
  about: string
  eligibility: string
}

export type Review = {
  id: string
  college_id: string
  user_id: string
  rating: number
  review_text: string
  created_at: string
}

// ============================================
// DATABASE QUERY FUNCTIONS
// Ready-to-use functions for every page
// ============================================

// --- COLLEGE FUNCTIONS ---

// Get all colleges with optional filters
export async function getColleges(filters?: {
  state?: string
  type?: string
  branch?: string
  search?: string
  limit?: number
}) {
  let query = supabase
    .from('colleges')
    .select('*')
    .order('nirf_rank', { ascending: true, nullsFirst: false })

  if (filters?.state)  query = query.eq('state', filters.state)
  if (filters?.type)   query = query.eq('type', filters.type)
  if (filters?.search) query = query.ilike('name', `%${filters.search}%`)
  if (filters?.limit)  query = query.limit(filters.limit)

  const { data, error } = await query
  if (error) {
    console.error('Error fetching colleges:', error)
    return []
  }
  return data as College[]
}

// Get single college by slug
export async function getCollegeBySlug(slug: string) {
  const { data, error } = await supabase
    .from('colleges')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching college:', error)
    return null
  }
  return data as College
}

// Get all college slugs (for static page generation)
export async function getAllCollegeSlugs() {
  const { data, error } = await supabase
    .from('colleges')
    .select('slug')

  if (error) return []
  return data.map((c) => c.slug)
}

// Get cutoffs for a college
export async function getCollegeCutoffs(collegeId: string) {
  const { data, error } = await supabase
    .from('cutoffs')
    .select('*, college_branches(branch_name, branch_code)')
    .eq('college_id', collegeId)
    .order('year', { ascending: false })

  if (error) {
    console.error('Error fetching cutoffs:', error)
    return []
  }
  return data
}

// Get branches for a college
export async function getCollegeBranches(collegeId: string) {
  const { data, error } = await supabase
    .from('college_branches')
    .select('*')
    .eq('college_id', collegeId)

  if (error) {
    console.error('Error fetching branches:', error)
    return []
  }
  return data as CollegeBranch[]
}

// --- EXAM FUNCTIONS ---

// Get all exams
export async function getExams(filters?: {
  type?: string
  state?: string
  search?: string
  limit?: number
}) {
  let query = supabase
    .from('exams')
    .select('*')
    .order('exam_date', { ascending: true })

  if (filters?.type)   query = query.eq('type', filters.type)
  if (filters?.state)  query = query.eq('state', filters.state)
  if (filters?.search) query = query.ilike('name', `%${filters.search}%`)
  if (filters?.limit)  query = query.limit(filters.limit)

  const { data, error } = await query
  if (error) {
    console.error('Error fetching exams:', error)
    return []
  }
  return data as Exam[]
}

// Get single exam by slug
export async function getExamBySlug(slug: string) {
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching exam:', error)
    return null
  }
  return data as Exam
}

// --- JOB FUNCTIONS ---

// Get all jobs
export async function getJobs(filters?: {
  state?: string
  department?: string
  search?: string
  limit?: number
}) {
  let query = supabase
    .from('jobs')
    .select('*')
    .order('posted_on', { ascending: false })

  if (filters?.state)      query = query.eq('state', filters.state)
  if (filters?.department) query = query.eq('department', filters.department)
  if (filters?.search)     query = query.ilike('title', `%${filters.search}%`)
  if (filters?.limit)      query = query.limit(filters.limit)

  const { data, error } = await query
  if (error) {
    console.error('Error fetching jobs:', error)
    return []
  }
  return data as Job[]
}

// Get single job by slug
export async function getJobBySlug(slug: string) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching job:', error)
    return null
  }
  return data as Job
}

// --- STUDY MATERIAL FUNCTIONS ---

// Get study materials
export async function getStudyMaterials(filters?: {
  branch?: string
  semester?: number
  type?: string
  limit?: number
}) {
  let query = supabase
    .from('study_materials')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.branch)   query = query.eq('branch', filters.branch)
  if (filters?.semester) query = query.eq('semester', filters.semester)
  if (filters?.type)     query = query.eq('type', filters.type)
  if (filters?.limit)    query = query.limit(filters.limit)

  const { data, error } = await query
  if (error) {
    console.error('Error fetching materials:', error)
    return []
  }
  return data as StudyMaterial[]
}

// --- SCHOLARSHIP FUNCTIONS ---

// Get scholarships
export async function getScholarships(filters?: {
  category?: string
  limit?: number
}) {
  let query = supabase
    .from('scholarships')
    .select('*')
    .order('last_date', { ascending: true })

  if (filters?.category) query = query.eq('category', filters.category)
  if (filters?.limit)    query = query.limit(filters.limit)

  const { data, error } = await query
  if (error) {
    console.error('Error fetching scholarships:', error)
    return []
  }
  return data as Scholarship[]
}

// --- REVIEW FUNCTIONS ---

// Get reviews for a college
export async function getCollegeReviews(collegeId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('college_id', collegeId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
  return data as Review[]
}

// Submit a review
export async function submitReview(review: {
  college_id: string
  user_id: string
  rating: number
  review_text: string
}) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single()

  if (error) {
    console.error('Error submitting review:', error)
    return null
  }
  return data
}

// --- AUTH FUNCTIONS ---

// Get current logged in user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) return null
  return user
}

// Sign out user
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) console.error('Error signing out:', error)
}

// Save college for a user
export async function saveCollege(userId: string, collegeId: string) {
  const { error } = await supabase
    .from('saved_colleges')
    .insert({ user_id: userId, college_id: collegeId })

  if (error) {
    console.error('Error saving college:', error)
    return false
  }
  return true
}

// Get saved colleges for a user
export async function getSavedColleges(userId: string) {
  const { data, error } = await supabase
    .from('saved_colleges')
    .select('*, colleges(*)')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching saved colleges:', error)
    return []
  }
  return data
}