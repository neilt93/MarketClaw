-- =============================================================================
-- MarketClaw (Declutter) Seed Data
-- Run via: supabase db reset
-- All users have password: password123
-- =============================================================================

-- Fixed UUIDs for referencing across tables
-- Users
DO $$
DECLARE
  u01 UUID := 'a1000000-0000-0000-0000-000000000001';
  u02 UUID := 'a1000000-0000-0000-0000-000000000002';
  u03 UUID := 'a1000000-0000-0000-0000-000000000003';
  u04 UUID := 'a1000000-0000-0000-0000-000000000004';
  u05 UUID := 'a1000000-0000-0000-0000-000000000005';
  u06 UUID := 'a1000000-0000-0000-0000-000000000006';
  u07 UUID := 'a1000000-0000-0000-0000-000000000007';
  u08 UUID := 'a1000000-0000-0000-0000-000000000008';
  u09 UUID := 'a1000000-0000-0000-0000-000000000009';
  u10 UUID := 'a1000000-0000-0000-0000-000000000010';
  u11 UUID := 'a1000000-0000-0000-0000-000000000011';
  u12 UUID := 'a1000000-0000-0000-0000-000000000012';

  -- Receipts
  r01 UUID := 'b1000000-0000-0000-0000-000000000001';
  r02 UUID := 'b1000000-0000-0000-0000-000000000002';
  r03 UUID := 'b1000000-0000-0000-0000-000000000003';
  r04 UUID := 'b1000000-0000-0000-0000-000000000004';
  r05 UUID := 'b1000000-0000-0000-0000-000000000005';
  r06 UUID := 'b1000000-0000-0000-0000-000000000006';
  r07 UUID := 'b1000000-0000-0000-0000-000000000007';
  r08 UUID := 'b1000000-0000-0000-0000-000000000008';
  r09 UUID := 'b1000000-0000-0000-0000-000000000009';
  r10 UUID := 'b1000000-0000-0000-0000-000000000010';
  r11 UUID := 'b1000000-0000-0000-0000-000000000011';
  r12 UUID := 'b1000000-0000-0000-0000-000000000012';
  r13 UUID := 'b1000000-0000-0000-0000-000000000013';
  r14 UUID := 'b1000000-0000-0000-0000-000000000014';
  r15 UUID := 'b1000000-0000-0000-0000-000000000015';
  r16 UUID := 'b1000000-0000-0000-0000-000000000016';
  r17 UUID := 'b1000000-0000-0000-0000-000000000017';
  r18 UUID := 'b1000000-0000-0000-0000-000000000018';
  r19 UUID := 'b1000000-0000-0000-0000-000000000019';
  r20 UUID := 'b1000000-0000-0000-0000-000000000020';
  r21 UUID := 'b1000000-0000-0000-0000-000000000021';
  r22 UUID := 'b1000000-0000-0000-0000-000000000022';
  r23 UUID := 'b1000000-0000-0000-0000-000000000023';
  r24 UUID := 'b1000000-0000-0000-0000-000000000024';
  r25 UUID := 'b1000000-0000-0000-0000-000000000025';
  r26 UUID := 'b1000000-0000-0000-0000-000000000026';
  r27 UUID := 'b1000000-0000-0000-0000-000000000027';
  r28 UUID := 'b1000000-0000-0000-0000-000000000028';
  r29 UUID := 'b1000000-0000-0000-0000-000000000029';
  r30 UUID := 'b1000000-0000-0000-0000-000000000030';
  r31 UUID := 'b1000000-0000-0000-0000-000000000031';
  r32 UUID := 'b1000000-0000-0000-0000-000000000032';
  r33 UUID := 'b1000000-0000-0000-0000-000000000033';
  r34 UUID := 'b1000000-0000-0000-0000-000000000034';
  r35 UUID := 'b1000000-0000-0000-0000-000000000035';
  r36 UUID := 'b1000000-0000-0000-0000-000000000036';
  r37 UUID := 'b1000000-0000-0000-0000-000000000037';
  r38 UUID := 'b1000000-0000-0000-0000-000000000038';
  r39 UUID := 'b1000000-0000-0000-0000-000000000039';
  r40 UUID := 'b1000000-0000-0000-0000-000000000040';
  r41 UUID := 'b1000000-0000-0000-0000-000000000041';
  r42 UUID := 'b1000000-0000-0000-0000-000000000042';
  r43 UUID := 'b1000000-0000-0000-0000-000000000043';
  r44 UUID := 'b1000000-0000-0000-0000-000000000044';
  r45 UUID := 'b1000000-0000-0000-0000-000000000045';
  r46 UUID := 'b1000000-0000-0000-0000-000000000046';
  r47 UUID := 'b1000000-0000-0000-0000-000000000047';
  r48 UUID := 'b1000000-0000-0000-0000-000000000048';
  r49 UUID := 'b1000000-0000-0000-0000-000000000049';
  r50 UUID := 'b1000000-0000-0000-0000-000000000050';

  -- Items (c1 prefix)
  i UUID; -- reusable item var

  -- Listings (d1 prefix)
  l UUID; -- reusable listing var

  pw TEXT := crypt('password123', gen_salt('bf'));

BEGIN

-- =============================================================================
-- 1. USERS (12 users) — trigger auto-creates public.users
-- =============================================================================
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000000', u01, 'authenticated', 'authenticated', 'sarah.chen@example.com',    pw, NOW(), '{"full_name":"Sarah Chen"}'::jsonb,        NOW() - INTERVAL '90 days', NOW()),
  ('00000000-0000-0000-0000-000000000000', u02, 'authenticated', 'authenticated', 'mike.johnson@example.com',  pw, NOW(), '{"full_name":"Mike Johnson"}'::jsonb,      NOW() - INTERVAL '60 days', NOW()),
  ('00000000-0000-0000-0000-000000000000', u03, 'authenticated', 'authenticated', 'emma.wilson@example.com',   pw, NOW(), '{"full_name":"Emma Wilson"}'::jsonb,       NOW() - INTERVAL '45 days', NOW()),
  ('00000000-0000-0000-0000-000000000000', u04, 'authenticated', 'authenticated', 'james.garcia@example.com',  pw, NOW(), '{"full_name":"James Garcia"}'::jsonb,      NOW() - INTERVAL '30 days', NOW()),
  ('00000000-0000-0000-0000-000000000000', u05, 'authenticated', 'authenticated', 'olivia.brown@example.com',  pw, NOW(), '{"full_name":"Olivia Brown"}'::jsonb,      NOW() - INTERVAL '25 days', NOW()),
  ('00000000-0000-0000-0000-000000000000', u06, 'authenticated', 'authenticated', 'david.kim@example.com',     pw, NOW(), '{"full_name":"David Kim"}'::jsonb,         NOW() - INTERVAL '20 days', NOW()),
  ('00000000-0000-0000-0000-000000000000', u07, 'authenticated', 'authenticated', 'rachel.lee@example.com',    pw, NOW(), '{"full_name":"Rachel Lee"}'::jsonb,        NOW() - INTERVAL '15 days', NOW()),
  ('00000000-0000-0000-0000-000000000000', u08, 'authenticated', 'authenticated', 'alex.martinez@example.com', pw, NOW(), '{"full_name":"Alex Martinez"}'::jsonb,     NOW() - INTERVAL '10 days', NOW()),
  ('00000000-0000-0000-0000-000000000000', u09, 'authenticated', 'authenticated', 'priya.patel@example.com',   pw, NOW(), '{"full_name":"Priya Patel"}'::jsonb,       NOW() - INTERVAL '7 days',  NOW()),
  ('00000000-0000-0000-0000-000000000000', u10, 'authenticated', 'authenticated', 'tom.anderson@example.com',  pw, NOW(), '{"full_name":"Tom Anderson"}'::jsonb,      NOW() - INTERVAL '5 days',  NOW()),
  ('00000000-0000-0000-0000-000000000000', u11, 'authenticated', 'authenticated', 'lisa.wang@example.com',     pw, NOW(), '{"full_name":"Lisa Wang"}'::jsonb,         NOW() - INTERVAL '2 days',  NOW()),
  ('00000000-0000-0000-0000-000000000000', u12, 'authenticated', 'authenticated', 'newuser@example.com',       pw, NOW(), '{"full_name":"New User"}'::jsonb,          NOW() - INTERVAL '1 day',   NOW());

-- Update some public.users with extra profile data
UPDATE public.users SET gmail_connected = true, gmail_last_sync = NOW() - INTERVAL '2 hours' WHERE id = u01;
UPDATE public.users SET gmail_connected = true, gmail_last_sync = NOW() - INTERVAL '1 day'   WHERE id = u02;
UPDATE public.users SET gmail_connected = true, gmail_last_sync = NOW() - INTERVAL '5 hours' WHERE id = u05;
UPDATE public.users SET stripe_customer_id = 'cus_test_sarah',  stripe_connect_id = 'acct_test_sarah',  stripe_connect_onboarded = true  WHERE id = u01;
UPDATE public.users SET stripe_customer_id = 'cus_test_mike',   stripe_connect_id = 'acct_test_mike',   stripe_connect_onboarded = true  WHERE id = u02;
UPDATE public.users SET stripe_customer_id = 'cus_test_emma',   stripe_connect_id = 'acct_test_emma',   stripe_connect_onboarded = false WHERE id = u03;
UPDATE public.users SET stripe_customer_id = 'cus_test_james'   WHERE id = u04;

