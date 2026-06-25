// ============================================
// UTILITY FUNCTIONS — Used across all pages
// ============================================

// Convert college/exam name to URL-friendly slug
// Example: "IIT Bombay" → "iit-bombay"
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // Remove special characters
    .replace(/[\s_-]+/g, '-')   // Replace spaces with hyphens
    .replace(/^-+|-+$/g, '')    // Remove leading/trailing hyphens
}

// Format numbers with Indian numbering system
// Example: 1200000 → "12,00,000"
export function formatIndianNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num)
}

// Format fees in readable format
// Example: 125000 → "₹1.25 Lakh"
export function formatFees(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`
  }
  return `₹${amount}`
}

// Format date to Indian readable format
// Example: "2025-06-15" → "15 Jun 2025"
export function formatDate(dateString: string): string {
  if (!dateString) return 'Not announced'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// Check if a date has passed (deadline expired)
// Returns true if date is in the past
export function isDateExpired(dateString: string): boolean {
  if (!dateString) return false
  return new Date(dateString) < new Date()
}

// Get days remaining until a deadline
// Example: returns 15 if 15 days left, -5 if 5 days expired
export function getDaysRemaining(dateString: string): number {
  if (!dateString) return 0
  const today = new Date()
  const target = new Date(dateString)
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// Format days remaining into readable text
// Example: 15 → "15 days left", -5 → "Expired"
export function formatDaysRemaining(dateString: string): string {
  const days = getDaysRemaining(dateString)
  if (days < 0)  return 'Expired'
  if (days === 0) return 'Last day today!'
  if (days === 1) return '1 day left'
  if (days <= 7)  return `${days} days left ⚠️`
  if (days <= 30) return `${days} days left`
  return formatDate(dateString)
}

// Capitalize first letter of each word
// Example: "computer science engineering" → "Computer Science Engineering"
export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Truncate long text with ellipsis
// Example: truncate("Long text here", 10) → "Long text..."
export function truncate(text: string, maxLength: number): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

// Get college type badge color
// Used in CollegeCard component
export function getCollegeTypeBadge(type: string): {
  label: string
  className: string
} {
  const types: Record<string, { label: string; className: string }> = {
    government: {
      label: 'Government',
      className: 'badge-green',
    },
    private: {
      label: 'Private',
      className: 'badge-blue',
    },
    deemed: {
      label: 'Deemed',
      className: 'badge-orange',
    },
    central: {
      label: 'Central',
      className: 'badge-blue',
    },
  }
  return types[type] || { label: type, className: 'badge-blue' }
}

// Get exam category display name
// Example: "BC_A" → "BC-A"
export function formatCategory(category: string): string {
  const categories: Record<string, string> = {
    OC:    'OC (Open)',
    BC_A:  'BC-A',
    BC_B:  'BC-B',
    BC_C:  'BC-C',
    BC_D:  'BC-D',
    BC_E:  'BC-E',
    SC:    'SC',
    ST:    'ST',
    EWS:   'EWS',
    OBC:   'OBC',
  }
  return categories[category] || category
}

// Calculate CGPA from grades and credits
// Used in CGPA Calculator tool
export function calculateCGPA(subjects: {
  credits: number
  gradePoint: number
}[]): number {
  if (subjects.length === 0) return 0
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0)
  const totalPoints  = subjects.reduce(
    (sum, s) => sum + s.credits * s.gradePoint, 0
  )
  if (totalCredits === 0) return 0
  return Math.round((totalPoints / totalCredits) * 100) / 100
}

// Convert CGPA to percentage
// Uses standard formula: (CGPA - 0.75) × 10
export function cgpaToPercentage(cgpa: number, formula: string = 'standard'): number {
  const formulas: Record<string, (c: number) => number> = {
    standard: (c) => (c - 0.75) * 10,   // Most common
    jntu:     (c) => c * 10,             // JNTU formula
    vtu:      (c) => (c - 0.5) * 10,    // VTU formula
    anna:     (c) => (c * 10) - 7.5,    // Anna University
  }
  const fn = formulas[formula] || formulas.standard
  return Math.round(fn(cgpa) * 100) / 100
}

// Calculate attendance percentage
// Used in Attendance Calculator tool
export function calculateAttendance(
  present: number,
  total: number
): {
  percentage: number
  status: 'safe' | 'warning' | 'danger'
  canMiss: number
  needToAttend: number
} {
  const percentage = total > 0
    ? Math.round((present / total) * 100 * 100) / 100
    : 0

  // How many more classes can be missed (to stay above 75%)
  const canMiss = Math.floor(present / 0.75) - total

  // How many classes need to be attended (to reach 75%)
  const needed = Math.ceil((0.75 * total - present) / 0.25)
  const needToAttend = needed > 0 ? needed : 0

  let status: 'safe' | 'warning' | 'danger' = 'safe'
  if (percentage < 65)      status = 'danger'
  else if (percentage < 75) status = 'warning'

  return { percentage, status, canMiss: Math.max(0, canMiss), needToAttend }
}

// Generate stars array for ratings display
// Example: generateStars(4.5) → [full, full, full, full, half]
export function generateStars(rating: number): ('full' | 'half' | 'empty')[] {
  const stars: ('full' | 'half' | 'empty')[] = []
  for (let i = 1; i <= 5; i++) {
    if (rating >= i)          stars.push('full')
    else if (rating >= i - 0.5) stars.push('half')
    else                        stars.push('empty')
  }
  return stars
}

// Format large numbers compactly
// Example: 125000 → "1.25L", 1200 → "1.2K"
export function formatCompact(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`
  if (num >= 100000)   return `${(num / 100000).toFixed(1)}L`
  if (num >= 1000)     return `${(num / 1000).toFixed(1)}K`
  return String(num)
}

