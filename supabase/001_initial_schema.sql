-- Create Profiles Table
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Saved Colleges Table
CREATE TABLE saved_colleges (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    college_slug TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Saved Exams Table
CREATE TABLE saved_exams (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    exam_slug TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Saved Jobs Table
CREATE TABLE saved_jobs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    job_slug TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create User Activity Table
CREATE TABLE user_activity (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    activity TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);