-- =============================================================================
-- 2. RECEIPTS (50)
-- =============================================================================
INSERT INTO public.receipts (id, user_id, source, source_message_id, subject, sender_email, raw_text, status, parsed_at, error_message, created_at) VALUES
  -- Sarah (u01): 8 receipts, gmail-connected power user
  (r01, u01, 'gmail', 'msg_amz_001', 'Your Amazon.com order #112-3456789',         'shipment-tracking@amazon.com',  'Order confirmation for MacBook Pro...', 'parsed', NOW() - INTERVAL '85 days', NULL, NOW() - INTERVAL '88 days'),
  (r02, u01, 'gmail', 'msg_bb_001',  'Best Buy Order Confirmation #BBY01-234',      'orders@bestbuy.com',            'Thank you for your purchase of Sony...', 'parsed', NOW() - INTERVAL '70 days', NULL, NOW() - INTERVAL '72 days'),
  (r03, u01, 'gmail', 'msg_amz_002', 'Your Amazon.com order #112-9876543',         'shipment-tracking@amazon.com',  'Order confirmation for KitchenAid...', 'parsed', NOW() - INTERVAL '50 days', NULL, NOW() - INTERVAL '52 days'),
  (r04, u01, 'manual', NULL,          NULL, NULL, 'IKEA receipt - KALLAX shelf unit $89.99, MALM dresser $249.00', 'parsed', NOW() - INTERVAL '40 days', NULL, NOW() - INTERVAL '42 days'),
  (r05, u01, 'gmail', 'msg_tgt_001', 'Your Target order has shipped!',              'orders@target.com',             'Dyson V15 Detect vacuum...', 'parsed', NOW() - INTERVAL '30 days', NULL, NOW() - INTERVAL '32 days'),
  (r06, u01, 'gmail', 'msg_amz_003', 'Your Amazon.com order #112-1111111',         'shipment-tracking@amazon.com',  'Groceries order...', 'parsed', NOW() - INTERVAL '20 days', NULL, NOW() - INTERVAL '22 days'),
  (r07, u01, 'gmail', 'msg_amz_004', 'Your Amazon.com order #112-2222222',         'shipment-tracking@amazon.com',  'Raw text corrupted...', 'failed', NULL, 'AI extraction failed: unable to parse receipt content', NOW() - INTERVAL '10 days'),
  (r08, u01, 'gmail', 'msg_amz_005', 'Your Amazon.com order #112-3333333',         'shipment-tracking@amazon.com',  'Processing...', 'parsing', NULL, NULL, NOW() - INTERVAL '1 day'),

  -- Mike (u02): 7 receipts, mix of gmail and manual
  (r09, u02, 'gmail', 'msg_hd_001',  'The Home Depot - Order Confirmation',         'orders@homedepot.com',          'DeWalt 20V MAX drill combo kit...', 'parsed', NOW() - INTERVAL '55 days', NULL, NOW() - INTERVAL '58 days'),
  (r10, u02, 'manual', NULL,          NULL, NULL, 'Craigslist purchase: Herman Miller Aeron chair $800', 'parsed', NOW() - INTERVAL '50 days', NULL, NOW() - INTERVAL '50 days'),
  (r11, u02, 'gmail', 'msg_amz_006', 'Your Amazon.com order #113-5551234',         'shipment-tracking@amazon.com',  'Samsung 65" QLED TV...', 'parsed', NOW() - INTERVAL '40 days', NULL, NOW() - INTERVAL '42 days'),
  (r12, u02, 'manual', NULL,          NULL, NULL, 'Guitar Center receipt - Fender Stratocaster $1299', 'parsed', NOW() - INTERVAL '35 days', NULL, NOW() - INTERVAL '35 days'),
  (r13, u02, 'gmail', 'msg_cost_001', 'Costco.com Order Confirmation',              'orders@costco.com',             'Vitamix A3500 blender...', 'parsed', NOW() - INTERVAL '25 days', NULL, NOW() - INTERVAL '27 days'),
  (r14, u02, 'gmail', 'msg_bb_002',  'Best Buy Order Confirmation #BBY01-567',      'orders@bestbuy.com',            'Nintendo Switch OLED...', 'parsed', NOW() - INTERVAL '15 days', NULL, NOW() - INTERVAL '17 days'),
  (r15, u02, 'manual', NULL,          NULL, NULL, 'REI receipt: Osprey Atmos AG 65 backpack $270', 'parsed', NOW() - INTERVAL '10 days', NULL, NOW() - INTERVAL '10 days'),

  -- Emma (u03): 6 receipts
  (r16, u03, 'manual', NULL,          NULL, NULL, 'Apple Store receipt - iPad Pro 12.9" $1099', 'parsed', NOW() - INTERVAL '40 days', NULL, NOW() - INTERVAL '42 days'),
  (r17, u03, 'manual', NULL,          NULL, NULL, 'West Elm receipt - mid-century desk $599, task lamp $129', 'parsed', NOW() - INTERVAL '35 days', NULL, NOW() - INTERVAL '37 days'),
  (r18, u03, 'manual', NULL,          NULL, NULL, 'Target receipt - Instant Pot $89.99, cutting board set $24.99', 'parsed', NOW() - INTERVAL '28 days', NULL, NOW() - INTERVAL '30 days'),
  (r19, u03, 'manual', NULL,          NULL, NULL, 'Lowe''s receipt - Craftsman tool set $189', 'parsed', NOW() - INTERVAL '20 days', NULL, NOW() - INTERVAL '22 days'),
  (r20, u03, 'manual', NULL,          NULL, NULL, 'Amazon receipt - Kindle Paperwhite $139.99, Netflix subscription', 'parsed', NOW() - INTERVAL '12 days', NULL, NOW() - INTERVAL '14 days'),
  (r21, u03, 'manual', NULL,          NULL, NULL, 'Receipt unclear - water damaged', 'failed', NULL, 'AI extraction failed: receipt image too blurry to read', NOW() - INTERVAL '5 days'),

  -- James (u04): 5 receipts
  (r22, u04, 'manual', NULL,          NULL, NULL, 'Micro Center - RTX 4070 GPU $549, 32GB RAM kit $89', 'parsed', NOW() - INTERVAL '28 days', NULL, NOW() - INTERVAL '28 days'),
  (r23, u04, 'manual', NULL,          NULL, NULL, 'IKEA receipt - MARKUS chair $229, desk lamp $39', 'parsed', NOW() - INTERVAL '22 days', NULL, NOW() - INTERVAL '22 days'),
  (r24, u04, 'manual', NULL,          NULL, NULL, 'Dick''s Sporting Goods - Peloton mat $59, dumbbells $129', 'parsed', NOW() - INTERVAL '15 days', NULL, NOW() - INTERVAL '15 days'),
  (r25, u04, 'manual', NULL,          NULL, NULL, 'Walmart receipt - groceries $87.50', 'parsed', NOW() - INTERVAL '8 days', NULL, NOW() - INTERVAL '8 days'),
  (r26, u04, 'manual', NULL,          NULL, NULL, 'Still processing...', 'pending', NULL, NULL, NOW() - INTERVAL '1 day'),

  -- Olivia (u05): 6 receipts, gmail user
  (r27, u05, 'gmail', 'msg_amz_007', 'Your Amazon.com order #114-7778899',         'shipment-tracking@amazon.com',  'Bose QC45 headphones...', 'parsed', NOW() - INTERVAL '22 days', NULL, NOW() - INTERVAL '24 days'),
  (r28, u05, 'gmail', 'msg_way_001', 'Wayfair Order Confirmation',                  'orders@wayfair.com',            'Velvet sofa $899, throw pillows $45', 'parsed', NOW() - INTERVAL '18 days', NULL, NOW() - INTERVAL '20 days'),
  (r29, u05, 'gmail', 'msg_amz_008', 'Your Amazon.com order #114-1234567',         'shipment-tracking@amazon.com',  'Ring doorbell, smart plugs...', 'parsed', NOW() - INTERVAL '14 days', NULL, NOW() - INTERVAL '16 days'),
  (r30, u05, 'manual', NULL,          NULL, NULL, 'REI receipt - camping tent $349, sleeping bag $179', 'parsed', NOW() - INTERVAL '10 days', NULL, NOW() - INTERVAL '12 days'),
  (r31, u05, 'gmail', 'msg_bb_003',  'Best Buy - Your order is confirmed',          'orders@bestbuy.com',            'Canon EOS R6 camera body...', 'parsed', NOW() - INTERVAL '5 days',  NULL, NOW() - INTERVAL '7 days'),
  (r32, u05, 'gmail', 'msg_amz_009', 'Your Amazon.com order #114-9999999',         'shipment-tracking@amazon.com',  'Dog food, cleaning supplies...', 'parsed', NOW() - INTERVAL '2 days',  NULL, NOW() - INTERVAL '3 days'),

  -- David (u06): 5 receipts
  (r33, u06, 'manual', NULL,          NULL, NULL, 'Apple Store - MacBook Air M3 $1099, AppleCare', 'parsed', NOW() - INTERVAL '18 days', NULL, NOW() - INTERVAL '18 days'),
  (r34, u06, 'manual', NULL,          NULL, NULL, 'Home Depot - Milwaukee M18 impact driver $179, drill bits $29', 'parsed', NOW() - INTERVAL '14 days', NULL, NOW() - INTERVAL '14 days'),
  (r35, u06, 'manual', NULL,          NULL, NULL, 'Costco receipt - Vitamix, paper towels, rotisserie chicken', 'parsed', NOW() - INTERVAL '10 days', NULL, NOW() - INTERVAL '10 days'),
  (r36, u06, 'manual', NULL,          NULL, NULL, 'Guitar Center - Roland FP-30X piano $549', 'parsed', NOW() - INTERVAL '6 days',  NULL, NOW() - INTERVAL '6 days'),
  (r37, u06, 'manual', NULL,          NULL, NULL, 'Blurry receipt photo', 'failed', NULL, 'AI extraction failed: image quality insufficient', NOW() - INTERVAL '3 days'),

  -- Rachel (u07): 4 receipts
  (r38, u07, 'manual', NULL,          NULL, NULL, 'Crate & Barrel - dining table $1299, 4 chairs $200 each', 'parsed', NOW() - INTERVAL '13 days', NULL, NOW() - INTERVAL '13 days'),
  (r39, u07, 'manual', NULL,          NULL, NULL, 'Target - Nespresso Vertuo $199, pod sampler $35', 'parsed', NOW() - INTERVAL '9 days',  NULL, NOW() - INTERVAL '9 days'),
  (r40, u07, 'manual', NULL,          NULL, NULL, 'Amazon - Roomba j7+ $599, replacement bags $19', 'parsed', NOW() - INTERVAL '5 days',  NULL, NOW() - INTERVAL '5 days'),
  (r41, u07, 'manual', NULL,          NULL, NULL, 'Pending processing', 'pending', NULL, NULL, NOW() - INTERVAL '1 day'),

  -- Alex (u08): 4 receipts
  (r42, u08, 'manual', NULL,          NULL, NULL, 'B&H Photo - Sony A7IV camera $2498, lens $1298', 'parsed', NOW() - INTERVAL '9 days', NULL, NOW() - INTERVAL '9 days'),
  (r43, u08, 'manual', NULL,          NULL, NULL, 'REI - Arc''teryx jacket $399, hiking boots $189', 'parsed', NOW() - INTERVAL '6 days', NULL, NOW() - INTERVAL '6 days'),
  (r44, u08, 'manual', NULL,          NULL, NULL, 'Steam purchase - game bundle $59.99', 'parsed', NOW() - INTERVAL '3 days', NULL, NOW() - INTERVAL '3 days'),
  (r45, u08, 'manual', NULL,          NULL, NULL, 'Spotify annual subscription $119.99', 'parsed', NOW() - INTERVAL '2 days', NULL, NOW() - INTERVAL '2 days'),

  -- Priya (u09): 3 receipts
  (r46, u09, 'manual', NULL,          NULL, NULL, 'Wayfair - standing desk $449, monitor arm $89', 'parsed', NOW() - INTERVAL '5 days', NULL, NOW() - INTERVAL '5 days'),
  (r47, u09, 'manual', NULL,          NULL, NULL, 'Amazon - mechanical keyboard $169, mouse $79', 'parsed', NOW() - INTERVAL '3 days', NULL, NOW() - INTERVAL '3 days'),
  (r48, u09, 'manual', NULL,          NULL, NULL, 'Uber Eats receipt $42.50', 'parsed', NOW() - INTERVAL '1 day', NULL, NOW() - INTERVAL '1 day'),

  -- Tom (u10): 2 receipts
  (r49, u10, 'manual', NULL,          NULL, NULL, 'Best Buy - LG C3 OLED 55" TV $1296, HDMI cable $15', 'parsed', NOW() - INTERVAL '4 days', NULL, NOW() - INTERVAL '4 days'),
  (r50, u10, 'manual', NULL,          NULL, NULL, 'Amazon - Sonos Beam soundbar $449', 'parsed', NOW() - INTERVAL '2 days', NULL, NOW() - INTERVAL '2 days');

  -- u11 (Lisa) and u12 (New User) have no receipts — edge case: empty accounts

