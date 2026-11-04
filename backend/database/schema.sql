-- ==============================================================================
-- TravelMate AI – Database Schema (PostgreSQL 16 + pgvector)
-- Product: TravelMate AI – Virtual Travel Agent & Travel Agent Copilot
-- Team: Innovation 27X7 – AI Agents & Intelligent Systems
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ------------------------------------------------------------------------------
-- 1. USERS & PROFILES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    avatar_url TEXT,
    home_city VARCHAR(100) DEFAULT 'Dhanbad',
    passport_country VARCHAR(100) DEFAULT 'India',
    preferred_currency VARCHAR(10) DEFAULT 'INR',
    preferred_language VARCHAR(10) DEFAULT 'en',
    travel_style VARCHAR(50) DEFAULT 'Standard',
    interests TEXT[] DEFAULT ARRAY['Adventure', 'Sightseeing', 'Shopping'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 2. DESTINATIONS & VECTOR EMBEDDINGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS destinations (
    destination_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    continent VARCHAR(50) NOT NULL,
    best_season VARCHAR(100),
    avg_daily_budget_usd NUMERIC(10, 2),
    currency VARCHAR(10),
    language VARCHAR(100),
    safety_rating NUMERIC(3, 2),
    description TEXT,
    hero_image TEXT,
    embedding vector(1536), -- OpenAI text-embedding-3-small or Gemini text-embedding-004
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_destinations_embedding ON destinations USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ------------------------------------------------------------------------------
-- 3. ATTRACTIONS & WAYPOINTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attractions (
    attraction_id VARCHAR(50) PRIMARY KEY,
    destination_id VARCHAR(50) REFERENCES destinations(destination_id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50),
    rating NUMERIC(3, 2),
    entry_fee_usd NUMERIC(10, 2) DEFAULT 0,
    opening_hours VARCHAR(100),
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    duration_hours NUMERIC(4, 2),
    description TEXT,
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_attractions_embedding ON attractions USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ------------------------------------------------------------------------------
-- 4. HOTELS & ACCOMMODATION
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hotels (
    hotel_id VARCHAR(50) PRIMARY KEY,
    destination_id VARCHAR(50) REFERENCES destinations(destination_id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    star_rating NUMERIC(2, 1),
    price_per_night_usd NUMERIC(10, 2) NOT NULL,
    price_per_night_inr NUMERIC(12, 2) NOT NULL,
    amenities TEXT[],
    address TEXT,
    user_rating NUMERIC(3, 2),
    cancellation_policy TEXT,
    image_url TEXT,
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 5. FLIGHTS & AIRFARE CACHE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS flights (
    flight_id VARCHAR(50) PRIMARY KEY,
    airline VARCHAR(100) NOT NULL,
    flight_number VARCHAR(20) NOT NULL,
    origin_iata VARCHAR(10) NOT NULL,
    destination_iata VARCHAR(10) NOT NULL,
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INT NOT NULL,
    price_usd NUMERIC(10, 2) NOT NULL,
    price_inr NUMERIC(12, 2) NOT NULL,
    stops INT DEFAULT 0,
    cabin_class VARCHAR(50) DEFAULT 'Economy',
    baggage_allowance VARCHAR(50) DEFAULT '30 kg checked, 7 kg cabin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 6. ITINERARIES & TRIPS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS trips (
    trip_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    destination_id VARCHAR(50) REFERENCES destinations(destination_id),
    title VARCHAR(200) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_days INT NOT NULL,
    travelers_count INT DEFAULT 1,
    budget_cap_inr NUMERIC(12, 2),
    estimated_total_inr NUMERIC(12, 2),
    status VARCHAR(50) DEFAULT 'UPCOMING', -- UPCOMING, COMPLETED, CANCELLED
    day_plans JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 7. BOOKINGS & TRANSACTIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    booking_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    trip_id UUID REFERENCES trips(trip_id) ON DELETE SET NULL,
    booking_reference VARCHAR(50) UNIQUE NOT NULL, -- PNR format: TM-XXXXXX
    entity_type VARCHAR(50) NOT NULL, -- 'package', 'flight', 'hotel', 'activity'
    entity_id VARCHAR(50) NOT NULL,
    total_price_usd NUMERIC(10, 2) NOT NULL,
    total_price_inr NUMERIC(12, 2) NOT NULL,
    booking_status VARCHAR(50) DEFAULT 'CONFIRMED',
    payment_status VARCHAR(50) DEFAULT 'PAID',
    payment_method VARCHAR(50),
    voucher_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 8. EXPENSES & BUDGET TRACKER
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS expenses (
    expense_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(trip_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- 'Flights', 'Hotels', 'Activities', 'Transport', 'Food', 'Visa'
    amount_inr NUMERIC(12, 2) NOT NULL,
    amount_usd NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    description TEXT,
    payment_method VARCHAR(50),
    expense_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 9. VISA RULES (IATA TIMATIC CACHE)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS visa_rules (
    visa_id VARCHAR(50) PRIMARY KEY,
    passport_country VARCHAR(100) NOT NULL,
    destination_country VARCHAR(100) NOT NULL,
    visa_type VARCHAR(100) NOT NULL,
    max_stay_days INT NOT NULL,
    processing_time_days INT NOT NULL,
    fee_usd NUMERIC(10, 2),
    fee_inr NUMERIC(12, 2),
    requirements TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 10. AI AGENT CHAT LOGS & AGENT TELEMETRY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chat_logs (
    message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL, -- 'user', 'copilot', 'agent'
    agent_id VARCHAR(50),
    message TEXT NOT NULL,
    agent_thoughts JSONB,
    attached_cards JSONB,
    query_embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_embedding ON chat_logs USING ivfflat (query_embedding vector_cosine_ops) WITH (lists = 100);