// Get state abbreviation
// Example: "Andhra Pradesh" → "AP"
export function getStateAbbr(state: string): string {
  const states: Record<string, string> = {
    'Andhra Pradesh':   'AP',
    'Telangana':        'TS',
    'Tamil Nadu':       'TN',
    'Karnataka':        'KA',
    'Maharashtra':      'MH',
    'Delhi':            'DL',
    'Uttar Pradesh':    'UP',
    'West Bengal':      'WB',
    'Rajasthan':        'RJ',
    'Gujarat':          'GJ',
    'Madhya Pradesh':   'MP',
    'Bihar':            'BR',
    'Punjab':           'PB',
    'Haryana':          'HR',
    'Kerala':           'KL',
    'Odisha':           'OD',
    'Jharkhand':        'JH',
    'Assam':            'AS',
    'Uttarakhand':      'UK',
    'Himachal Pradesh': 'HP',
    'Goa':              'GA',
    'Chhattisgarh':     'CG',
  }
  return states[state] || state.slice(0, 2).toUpperCase()
}

// List of all Indian states for dropdowns
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
]

// Engineering branches list for dropdowns
export const ENGINEERING_BRANCHES = [
  'Computer Science Engineering',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Information Technology',
  'Chemical Engineering',
  'Biotechnology',
  'Aerospace Engineering',
  'Automobile Engineering',
  'Mining Engineering',
  'Metallurgical Engineering',
  'Industrial Engineering',
  'Production Engineering',
]

// Branch short codes
export const BRANCH_CODES: Record<string, string> = {
  'Computer Science Engineering':              'CSE',
  'Electronics & Communication Engineering':   'ECE',
  'Electrical & Electronics Engineering':      'EEE',
  'Mechanical Engineering':                    'MECH',
  'Civil Engineering':                         'CIVIL',
  'Information Technology':                    'IT',
  'Chemical Engineering':                      'CHEM',
  'Biotechnology':                             'BT',
  'Aerospace Engineering':                     'AERO',
  'Automobile Engineering':                    'AUTO',
}