-- =============================================================================
-- 3. ITEMS (~150)
-- =============================================================================

-- Sarah's items (from r01-r06)
INSERT INTO public.items (id, receipt_id, user_id, name, brand, model_number, category, purchase_price, quantity, purchase_date, retailer) VALUES
  ('c1000000-0000-0000-0000-000000000001', r01, u01, 'MacBook Pro 14"',          'Apple',      'MKGR3LL/A',   'electronics',         199900, 1, '2025-01-03', 'Amazon'),
  ('c1000000-0000-0000-0000-000000000002', r01, u01, 'USB-C Hub 7-in-1',         'Anker',      'A8346',       'electronics',          3499, 1, '2025-01-03', 'Amazon'),
  ('c1000000-0000-0000-0000-000000000003', r01, u01, 'Laptop Sleeve 14"',        'tomtoc',     NULL,          'other_resalable',      2999, 1, '2025-01-03', 'Amazon'),
  ('c1000000-0000-0000-0000-000000000004', r02, u01, 'Sony WH-1000XM5',          'Sony',       'WH1000XM5/B', 'electronics',         34800, 1, '2025-01-20', 'Best Buy'),
  ('c1000000-0000-0000-0000-000000000005', r02, u01, 'Sony WF-1000XM5 Earbuds',  'Sony',       'WF1000XM5/B', 'electronics',         27800, 1, '2025-01-20', 'Best Buy'),
  ('c1000000-0000-0000-0000-000000000006', r03, u01, 'KitchenAid Artisan Stand Mixer', 'KitchenAid', 'KSM150PS', 'appliances',        37999, 1, '2025-02-10', 'Amazon'),
  ('c1000000-0000-0000-0000-000000000007', r03, u01, 'Mixing Bowl Set',          'KitchenAid', NULL,          'other_resalable',      4999, 1, '2025-02-10', 'Amazon'),
  ('c1000000-0000-0000-0000-000000000008', r04, u01, 'KALLAX Shelf Unit',        'IKEA',       'KALLAX',      'furniture',             8999, 1, '2025-02-20', 'IKEA'),
  ('c1000000-0000-0000-0000-000000000009', r04, u01, 'MALM 6-Drawer Dresser',    'IKEA',       'MALM',        'furniture',            24900, 1, '2025-02-20', 'IKEA'),
  ('c1000000-0000-0000-0000-000000000010', r05, u01, 'Dyson V15 Detect',         'Dyson',      'V15',         'appliances',           74999, 1, '2025-03-02', 'Target'),
  ('c1000000-0000-0000-0000-000000000011', r06, u01, 'Organic Groceries Bundle', NULL,          NULL,          'food_grocery',         8750, 1, '2025-03-12', 'Amazon'),
  ('c1000000-0000-0000-0000-000000000012', r06, u01, 'Protein Powder 5lb',       'Optimum Nutrition', NULL,    'consumable',           5499, 1, '2025-03-12', 'Amazon'),

  -- Mike's items (from r09-r15)
  ('c1000000-0000-0000-0000-000000000013', r09, u02, 'DeWalt 20V MAX Drill/Driver Combo', 'DeWalt', 'DCK240C2', 'tools',              22999, 1, '2025-01-05', 'Home Depot'),
  ('c1000000-0000-0000-0000-000000000014', r09, u02, 'DeWalt Bit Set 100pc',     'DeWalt',     'DWA2FTS100',  'tools',                2999, 1, '2025-01-05', 'Home Depot'),
  ('c1000000-0000-0000-0000-000000000015', r09, u02, 'Gorilla Wood Glue 18oz',   'Gorilla',    NULL,          'consumable',            899, 1, '2025-01-05', 'Home Depot'),
  ('c1000000-0000-0000-0000-000000000016', r10, u02, 'Herman Miller Aeron Chair', 'Herman Miller', 'AER1B23DW', 'furniture',           80000, 1, '2025-01-12', 'Craigslist'),
  ('c1000000-0000-0000-0000-000000000017', r11, u02, 'Samsung 65" QLED 4K TV',   'Samsung',    'QN65Q80C',    'electronics',         109800, 1, '2025-01-22', 'Amazon'),
  ('c1000000-0000-0000-0000-000000000018', r12, u02, 'Fender Player Stratocaster', 'Fender',   'STRAT-PLY',   'musical_instruments', 129900, 1, '2025-01-27', 'Guitar Center'),
  ('c1000000-0000-0000-0000-000000000019', r13, u02, 'Vitamix A3500 Blender',    'Vitamix',    'A3500',       'appliances',           54999, 1, '2025-02-05', 'Costco'),
  ('c1000000-0000-0000-0000-000000000020', r14, u02, 'Nintendo Switch OLED',     'Nintendo',   'HEGSKAAAA',   'electronics',          34999, 1, '2025-02-15', 'Best Buy'),
  ('c1000000-0000-0000-0000-000000000021', r14, u02, 'Pro Controller',           'Nintendo',   'HACAFSSKA',   'electronics',           6999, 1, '2025-02-15', 'Best Buy'),
  ('c1000000-0000-0000-0000-000000000022', r14, u02, 'Zelda: Tears of the Kingdom', 'Nintendo', NULL,         'digital_download',      5999, 1, '2025-02-15', 'Best Buy'),
  ('c1000000-0000-0000-0000-000000000023', r15, u02, 'Osprey Atmos AG 65',       'Osprey',     'ATMOS65',     'outdoor',              27000, 1, '2025-02-22', 'REI'),

  -- Emma's items (from r16-r20)
  ('c1000000-0000-0000-0000-000000000024', r16, u03, 'iPad Pro 12.9" M2',        'Apple',      'MNXR3LL/A',   'electronics',         109900, 1, '2025-01-22', 'Apple Store'),
  ('c1000000-0000-0000-0000-000000000025', r16, u03, 'Apple Pencil 2nd Gen',     'Apple',      'MU8F2AM/A',   'electronics',          12900, 1, '2025-01-22', 'Apple Store'),
  ('c1000000-0000-0000-0000-000000000026', r17, u03, 'Mid-Century Modern Desk',  'West Elm',   NULL,          'furniture',            59900, 1, '2025-01-27', 'West Elm'),
  ('c1000000-0000-0000-0000-000000000027', r17, u03, 'Industrial Task Lamp',     'West Elm',   NULL,          'office',               12900, 1, '2025-01-27', 'West Elm'),
  ('c1000000-0000-0000-0000-000000000028', r18, u03, 'Instant Pot Duo 8qt',      'Instant Pot','DUO80',       'appliances',            8999, 1, '2025-02-02', 'Target'),
  ('c1000000-0000-0000-0000-000000000029', r18, u03, 'Bamboo Cutting Board Set', NULL,          NULL,          'other_resalable',      2499, 1, '2025-02-02', 'Target'),
  ('c1000000-0000-0000-0000-000000000030', r19, u03, 'Craftsman 256pc Mechanics Tool Set', 'Craftsman', 'CMMT99206', 'tools',          18900, 1, '2025-02-12', 'Lowe''s'),
  ('c1000000-0000-0000-0000-000000000031', r20, u03, 'Kindle Paperwhite',        'Amazon',     'KPW5',        'electronics',          13999, 1, '2025-02-20', 'Amazon'),
  ('c1000000-0000-0000-0000-000000000032', r20, u03, 'Netflix Annual Plan',      NULL,          NULL,          'subscription',         15588, 1, '2025-02-20', 'Amazon'),

  -- James's items (from r22-r25)
  ('c1000000-0000-0000-0000-000000000033', r22, u04, 'NVIDIA RTX 4070 GPU',      'NVIDIA',     'RTX4070',     'electronics',          54900, 1, '2025-02-04', 'Micro Center'),
  ('c1000000-0000-0000-0000-000000000034', r22, u04, 'Corsair Vengeance 32GB DDR5', 'Corsair', 'CMK32GX5M2', 'electronics',           8900, 1, '2025-02-04', 'Micro Center'),
  ('c1000000-0000-0000-0000-000000000035', r23, u04, 'MARKUS Office Chair',      'IKEA',       'MARKUS',      'furniture',            22900, 1, '2025-02-10', 'IKEA'),
  ('c1000000-0000-0000-0000-000000000036', r23, u04, 'LED Desk Lamp',            'IKEA',       'TERTIAL',     'office',                3900, 1, '2025-02-10', 'IKEA'),
  ('c1000000-0000-0000-0000-000000000037', r24, u04, 'Exercise Mat',             'Peloton',    NULL,          'sports_equipment',      5900, 1, '2025-02-17', 'Dick''s Sporting Goods'),
  ('c1000000-0000-0000-0000-000000000038', r24, u04, 'Adjustable Dumbbell Set',  'Bowflex',    'SelectTech',  'sports_equipment',     12900, 1, '2025-02-17', 'Dick''s Sporting Goods'),
  ('c1000000-0000-0000-0000-000000000039', r25, u04, 'Weekly Groceries',         NULL,          NULL,          'food_grocery',          8750, 1, '2025-02-24', 'Walmart'),

  -- Olivia's items (from r27-r32)
  ('c1000000-0000-0000-0000-000000000040', r27, u05, 'Bose QuietComfort 45',     'Bose',       'QC45',        'electronics',          32900, 1, '2025-02-10', 'Amazon'),
  ('c1000000-0000-0000-0000-000000000041', r28, u05, 'Velvet Sofa',              'Wayfair',    NULL,          'furniture',            89900, 1, '2025-02-14', 'Wayfair'),
  ('c1000000-0000-0000-0000-000000000042', r28, u05, 'Throw Pillow Set (4)',     NULL,          NULL,          'other_resalable',      4500, 1, '2025-02-14', 'Wayfair'),
  ('c1000000-0000-0000-0000-000000000043', r29, u05, 'Ring Video Doorbell Pro 2', 'Ring',      'DOORBELL-PRO2','home_improvement',     24999, 1, '2025-02-18', 'Amazon'),
  ('c1000000-0000-0000-0000-000000000044', r29, u05, 'Smart Plug 4-Pack',        'TP-Link',    'KASA-HS103P4','electronics',           2999, 1, '2025-02-18', 'Amazon'),
  ('c1000000-0000-0000-0000-000000000045', r30, u05, 'REI Co-op Half Dome 2 Tent','REI',       'HALFDOME2',   'outdoor',              34900, 1, '2025-02-22', 'REI'),
  ('c1000000-0000-0000-0000-000000000046', r30, u05, 'Kelty Cosmic Down 20 Sleeping Bag', 'Kelty', 'COSMIC20','outdoor',              17900, 1, '2025-02-22', 'REI'),
  ('c1000000-0000-0000-0000-000000000047', r31, u05, 'Canon EOS R6 Mark II',     'Canon',      'EOSR6M2',    'electronics',          249900, 1, '2025-02-27', 'Best Buy'),
  ('c1000000-0000-0000-0000-000000000048', r32, u05, 'Dog Food 30lb Bag',        'Blue Buffalo',NULL,         'food_grocery',          5299, 1, '2025-03-01', 'Amazon'),
  ('c1000000-0000-0000-0000-000000000049', r32, u05, 'Cleaning Supplies Bundle', NULL,          NULL,         'consumable',            3499, 1, '2025-03-01', 'Amazon'),

  -- David's items (from r33-r36)
  ('c1000000-0000-0000-0000-000000000050', r33, u06, 'MacBook Air M3 15"',       'Apple',      'MRXN3LL/A',   'electronics',         109900, 1, '2025-02-14', 'Apple Store'),
  ('c1000000-0000-0000-0000-000000000051', r33, u06, 'AppleCare+ for MacBook Air', 'Apple',    NULL,          'service',              17900, 1, '2025-02-14', 'Apple Store'),
  ('c1000000-0000-0000-0000-000000000052', r34, u06, 'Milwaukee M18 FUEL Impact Driver', 'Milwaukee', 'M18-2853', 'tools',             17900, 1, '2025-02-18', 'Home Depot'),
  ('c1000000-0000-0000-0000-000000000053', r34, u06, 'Milwaukee Bit Set',        'Milwaukee',  NULL,          'tools',                 2900, 1, '2025-02-18', 'Home Depot'),
  ('c1000000-0000-0000-0000-000000000054', r35, u06, 'Vitamix E310 Blender',     'Vitamix',    'E310',        'appliances',           34999, 1, '2025-02-22', 'Costco'),
  ('c1000000-0000-0000-0000-000000000055', r35, u06, 'Paper Towels 12-Pack',     'Bounty',     NULL,          'consumable',            2199, 1, '2025-02-22', 'Costco'),
  ('c1000000-0000-0000-0000-000000000056', r35, u06, 'Rotisserie Chicken',       NULL,          NULL,         'food_grocery',           499, 1, '2025-02-22', 'Costco'),
  ('c1000000-0000-0000-0000-000000000057', r36, u06, 'Roland FP-30X Digital Piano', 'Roland',  'FP-30X',     'musical_instruments',   54900, 1, '2025-02-26', 'Guitar Center'),

  -- Rachel's items (from r38-r40)
  ('c1000000-0000-0000-0000-000000000058', r38, u07, 'Modern Dining Table',      'Crate & Barrel', NULL,      'furniture',           129900, 1, '2025-02-19', 'Crate & Barrel'),
  ('c1000000-0000-0000-0000-000000000059', r38, u07, 'Dining Chair (set of 4)',  'Crate & Barrel', NULL,      'furniture',            80000, 1, '2025-02-19', 'Crate & Barrel'),
  ('c1000000-0000-0000-0000-000000000060', r39, u07, 'Nespresso Vertuo Next',    'Nespresso',  'VERTUO-NEXT', 'appliances',           19900, 1, '2025-02-23', 'Target'),
  ('c1000000-0000-0000-0000-000000000061', r39, u07, 'Coffee Pod Sampler Pack',  'Nespresso',  NULL,          'consumable',            3500, 1, '2025-02-23', 'Target'),
  ('c1000000-0000-0000-0000-000000000062', r40, u07, 'iRobot Roomba j7+',       'iRobot',     'ROOMBA-J7+',  'appliances',           59900, 1, '2025-02-27', 'Amazon'),
  ('c1000000-0000-0000-0000-000000000063', r40, u07, 'Roomba Replacement Bags',  'iRobot',     NULL,          'consumable',            1900, 1, '2025-02-27', 'Amazon'),

  -- Alex's items (from r42-r45)
  ('c1000000-0000-0000-0000-000000000064', r42, u08, 'Sony A7IV Camera Body',    'Sony',       'ILCE7M4/B',   'electronics',         249800, 1, '2025-02-23', 'B&H Photo'),
  ('c1000000-0000-0000-0000-000000000065', r42, u08, 'Sony FE 24-70mm f/2.8 GM II', 'Sony',   'SEL2470GM2',  'electronics',         129800, 1, '2025-02-23', 'B&H Photo'),
  ('c1000000-0000-0000-0000-000000000066', r43, u08, 'Arc''teryx Beta AR Jacket', 'Arc''teryx', 'BETA-AR',    'clothing_apparel',     39900, 1, '2025-02-26', 'REI'),
  ('c1000000-0000-0000-0000-000000000067', r43, u08, 'Salomon X Ultra 4 GTX Boots', 'Salomon', 'XULTRA4',    'outdoor',              18900, 1, '2025-02-26', 'REI'),
  ('c1000000-0000-0000-0000-000000000068', r44, u08, 'Steam Game Bundle',        NULL,          NULL,          'digital_download',     5999, 1, '2025-02-28', 'Steam'),
  ('c1000000-0000-0000-0000-000000000069', r45, u08, 'Spotify Premium Annual',   'Spotify',    NULL,          'subscription',         11999, 1, '2025-03-01', 'Spotify'),

  -- Priya's items (from r46-r48)
  ('c1000000-0000-0000-0000-000000000070', r46, u09, 'FlexiSpot Standing Desk E7', 'FlexiSpot', 'E7',         'furniture',            44900, 1, '2025-02-27', 'Wayfair'),
  ('c1000000-0000-0000-0000-000000000071', r46, u09, 'Monitor Arm Dual',         'Ergotron',   'LX-DUAL',    'office',                8900, 1, '2025-02-27', 'Wayfair'),
  ('c1000000-0000-0000-0000-000000000072', r47, u09, 'Keychron Q1 Pro Keyboard', 'Keychron',   'Q1-PRO',     'electronics',          16900, 1, '2025-03-01', 'Amazon'),
  ('c1000000-0000-0000-0000-000000000073', r47, u09, 'Logitech MX Master 3S',   'Logitech',   'MX3S',        'electronics',           7900, 1, '2025-03-01', 'Amazon'),

  -- Tom's items (from r49-r50)
  ('c1000000-0000-0000-0000-000000000074', r49, u10, 'LG C3 55" OLED TV',       'LG',         'OLED55C3PUA', 'electronics',         129600, 1, '2025-02-28', 'Best Buy'),
  ('c1000000-0000-0000-0000-000000000075', r49, u10, 'HDMI 2.1 Cable 6ft',      NULL,          NULL,          'other_resalable',      1500, 1, '2025-02-28', 'Best Buy'),
  ('c1000000-0000-0000-0000-000000000076', r50, u10, 'Sonos Beam Gen 2',        'Sonos',      'BEAM2',       'electronics',          44900, 1, '2025-03-02', 'Amazon');


