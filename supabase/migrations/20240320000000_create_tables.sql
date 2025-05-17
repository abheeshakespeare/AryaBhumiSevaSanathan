-- Create join_us_submissions table
CREATE TABLE join_us_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    qualification TEXT NOT NULL,
    areas_of_interest TEXT[] NOT NULL,
    availability TEXT NOT NULL,
    preferred_mode TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create blood_donation_registrations table
CREATE TABLE blood_donation_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    gender TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    age INTEGER NOT NULL,
    blood_group TEXT NOT NULL,
    weight DECIMAL,
    phone_number TEXT NOT NULL,
    alternate_phone TEXT,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    pincode TEXT NOT NULL,
    consent BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create donation_records table
CREATE TABLE donation_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    amount DECIMAL NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    transaction_id TEXT,
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create contact_submissions table
CREATE TABLE contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE join_us_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_donation_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON join_us_submissions;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON blood_donation_registrations;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON donation_records;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON contact_submissions;
DROP POLICY IF EXISTS "Allow select for authenticated users" ON join_us_submissions;
DROP POLICY IF EXISTS "Allow select for authenticated users" ON blood_donation_registrations;
DROP POLICY IF EXISTS "Allow select for authenticated users" ON donation_records;
DROP POLICY IF EXISTS "Allow select for authenticated users" ON contact_submissions;

-- Create policies for public access (insert)
CREATE POLICY "Allow public insert" ON join_us_submissions
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public insert" ON blood_donation_registrations
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public insert" ON donation_records
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public insert" ON contact_submissions
    FOR INSERT TO public WITH CHECK (true);

-- Create policies for authenticated users (select)
CREATE POLICY "Allow authenticated select" ON join_us_submissions
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated select" ON blood_donation_registrations
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated select" ON donation_records
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated select" ON contact_submissions
    FOR SELECT TO authenticated USING (true);

-- Create indexes
CREATE INDEX idx_join_us_submissions_email ON join_us_submissions(email);
CREATE INDEX idx_blood_donation_registrations_blood_group ON blood_donation_registrations(blood_group);
CREATE INDEX idx_blood_donation_registrations_state_district ON blood_donation_registrations(state, district);
CREATE INDEX idx_donation_records_transaction_id ON donation_records(transaction_id);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email); 