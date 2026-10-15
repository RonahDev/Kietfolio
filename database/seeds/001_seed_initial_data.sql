-- Seed: 001_seed_initial_data.sql
-- Description: Seed initial administrator, verified guestbook entries, and core projects

-- 1. Seed Verified System Administrator (Mai Anh Kiệt)
-- Bcrypt hash for default initial password: "KietfolioAdmin2026!"
INSERT INTO users (id, email, password_hash, display_name, role, provider, created_at, updated_at)
VALUES (
    'usr-admin-kiet',
    'kiet.maianh@gmail.com',
    '$2a$10$wK1mB5q6tV3G7rX9j8k4eODq9q8l1w2e3r4t5y6u7i8o9p0a1s2d3',
    'Mai Anh Kiệt',
    'admin',
    'google',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE
SET role = 'admin';

-- 2. Seed Initial Guestbook Entries
INSERT INTO guestbook_entries (id, user_uid, name, avatar, role_title, message, is_google_verified, is_pinned, is_approved, created_at)
VALUES 
(
    'gb-seed-1',
    'usr-admin-kiet',
    'Mai Anh Kiệt',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    'Creator & Software Engineer',
    'Chào mừng bạn đến với Kietfolio! Hãy để lại lời nhắn, cùng trao đổi kinh nghiệm hoặc kết nối hợp tác nhé.',
    true,
    true,
    true,
    NOW()
),
(
    'gb-seed-2',
    NULL,
    'SPX Operations Team',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    'Logistics Operations Lead',
    'Tinh thần điều phối áp lực cao và kết nối thực tế vận hành vào tư duy kỹ thuật rất ấn tượng!',
    true,
    false,
    true,
    NOW() - INTERVAL '1 day'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Core Projects
INSERT INTO projects (
    id, title, subtitle, category, status_badge, is_featured, 
    problem_statement, solution_architecture, key_engineering_decisions, 
    tech_stack, github_url, live_url, created_at
)
VALUES (
    'kietfolio-core',
    'Kietfolio Architecture',
    '{"en": "High-Performance 3D Full-Stack Cyber Portfolio", "vi": "Portfolio Công Nghệ Cao 3D Full-Stack"}'::jsonb,
    'creative',
    '{"en": "Production Live", "vi": "Trực Tuyến Sẵn Sàng"}'::jsonb,
    true,
    '{"en": "Standard web portfolios lack technical depth and fail to communicate both real-time graphics and operational logistics capability.", "vi": "Các trang portfolio thông thường thiếu cá tính kỹ thuật và không thể hiện được năng lực đồ họa 3D cùng tư duy vận hành chuỗi cung ứng."}'::jsonb,
    '{"en": "Custom Three.js procedural shaders, GSAP motion choreography, and React 19 architecture with strict TypeScript contracts.", "vi": "Tùy biến shader Three.js theo thời gian thực, điều phối chuyển động GSAP và kiến trúc React 19 trên nền TypeScript chặt chẽ."}'::jsonb,
    '{"en": ["Domain-Driven Modular Folders with 0 barrel bundling penalties", "Capped WebGL pixel ratio at 1.5 to eliminate GPU throttling", "Offline fallback simulation for resilient auth and guestbook interactions"], "vi": ["Phân tách thư mục theo Domain-Driven Design không gây nghẽn bundle", "Giới hạn pixel ratio WebGL ở 1.5 để tối ưu hóa triệt để GPU", "Cơ chế fallback offline đảm bảo xác thực và lưu bút luôn mượt mà"]}'::jsonb,
    ARRAY['React 19', 'Three.js', 'GSAP', 'TypeScript', 'Tailwind CSS', 'Docker', 'PostgreSQL', 'Express'],
    'https://github.com/RonahDev/Kietfolio',
    'https://ronahdev.github.io/Kietfolio/',
    NOW()
)
ON CONFLICT (id) DO NOTHING;