-- =============================================================================
-- 4. LISTINGS (~75)
-- Asking prices approximate depreciation from purchase_price
-- =============================================================================
INSERT INTO public.listings (id, user_id, item_id, title, description, category, condition, asking_price, currency, status, published_at, created_at) VALUES
  -- Sarah's listings (active seller)
  ('d1000000-0000-0000-0000-000000000001', u01, 'c1000000-0000-0000-0000-000000000001', 'MacBook Pro 14" M3 - Like New', 'Barely used MacBook Pro 14-inch. Comes with original box and charger. Battery cycle count under 50.', 'electronics', 'like_new', 169900, 'USD', 'active', NOW() - INTERVAL '80 days', NOW() - INTERVAL '82 days'),
  ('d1000000-0000-0000-0000-000000000002', u01, 'c1000000-0000-0000-0000-000000000002', 'Anker 7-in-1 USB-C Hub', 'Works perfectly. Compatible with all USB-C laptops.', 'electronics', 'like_new', 2499, 'USD', 'active', NOW() - INTERVAL '80 days', NOW() - INTERVAL '82 days'),
  ('d1000000-0000-0000-0000-000000000003', u01, 'c1000000-0000-0000-0000-000000000004', 'Sony WH-1000XM5 Headphones - Excellent', 'Amazing noise cancelling headphones. Includes case and all cables. Minor wear on headband.', 'electronics', 'very_good', 24500, 'USD', 'active', NOW() - INTERVAL '65 days', NOW() - INTERVAL '67 days'),
  ('d1000000-0000-0000-0000-000000000004', u01, 'c1000000-0000-0000-0000-000000000005', 'Sony WF-1000XM5 Wireless Earbuds', 'Great sound quality. Battery still holds full charge. Small scuff on case.', 'electronics', 'good', 17500, 'USD', 'sold', NOW() - INTERVAL '60 days', NOW() - INTERVAL '65 days'),
  ('d1000000-0000-0000-0000-000000000005', u01, 'c1000000-0000-0000-0000-000000000006', 'KitchenAid Artisan 5qt Stand Mixer - Silver', 'Used maybe 10 times. Comes with all standard attachments. No scratches.', 'appliances', 'like_new', 29900, 'USD', 'active', NOW() - INTERVAL '45 days', NOW() - INTERVAL '47 days'),
  ('d1000000-0000-0000-0000-000000000006', u01, 'c1000000-0000-0000-0000-000000000008', 'IKEA KALLAX 4x4 Shelf Unit - White', 'Assembled, in great condition. Some minor dings on back panel. Pickup only.', 'furniture', 'good', 5500, 'USD', 'active', NOW() - INTERVAL '35 days', NOW() - INTERVAL '37 days'),
  ('d1000000-0000-0000-0000-000000000007', u01, 'c1000000-0000-0000-0000-000000000009', 'IKEA MALM 6-Drawer Dresser - White', 'Moving sale. Good condition with normal wear. All drawers slide smoothly.', 'furniture', 'good', 14900, 'USD', 'active', NOW() - INTERVAL '35 days', NOW() - INTERVAL '37 days'),
  ('d1000000-0000-0000-0000-000000000008', u01, 'c1000000-0000-0000-0000-000000000010', 'Dyson V15 Detect Cordless Vacuum', 'Powerful vacuum with laser dust detection. All accessories included. Used for 3 months.', 'appliances', 'very_good', 52500, 'USD', 'active', NOW() - INTERVAL '25 days', NOW() - INTERVAL '27 days'),

  -- Mike's listings
  ('d1000000-0000-0000-0000-000000000009', u02, 'c1000000-0000-0000-0000-000000000013', 'DeWalt 20V MAX Drill Combo Kit', 'Drill and impact driver combo. Batteries hold charge well. Light workshop use only.', 'tools', 'very_good', 15900, 'USD', 'active', NOW() - INTERVAL '50 days', NOW() - INTERVAL '52 days'),
  ('d1000000-0000-0000-0000-000000000010', u02, 'c1000000-0000-0000-0000-000000000016', 'Herman Miller Aeron Chair - Size B', 'Fully loaded Aeron. Remastered version. All adjustments work perfectly. Some mesh wear.', 'furniture', 'good', 62000, 'USD', 'active', NOW() - INTERVAL '45 days', NOW() - INTERVAL '47 days'),
  ('d1000000-0000-0000-0000-000000000011', u02, 'c1000000-0000-0000-0000-000000000017', 'Samsung 65" QLED 4K Smart TV', 'Gorgeous picture quality. No dead pixels. Wall mount not included. Remote has small scratch.', 'electronics', 'very_good', 69900, 'USD', 'sold', NOW() - INTERVAL '35 days', NOW() - INTERVAL '37 days'),
  ('d1000000-0000-0000-0000-000000000012', u02, 'c1000000-0000-0000-0000-000000000018', 'Fender Player Stratocaster - Sunburst', 'Beautiful guitar in excellent condition. Upgraded tuners. Comes with gig bag. Frets in great shape.', 'musical_instruments', 'very_good', 99900, 'USD', 'active', NOW() - INTERVAL '30 days', NOW() - INTERVAL '32 days'),
  ('d1000000-0000-0000-0000-000000000013', u02, 'c1000000-0000-0000-0000-000000000019', 'Vitamix A3500 Blender - Brushed Stainless', 'Top of the line blender. All preset programs work. Includes tamper and recipe book.', 'appliances', 'like_new', 42900, 'USD', 'active', NOW() - INTERVAL '20 days', NOW() - INTERVAL '22 days'),
  ('d1000000-0000-0000-0000-000000000014', u02, 'c1000000-0000-0000-0000-000000000020', 'Nintendo Switch OLED - White', 'Perfect condition. Screen protector since day one. Includes dock and joycons.', 'electronics', 'like_new', 27500, 'USD', 'active', NOW() - INTERVAL '10 days', NOW() - INTERVAL '12 days'),
  ('d1000000-0000-0000-0000-000000000015', u02, 'c1000000-0000-0000-0000-000000000023', 'Osprey Atmos AG 65L Backpack - Green', 'Used for one trip. Anti-gravity suspension is incredibly comfortable. No tears or stains.', 'outdoor', 'like_new', 21500, 'USD', 'active', NOW() - INTERVAL '5 days', NOW() - INTERVAL '7 days'),

  -- Emma's listings
  ('d1000000-0000-0000-0000-000000000016', u03, 'c1000000-0000-0000-0000-000000000024', 'iPad Pro 12.9" M2 256GB - Space Gray', 'Pristine condition. Always used with case. No scratches on screen or body.', 'electronics', 'like_new', 84900, 'USD', 'active', NOW() - INTERVAL '35 days', NOW() - INTERVAL '37 days'),
  ('d1000000-0000-0000-0000-000000000017', u03, 'c1000000-0000-0000-0000-000000000025', 'Apple Pencil 2nd Generation', 'Works flawlessly. Tip has normal wear but still precise.', 'electronics', 'good', 8500, 'USD', 'active', NOW() - INTERVAL '35 days', NOW() - INTERVAL '37 days'),
  ('d1000000-0000-0000-0000-000000000018', u03, 'c1000000-0000-0000-0000-000000000026', 'West Elm Mid-Century Desk - Walnut', 'Beautiful solid wood desk. A couple small scratches on top. Drawer works smoothly.', 'furniture', 'very_good', 42500, 'USD', 'active', NOW() - INTERVAL '30 days', NOW() - INTERVAL '32 days'),
  ('d1000000-0000-0000-0000-000000000019', u03, 'c1000000-0000-0000-0000-000000000028', 'Instant Pot Duo 8-Quart', 'Used a handful of times. All parts and accessories included. Works perfectly.', 'appliances', 'like_new', 5999, 'USD', 'sold', NOW() - INTERVAL '22 days', NOW() - INTERVAL '25 days'),
  ('d1000000-0000-0000-0000-000000000020', u03, 'c1000000-0000-0000-0000-000000000030', 'Craftsman 256-Piece Mechanics Tool Set', 'Complete set, no missing pieces. Chrome finish still shiny. Case has some scuffs.', 'tools', 'very_good', 13500, 'USD', 'active', NOW() - INTERVAL '15 days', NOW() - INTERVAL '17 days'),
  ('d1000000-0000-0000-0000-000000000021', u03, 'c1000000-0000-0000-0000-000000000031', 'Kindle Paperwhite - Latest Gen', 'Great e-reader. Battery lasts weeks. Screen is flawless.', 'electronics', 'like_new', 9999, 'USD', 'draft', NOW() - INTERVAL '8 days', NOW() - INTERVAL '10 days'),

  -- James's listings
  ('d1000000-0000-0000-0000-000000000022', u04, 'c1000000-0000-0000-0000-000000000033', 'NVIDIA GeForce RTX 4070 GPU', 'Never overclocked. Runs cool and quiet. Original box and anti-static bag included.', 'electronics', 'like_new', 42900, 'USD', 'active', NOW() - INTERVAL '22 days', NOW() - INTERVAL '24 days'),
  ('d1000000-0000-0000-0000-000000000023', u04, 'c1000000-0000-0000-0000-000000000034', 'Corsair Vengeance 32GB DDR5-5600 RAM', 'Tested and stable at rated speeds. Upgraded to 64GB so selling these.', 'electronics', 'like_new', 6500, 'USD', 'active', NOW() - INTERVAL '22 days', NOW() - INTERVAL '24 days'),
  ('d1000000-0000-0000-0000-000000000024', u04, 'c1000000-0000-0000-0000-000000000035', 'IKEA MARKUS Office Chair - Black', 'Comfortable office chair. Mesh back. Armrests show light wear. Gas lift works fine.', 'furniture', 'good', 13900, 'USD', 'active', NOW() - INTERVAL '17 days', NOW() - INTERVAL '19 days'),
  ('d1000000-0000-0000-0000-000000000025', u04, 'c1000000-0000-0000-0000-000000000037', 'Peloton Exercise Mat - Large', 'Barely used. Non-slip surface. No wear marks.', 'sports_equipment', 'like_new', 3900, 'USD', 'draft', NOW() - INTERVAL '10 days', NOW() - INTERVAL '12 days'),
  ('d1000000-0000-0000-0000-000000000026', u04, 'c1000000-0000-0000-0000-000000000038', 'Bowflex SelectTech 552 Dumbbells', 'Adjustable 5-52.5 lbs each. Smooth dial mechanism. Perfect for home gym.', 'sports_equipment', 'very_good', 9900, 'USD', 'active', NOW() - INTERVAL '8 days', NOW() - INTERVAL '10 days'),

  -- Olivia's listings
  ('d1000000-0000-0000-0000-000000000027', u05, 'c1000000-0000-0000-0000-000000000040', 'Bose QC45 Noise Cancelling Headphones', 'Incredible ANC. Comfortable for long sessions. Includes hard case and cables.', 'electronics', 'like_new', 22900, 'USD', 'active', NOW() - INTERVAL '18 days', NOW() - INTERVAL '20 days'),
  ('d1000000-0000-0000-0000-000000000028', u05, 'c1000000-0000-0000-0000-000000000041', 'Modern Velvet Sofa - Emerald Green', 'Stunning sofa. Firm cushions. Pet-free and smoke-free home. Local pickup only.', 'furniture', 'like_new', 69900, 'USD', 'active', NOW() - INTERVAL '14 days', NOW() - INTERVAL '16 days'),
  ('d1000000-0000-0000-0000-000000000029', u05, 'c1000000-0000-0000-0000-000000000043', 'Ring Video Doorbell Pro 2 + Chime', 'Full kit with chime. Easy setup. Crisp 1536p video. Moving so can''t take it.', 'home_improvement', 'very_good', 17500, 'USD', 'active', NOW() - INTERVAL '10 days', NOW() - INTERVAL '12 days'),
  ('d1000000-0000-0000-0000-000000000030', u05, 'c1000000-0000-0000-0000-000000000045', 'REI Half Dome 2 Plus Tent', 'Used twice. Seams sealed, no tears. Footprint included. Great 2-person backpacking tent.', 'outdoor', 'very_good', 24900, 'USD', 'active', NOW() - INTERVAL '6 days', NOW() - INTERVAL '8 days'),
  ('d1000000-0000-0000-0000-000000000031', u05, 'c1000000-0000-0000-0000-000000000046', 'Kelty Cosmic Down 20 Sleeping Bag', 'Warm to 20F. DriDown fill. Stuff sack included. One small repair patch on shell.', 'outdoor', 'good', 11900, 'USD', 'active', NOW() - INTERVAL '6 days', NOW() - INTERVAL '8 days'),
  ('d1000000-0000-0000-0000-000000000032', u05, 'c1000000-0000-0000-0000-000000000047', 'Canon EOS R6 Mark II - Body Only', 'Outstanding camera. Shutter count under 5000. No issues whatsoever.', 'electronics', 'like_new', 199900, 'USD', 'draft', NOW() - INTERVAL '2 days', NOW() - INTERVAL '3 days'),

  -- David's listings
  ('d1000000-0000-0000-0000-000000000033', u06, 'c1000000-0000-0000-0000-000000000050', 'MacBook Air 15" M3 - Midnight', 'Used as secondary laptop. Under AppleCare until 2027. Battery health 99%.', 'electronics', 'like_new', 89900, 'USD', 'active', NOW() - INTERVAL '14 days', NOW() - INTERVAL '16 days'),
  ('d1000000-0000-0000-0000-000000000034', u06, 'c1000000-0000-0000-0000-000000000052', 'Milwaukee M18 FUEL Impact Driver', 'Professional grade power tool. Battery and charger included. Light use.', 'tools', 'very_good', 12900, 'USD', 'active', NOW() - INTERVAL '10 days', NOW() - INTERVAL '12 days'),
  ('d1000000-0000-0000-0000-000000000035', u06, 'c1000000-0000-0000-0000-000000000054', 'Vitamix E310 Explorian Blender', 'Great entry-level Vitamix. Makes smooth smoothies every time.', 'appliances', 'very_good', 24900, 'USD', 'withdrawn', NOW() - INTERVAL '7 days', NOW() - INTERVAL '9 days'),
  ('d1000000-0000-0000-0000-000000000036', u06, 'c1000000-0000-0000-0000-000000000057', 'Roland FP-30X Digital Piano - Black', '88 weighted keys. Built-in speakers sound great. Includes stand and bench.', 'musical_instruments', 'like_new', 44900, 'USD', 'active', NOW() - INTERVAL '3 days', NOW() - INTERVAL '4 days'),

  -- Rachel's listings
  ('d1000000-0000-0000-0000-000000000037', u07, 'c1000000-0000-0000-0000-000000000058', 'Modern Dining Table - Seats 6', 'Solid wood top with metal legs. Fits 6 chairs comfortably. Minor ring mark from a glass.', 'furniture', 'good', 84900, 'USD', 'active', NOW() - INTERVAL '9 days', NOW() - INTERVAL '11 days'),
  ('d1000000-0000-0000-0000-000000000038', u07, 'c1000000-0000-0000-0000-000000000059', 'Set of 4 Upholstered Dining Chairs', 'Comfortable padded seats. Light oak legs. One chair has a small fabric snag.', 'furniture', 'good', 52000, 'USD', 'active', NOW() - INTERVAL '9 days', NOW() - INTERVAL '11 days'),
  ('d1000000-0000-0000-0000-000000000039', u07, 'c1000000-0000-0000-0000-000000000060', 'Nespresso Vertuo Next - Chrome', 'Makes great coffee and espresso. Descaled recently. Includes pod holder.', 'appliances', 'very_good', 12900, 'USD', 'sold', NOW() - INTERVAL '5 days', NOW() - INTERVAL '7 days'),
  ('d1000000-0000-0000-0000-000000000040', u07, 'c1000000-0000-0000-0000-000000000062', 'iRobot Roomba j7+ Self-Emptying Robot Vacuum', 'Smart mapping works great. Avoids pet waste. Clean Base included.', 'appliances', 'like_new', 42900, 'USD', 'active', NOW() - INTERVAL '2 days', NOW() - INTERVAL '3 days'),

  -- Alex's listings
  ('d1000000-0000-0000-0000-000000000041', u08, 'c1000000-0000-0000-0000-000000000064', 'Sony A7IV Full Frame Camera Body', 'Pro-level camera. Clean sensor. Shutter count approx 8000. Original box.', 'electronics', 'very_good', 189900, 'USD', 'active', NOW() - INTERVAL '5 days', NOW() - INTERVAL '7 days'),
  ('d1000000-0000-0000-0000-000000000042', u08, 'c1000000-0000-0000-0000-000000000065', 'Sony FE 24-70mm f/2.8 GM II Lens', 'Sharpest zoom lens I have owned. No fungus, haze, or scratches. Hood and caps included.', 'electronics', 'like_new', 109900, 'USD', 'active', NOW() - INTERVAL '5 days', NOW() - INTERVAL '7 days'),
  ('d1000000-0000-0000-0000-000000000043', u08, 'c1000000-0000-0000-0000-000000000067', 'Salomon X Ultra 4 GTX Hiking Boots - Size 11', 'Waterproof Gore-Tex. Worn on 3 hikes. Great ankle support and tread.', 'outdoor', 'very_good', 12900, 'USD', 'active', NOW() - INTERVAL '3 days', NOW() - INTERVAL '4 days'),

  -- Priya's listings
  ('d1000000-0000-0000-0000-000000000044', u09, 'c1000000-0000-0000-0000-000000000070', 'FlexiSpot E7 Standing Desk - 60x30 Bamboo', 'Dual motor, smooth height adjustment. Programmable presets. Cable management tray included.', 'furniture', 'like_new', 34900, 'USD', 'active', NOW() - INTERVAL '3 days', NOW() - INTERVAL '4 days'),
  ('d1000000-0000-0000-0000-000000000045', u09, 'c1000000-0000-0000-0000-000000000071', 'Ergotron LX Dual Monitor Arm', 'Holds two monitors up to 25 lbs each. Smooth motion. Desk clamp mount.', 'office', 'like_new', 6500, 'USD', 'draft', NOW() - INTERVAL '2 days', NOW() - INTERVAL '3 days'),
  ('d1000000-0000-0000-0000-000000000046', u09, 'c1000000-0000-0000-0000-000000000072', 'Keychron Q1 Pro Mechanical Keyboard', 'Wireless with Gateron Jupiter Brown switches. QMK/VIA programmable. Knob edition.', 'electronics', 'like_new', 13500, 'USD', 'draft', NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 days'),

  -- Tom's listings
  ('d1000000-0000-0000-0000-000000000047', u10, 'c1000000-0000-0000-0000-000000000074', 'LG C3 55" 4K OLED Smart TV', 'Perfect blacks, incredible picture. Wall mounted since purchase. No burn-in.', 'electronics', 'like_new', 99900, 'USD', 'active', NOW() - INTERVAL '2 days', NOW() - INTERVAL '3 days'),
  ('d1000000-0000-0000-0000-000000000048', u10, 'c1000000-0000-0000-0000-000000000076', 'Sonos Beam Gen 2 Soundbar - Black', 'Dolby Atmos support. Deep bass for its size. AirPlay 2 compatible.', 'electronics', 'like_new', 34900, 'USD', 'draft', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

  -- Listings with no linked item (edge case: manually created)
  ('d1000000-0000-0000-0000-000000000049', u01, NULL, 'Vintage Record Player - Working', 'Found in attic. Technics SL-1200. Needs new needle but plays fine otherwise.', 'electronics', 'acceptable', 15000, 'USD', 'active', NOW() - INTERVAL '20 days', NOW() - INTERVAL '22 days'),
  ('d1000000-0000-0000-0000-000000000050', u02, NULL, 'Weber Genesis Gas Grill', '3 burners. Some rust on grates but everything works. Propane tank not included.', 'outdoor', 'acceptable', 19900, 'USD', 'active', NOW() - INTERVAL '15 days', NOW() - INTERVAL '17 days'),

  -- Expired listings (edge case)
  ('d1000000-0000-0000-0000-000000000051', u03, 'c1000000-0000-0000-0000-000000000027', 'West Elm Industrial Lamp', 'Cool industrial-style task lamp. Adjustable arm.', 'office', 'very_good', 7900, 'USD', 'expired', NOW() - INTERVAL '25 days', NOW() - INTERVAL '30 days'),
  ('d1000000-0000-0000-0000-000000000052', u04, 'c1000000-0000-0000-0000-000000000036', 'IKEA LED Desk Lamp - White', 'Simple and functional desk lamp with adjustable brightness.', 'office', 'like_new', 2500, 'USD', 'expired', NOW() - INTERVAL '12 days', NOW() - INTERVAL '20 days'),

  -- More withdrawn listings
  ('d1000000-0000-0000-0000-000000000053', u01, 'c1000000-0000-0000-0000-000000000003', 'tomtoc Laptop Sleeve 14" - Navy', 'Decided to keep it. Soft interior lining protects laptop well.', 'other_resalable', 'like_new', 1999, 'USD', 'withdrawn', NOW() - INTERVAL '75 days', NOW() - INTERVAL '80 days');


-- =============================================================================
-- 5. OFFERS (~50)
-- =============================================================================
INSERT INTO public.offers (id, listing_id, seller_id, buyer_name, buyer_email, amount, currency, message, status, responded_at, seller_message, payment_intent_id, payment_status, expires_at, created_at) VALUES
  -- Pending offers on active listings
  ('e1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', u01, 'Jake Thompson',  'jake.t@email.com',       155000, 'USD', 'Would you take $1550? I can pick up today.',        'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '48 hours', NOW() - INTERVAL '6 hours'),
  ('e1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', u01, 'Nina Patel',     'nina.p@email.com',        145000, 'USD', 'Interested! Is the battery health above 90%?',      'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '36 hours', NOW() - INTERVAL '12 hours'),
  ('e1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000003', u01, 'Carlos Reyes',   'carlos.r@email.com',       21000, 'USD', NULL,                                                 'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '47 hours', NOW() - INTERVAL '1 hour'),
  ('e1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000005', u01, 'Megan Foster',   'megan.f@email.com',        25000, 'USD', 'Love the color! Would you do $250?',                'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '24 hours', NOW() - INTERVAL '24 hours'),
  ('e1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000010', u02, 'Ryan Walsh',     'ryan.w@email.com',         55000, 'USD', 'Is this the fully loaded version with lumbar?',     'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '40 hours', NOW() - INTERVAL '8 hours'),
  ('e1000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000012', u02, 'Amanda Liu',     'amanda.l@email.com',       85000, 'USD', 'Beautiful guitar. Would you include a strap?',      'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '46 hours', NOW() - INTERVAL '2 hours'),
  ('e1000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000014', u02, 'Tyler Brooks',   'tyler.b@email.com',        24000, 'USD', 'Any drift on the joycons?',                         'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '30 hours', NOW() - INTERVAL '18 hours'),
  ('e1000000-0000-0000-0000-000000000008', 'd1000000-0000-0000-0000-000000000016', u03, 'Diana Park',     'diana.p@email.com',        75000, 'USD', 'Is the 256GB storage enough? Still fast?',          'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '42 hours', NOW() - INTERVAL '6 hours'),
  ('e1000000-0000-0000-0000-000000000009', 'd1000000-0000-0000-0000-000000000022', u04, 'Ben Nakamura',   'ben.n@email.com',          38000, 'USD', 'Will this fit in a mid-tower ATX case?',            'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '44 hours', NOW() - INTERVAL '4 hours'),
  ('e1000000-0000-0000-0000-000000000010', 'd1000000-0000-0000-0000-000000000028', u05, 'Sophie Turner',  'sophie.t@email.com',       60000, 'USD', 'What are the dimensions? Will it fit through a standard door?', 'pending', NULL, NULL, NULL, 'none', NOW() + INTERVAL '38 hours', NOW() - INTERVAL '10 hours'),
  ('e1000000-0000-0000-0000-000000000011', 'd1000000-0000-0000-0000-000000000033', u06, 'Chris Evans',    'chris.e@email.com',        80000, 'USD', 'How long is the AppleCare valid?',                  'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '35 hours', NOW() - INTERVAL '13 hours'),
  ('e1000000-0000-0000-0000-000000000012', 'd1000000-0000-0000-0000-000000000037', u07, 'Lauren Kim',     'lauren.k@email.com',       72000, 'USD', 'Can you send more photos of the ring mark?',        'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '45 hours', NOW() - INTERVAL '3 hours'),
  ('e1000000-0000-0000-0000-000000000013', 'd1000000-0000-0000-0000-000000000040', u07, 'Matt Rodriguez', 'matt.r@email.com',         38000, 'USD', 'Does it work with thick carpet?',                   'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '47 hours', NOW() - INTERVAL '1 hour'),
  ('e1000000-0000-0000-0000-000000000014', 'd1000000-0000-0000-0000-000000000041', u08, 'Jessica Hill',   'jessica.h@email.com',     175000, 'USD', 'Low shutter count is great. Any sensor dust issues?','pending', NULL, NULL, NULL, 'none', NOW() + INTERVAL '43 hours', NOW() - INTERVAL '5 hours'),
  ('e1000000-0000-0000-0000-000000000015', 'd1000000-0000-0000-0000-000000000044', u09, 'Kevin Brown',    'kevin.b@email.com',        30000, 'USD', 'What''s the max height?',                           'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '39 hours', NOW() - INTERVAL '9 hours'),
  ('e1000000-0000-0000-0000-000000000016', 'd1000000-0000-0000-0000-000000000047', u10, 'Ashley Chen',    'ashley.c@email.com',       85000, 'USD', 'Any dead pixels or image retention?',               'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '41 hours', NOW() - INTERVAL '7 hours'),
  ('e1000000-0000-0000-0000-000000000017', 'd1000000-0000-0000-0000-000000000049', u01, 'Mark Davis',     'mark.d@email.com',         12000, 'USD', 'Does the turntable include a dust cover?',          'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '44 hours', NOW() - INTERVAL '4 hours'),
  ('e1000000-0000-0000-0000-000000000018', 'd1000000-0000-0000-0000-000000000050', u02, 'Tina Nguyen',    'tina.n@email.com',         15000, 'USD', 'Can you deliver within 20 miles?',                  'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '34 hours', NOW() - INTERVAL '14 hours'),

  -- Accepted offers (on sold listings, with payment)
  ('e1000000-0000-0000-0000-000000000019', 'd1000000-0000-0000-0000-000000000004', u01, 'Derek Chang',    'derek.c@email.com',        16000, 'USD', 'Great price for these earbuds!',                    'accepted', NOW() - INTERVAL '55 days', 'Thanks! I''ll ship today.', 'pi_test_001', 'paid', NOW() - INTERVAL '53 days', NOW() - INTERVAL '58 days'),
  ('e1000000-0000-0000-0000-000000000020', 'd1000000-0000-0000-0000-000000000011', u02, 'Hannah Moore',   'hannah.m@email.com',       65000, 'USD', 'Perfect for my new apartment!',                     'accepted', NOW() - INTERVAL '30 days', 'Enjoy the TV! It''s a great panel.', 'pi_test_002', 'paid', NOW() - INTERVAL '32 days', NOW() - INTERVAL '34 days'),
  ('e1000000-0000-0000-0000-000000000021', 'd1000000-0000-0000-0000-000000000019', u03, 'Will Johnson',   'will.j@email.com',          5500, 'USD', 'Perfect for meal prep!',                            'accepted', NOW() - INTERVAL '18 days', 'Great buyer! Enjoy it.', 'pi_test_003', 'paid', NOW() - INTERVAL '20 days', NOW() - INTERVAL '23 days'),
  ('e1000000-0000-0000-0000-000000000022', 'd1000000-0000-0000-0000-000000000039', u07, 'Emily Torres',   'emily.t@email.com',        11500, 'USD', 'My old one broke, need a replacement.',             'accepted', NOW() - INTERVAL '3 days',  'Sold! Pickup anytime.', 'pi_test_004', 'paid', NOW() - INTERVAL '4 days', NOW() - INTERVAL '5 days'),

  -- Rejected offers
  ('e1000000-0000-0000-0000-000000000023', 'd1000000-0000-0000-0000-000000000001', u01, 'Lowball Larry',  'larry.l@email.com',        80000, 'USD', 'Best I can do is $800.',                            'rejected', NOW() - INTERVAL '70 days', 'Sorry, that''s too low for this condition.', NULL, 'none', NOW() - INTERVAL '68 days', NOW() - INTERVAL '72 days'),
  ('e1000000-0000-0000-0000-000000000024', 'd1000000-0000-0000-0000-000000000010', u02, 'Cheap Charlie',  'charlie.c@email.com',      30000, 'USD', 'Would you take $300?',                              'rejected', NOW() - INTERVAL '40 days', 'No thanks, firm on price for this chair.', NULL, 'none', NOW() - INTERVAL '38 days', NOW() - INTERVAL '43 days'),
  ('e1000000-0000-0000-0000-000000000025', 'd1000000-0000-0000-0000-000000000012', u02, 'Penny Pincher',  'penny.p@email.com',        50000, 'USD', NULL,                                                'rejected', NOW() - INTERVAL '25 days', 'Too low for a Player Strat in this condition.', NULL, 'none', NOW() - INTERVAL '23 days', NOW() - INTERVAL '28 days'),
  ('e1000000-0000-0000-0000-000000000026', 'd1000000-0000-0000-0000-000000000016', u03, 'Budget Bob',     'budget.b@email.com',       40000, 'USD', 'Can you go lower?',                                 'rejected', NOW() - INTERVAL '28 days', 'Sorry, price is fair for the condition.', NULL, 'none', NOW() - INTERVAL '26 days', NOW() - INTERVAL '32 days'),
  ('e1000000-0000-0000-0000-000000000027', 'd1000000-0000-0000-0000-000000000022', u04, 'Discount Dan',   'discount.d@email.com',     25000, 'USD', 'I see these cheaper on eBay.',                      'rejected', NOW() - INTERVAL '18 days', 'eBay prices don''t include shipping and fees.', NULL, 'none', NOW() - INTERVAL '16 days', NOW() - INTERVAL '20 days'),
  ('e1000000-0000-0000-0000-000000000028', 'd1000000-0000-0000-0000-000000000028', u05, 'Bargain Beth',   'bargain.b@email.com',      35000, 'USD', 'Way too expensive for used furniture.',              'rejected', NOW() - INTERVAL '10 days', 'This is a premium sofa in perfect condition.', NULL, 'none', NOW() - INTERVAL '8 days', NOW() - INTERVAL '12 days'),
  ('e1000000-0000-0000-0000-000000000029', 'd1000000-0000-0000-0000-000000000033', u06, 'Frugal Fred',    'frugal.f@email.com',       55000, 'USD', 'That''s a lot for a laptop.',                       'rejected', NOW() - INTERVAL '10 days', 'It''s still under AppleCare, price is fair.', NULL, 'none', NOW() - INTERVAL '8 days', NOW() - INTERVAL '12 days'),
  ('e1000000-0000-0000-0000-000000000030', 'd1000000-0000-0000-0000-000000000041', u08, 'Thrifty Tom',    'thrifty.t@email.com',     120000, 'USD', NULL,                                                'rejected', NOW() - INTERVAL '3 days',  'Camera alone is worth more than that.', NULL, 'none', NOW() - INTERVAL '2 days', NOW() - INTERVAL '4 days'),

  -- Expired offers (expires_at in the past)
  ('e1000000-0000-0000-0000-000000000031', 'd1000000-0000-0000-0000-000000000003', u01, 'Slow Sam',       'slow.s@email.com',          20000, 'USD', 'Very interested!',                                  'expired',  NULL, NULL, NULL, 'none', NOW() - INTERVAL '5 days', NOW() - INTERVAL '10 days'),
  ('e1000000-0000-0000-0000-000000000032', 'd1000000-0000-0000-0000-000000000009', u02, 'Delayed Dave',   'delayed.d@email.com',       13000, 'USD', 'Let me think about it...',                          'expired',  NULL, NULL, NULL, 'none', NOW() - INTERVAL '3 days', NOW() - INTERVAL '8 days'),
  ('e1000000-0000-0000-0000-000000000033', 'd1000000-0000-0000-0000-000000000018', u03, 'Tardy Tina',     'tardy.t@email.com',         35000, 'USD', 'Beautiful desk! Need to measure my space first.',   'expired',  NULL, NULL, NULL, 'none', NOW() - INTERVAL '1 day', NOW() - INTERVAL '5 days'),
  ('e1000000-0000-0000-0000-000000000034', 'd1000000-0000-0000-0000-000000000027', u05, 'Patient Pat',    'patient.p@email.com',       19000, 'USD', 'Can you hold for a week?',                          'expired',  NULL, NULL, NULL, 'none', NOW() - INTERVAL '2 days', NOW() - INTERVAL '7 days'),
  ('e1000000-0000-0000-0000-000000000035', 'd1000000-0000-0000-0000-000000000036', u06, 'Waiting Will',   'waiting.w@email.com',       39000, 'USD', 'Need to check if it fits my apartment.',            'expired',  NULL, NULL, NULL, 'none', NOW() - INTERVAL '1 day', NOW() - INTERVAL '4 days'),

  -- Withdrawn offers
  ('e1000000-0000-0000-0000-000000000036', 'd1000000-0000-0000-0000-000000000005', u01, 'Changed Mind',   'changed.m@email.com',       27000, 'USD', 'Actually I found one locally. Withdrawing.',        'withdrawn', NULL, NULL, NULL, 'none', NOW() - INTERVAL '30 days', NOW() - INTERVAL '40 days'),
  ('e1000000-0000-0000-0000-000000000037', 'd1000000-0000-0000-0000-000000000013', u02, 'Oops Oliver',    'oops.o@email.com',          38000, 'USD', 'Sorry, ordered a different model. Cancelling.',     'withdrawn', NULL, NULL, NULL, 'none', NOW() - INTERVAL '15 days', NOW() - INTERVAL '18 days'),
  ('e1000000-0000-0000-0000-000000000038', 'd1000000-0000-0000-0000-000000000029', u05, 'Regret Rachel',  'regret.r@email.com',        15000, 'USD', 'My landlord says no modifications. Withdrawing.',   'withdrawn', NULL, NULL, NULL, 'none', NOW() - INTERVAL '7 days', NOW() - INTERVAL '9 days'),
  ('e1000000-0000-0000-0000-000000000039', 'd1000000-0000-0000-0000-000000000037', u07, 'Fickle Fiona',   'fickle.f@email.com',        70000, 'USD', 'Going with a different table style.',               'withdrawn', NULL, NULL, NULL, 'none', NOW() - INTERVAL '5 days', NOW() - INTERVAL '7 days'),
  ('e1000000-0000-0000-0000-000000000040', 'd1000000-0000-0000-0000-000000000042', u08, 'Hasty Harry',    'hasty.h@email.com',         95000, 'USD', 'Changed my mind about the lens.',                   'withdrawn', NULL, NULL, NULL, 'none', NOW() - INTERVAL '3 days', NOW() - INTERVAL '4 days'),

  -- Extra pending offers for variety
  ('e1000000-0000-0000-0000-000000000041', 'd1000000-0000-0000-0000-000000000006', u01, 'Sarah Buyer',    'sarah.buyer@email.com',      4500, 'USD', 'Perfect for my apartment!',                         'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '46 hours', NOW() - INTERVAL '2 hours'),
  ('e1000000-0000-0000-0000-000000000042', 'd1000000-0000-0000-0000-000000000008', u01, 'Vacuum Victor',  'victor.v@email.com',        47000, 'USD', 'Would you include extra filters?',                  'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '40 hours', NOW() - INTERVAL '8 hours'),
  ('e1000000-0000-0000-0000-000000000043', 'd1000000-0000-0000-0000-000000000015', u02, 'Hiker Hannah',   'hiker.h@email.com',         19500, 'USD', 'What color is it? Planning a PCT section.',         'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '36 hours', NOW() - INTERVAL '12 hours'),
  ('e1000000-0000-0000-0000-000000000044', 'd1000000-0000-0000-0000-000000000020', u03, 'Handy Helen',    'handy.h@email.com',         12000, 'USD', 'Need a good tool set for the garage.',              'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '30 hours', NOW() - INTERVAL '18 hours'),
  ('e1000000-0000-0000-0000-000000000045', 'd1000000-0000-0000-0000-000000000026', u04, 'Gym Greg',       'gym.g@email.com',            8500, 'USD', 'Are these the adjustable 5-52.5 lb version?',      'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '44 hours', NOW() - INTERVAL '4 hours'),
  ('e1000000-0000-0000-0000-000000000046', 'd1000000-0000-0000-0000-000000000030', u05, 'Camper Carl',    'camper.c@email.com',        22000, 'USD', 'Great tent. What''s the packed weight?',            'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '42 hours', NOW() - INTERVAL '6 hours'),
  ('e1000000-0000-0000-0000-000000000047', 'd1000000-0000-0000-0000-000000000034', u06, 'Builder Bob',    'builder.b@email.com',       10900, 'USD', 'Does the battery hold a good charge?',              'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '38 hours', NOW() - INTERVAL '10 hours'),
  ('e1000000-0000-0000-0000-000000000048', 'd1000000-0000-0000-0000-000000000038', u07, 'Dinner Dana',    'dinner.d@email.com',        45000, 'USD', 'Would you sell the table and chairs together?',     'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '45 hours', NOW() - INTERVAL '3 hours'),
  ('e1000000-0000-0000-0000-000000000049', 'd1000000-0000-0000-0000-000000000043', u08, 'Trail Tim',      'trail.t@email.com',         11000, 'USD', 'True to size? I''m usually 10.5.',                  'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '47 hours', NOW() - INTERVAL '1 hour'),
  ('e1000000-0000-0000-0000-000000000050', 'd1000000-0000-0000-0000-000000000047', u10, 'Movie Mike',     'movie.m@email.com',         92000, 'USD', 'Would you include delivery? I''m 15 min away.',    'pending',  NULL, NULL, NULL, 'none', NOW() + INTERVAL '35 hours', NOW() - INTERVAL '13 hours');


-- =============================================================================
-- 6. AFFILIATE CLICKS (10)
-- =============================================================================
INSERT INTO public.affiliate_clicks (search_query, amazon_asin, amazon_url, amazon_title, amazon_price, agent_id, clicked_at) VALUES
  ('noise cancelling headphones',   'B0C8PSRWFM', 'https://www.amazon.com/dp/B0C8PSRWFM?tag=declutter-20', 'Sony WH-1000XM5 Wireless',        34800, 'mcp-agent-1', NOW() - INTERVAL '5 days'),
  ('standing desk',                 'B08B4HLQ7P', 'https://www.amazon.com/dp/B08B4HLQ7P?tag=declutter-20', 'FlexiSpot E7 Standing Desk',       44900, 'mcp-agent-1', NOW() - INTERVAL '4 days'),
  ('mechanical keyboard wireless',  'B0BX537GMP', 'https://www.amazon.com/dp/B0BX537GMP?tag=declutter-20', 'Keychron Q1 Pro',                  16900, 'mcp-agent-2', NOW() - INTERVAL '3 days'),
  ('robot vacuum self emptying',    'B0B6BS4SQM', 'https://www.amazon.com/dp/B0B6BS4SQM?tag=declutter-20', 'iRobot Roomba j7+',               59900, 'mcp-agent-1', NOW() - INTERVAL '3 days'),
  ('rtx 4070 graphics card',        'B0BY59G6XB', 'https://www.amazon.com/dp/B0BY59G6XB?tag=declutter-20', 'MSI GeForce RTX 4070',             54900, 'mcp-agent-3', NOW() - INTERVAL '2 days'),
  ('vitamix blender',               'B0758JHZM3', 'https://www.amazon.com/dp/B0758JHZM3?tag=declutter-20', 'Vitamix A3500 Ascent',             54999, 'mcp-agent-1', NOW() - INTERVAL '2 days'),
  ('herman miller aeron',           'B01DGM79CY', 'https://www.amazon.com/dp/B01DGM79CY?tag=declutter-20', 'Herman Miller Aeron Ergonomic',   139500, 'mcp-agent-2', NOW() - INTERVAL '1 day'),
  ('sony a7iv camera',              'B09JZT6YK5', 'https://www.amazon.com/dp/B09JZT6YK5?tag=declutter-20', 'Sony Alpha 7 IV Camera Body',    249800, 'mcp-agent-1', NOW() - INTERVAL '1 day'),
  ('camping tent 2 person',         'B07YNYFMP1', 'https://www.amazon.com/dp/B07YNYFMP1?tag=declutter-20', 'REI Co-op Half Dome SL 2+',       34900, 'mcp-agent-3', NOW() - INTERVAL '12 hours'),
  ('oled tv 55 inch',               'B0BVXF72R4', 'https://www.amazon.com/dp/B0BVXF72R4?tag=declutter-20', 'LG C3 Series 55-Inch OLED',      129600, 'mcp-agent-2', NOW() - INTERVAL '6 hours');

END $$;
