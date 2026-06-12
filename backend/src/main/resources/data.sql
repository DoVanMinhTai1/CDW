INSERT INTO roles (id, name) VALUES
    (101, 'ROLE_ADMIN'),
    (102, 'ROLE_USER')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, username, password, email, full_name, phone, avatar_url, status, created_at, updated_at) VALUES
    (1001, 'admin', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi.hbtNq0Hn9Ya4hH8XT1da3TCRqZlW', 'admin@aurora-jewelry.vn', 'Aurora Admin', '0901000001', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop', 1, NOW(), NOW()),
    (1002, 'minhanh', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi.hbtNq0Hn9Ya4hH8XT1da3TCRqZlW', 'minhanh@example.com', 'Nguyen Minh Anh', '0902000002', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&auto=format&fit=crop', 1, NOW(), NOW()),
    (1003, 'hoangnam', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi.hbtNq0Hn9Ya4hH8XT1da3TCRqZlW', 'hoangnam@example.com', 'Tran Hoang Nam', '0903000003', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop', 1, NOW(), NOW()),
    (1004, 'thaolinh', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi.hbtNq0Hn9Ya4hH8XT1da3TCRqZlW', 'thaolinh@example.com', 'Le Thao Linh', '0904000004', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop', 1, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT user_id, role_id
FROM (VALUES
    (1001, 101),
    (1002, 102),
    (1003, 102),
    (1004, 102)
) AS seed(user_id, role_id)
WHERE NOT EXISTS (
    SELECT 1
    FROM user_roles ur
    WHERE ur.user_id = seed.user_id AND ur.role_id = seed.role_id
);

INSERT INTO category (id, name, description) VALUES
    (1001, 'Nhẫn', 'Nhẫn cưới, nhẫn cầu hôn và nhẫn thời trang cao cấp'),
    (1002, 'Dây chuyền', 'Dây chuyền vàng, bạc, platinum và mặt đá quý'),
    (1003, 'Bông tai', 'Bông tai ngọc trai, kim cương và đá màu'),
    (1004, 'Vòng tay', 'Vòng tay tennis, charm và thiết kế tối giản'),
    (1005, 'Lắc chân', 'Lắc chân bạc, vàng và charm tinh tế'),
    (1006, 'Đồng hồ trang sức', 'Đồng hồ nữ đính đá và dây kim loại sang trọng'),
    (1007, 'Mặt dây', 'Mặt dây kim cương, đá quý và biểu tượng may mắn'),
    (1008, 'Trang sức cưới', 'Bộ sưu tập trang sức dành cho ngày cưới')
ON CONFLICT (id) DO NOTHING;

INSERT INTO materials (id, name, color_hex, created_at, updated_at) VALUES
    (1001, 'Vàng 18K', '#D4AF37', NOW(), NOW()),
    (1002, 'Vàng trắng 14K', '#E5E4E2', NOW(), NOW()),
    (1003, 'Bạc 925', '#C0C0C0', NOW(), NOW()),
    (1004, 'Platinum', '#E5E4E2', NOW(), NOW()),
    (1005, 'Kim cương', '#F8F8FF', NOW(), NOW()),
    (1006, 'Ngọc trai', '#F5F0E6', NOW(), NOW()),
    (1007, 'Ruby', '#E0115F', NOW(), NOW()),
    (1008, 'Sapphire', '#0F52BA', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO product (id, name, description, price, stock, weight, sku, slug, carat, clarity, color, cut, size, gender, original_url, p_code, featured, category_id, material_id) VALUES
    (1001, 'Nhẫn kim cương Aurora Solitaire', 'Nhẫn cầu hôn vàng trắng 14K với viên kim cương chủ tinh giản, phù hợp phong cách thanh lịch.', 32500000, 8, 3.2, 'RNG-AUR-SOL-001', 'nhan-kim-cuong-aurora-solitaire', 0.50, 'VS1', 'G', 'Round', '5-9', 'Female', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900&auto=format&fit=crop', 'P-R001', TRUE, 1001, 1002),
    (1002, 'Nhẫn cưới vàng 18K Classic Pair', 'Cặp nhẫn cưới vàng 18K thiết kế trơn bóng, biểu tượng gắn kết bền lâu.', 18500000, 12, 5.8, 'RNG-WED-CLS-002', 'nhan-cuoi-vang-18k-classic-pair', NULL, NULL, 'Gold', 'Polished', '6-11', 'Unisex', 'https://images.unsplash.com/photo-1515626553181-0f218cb03f14?w=900&auto=format&fit=crop', 'P-R002', FALSE, 1008, 1001),
    (1003, 'Nhẫn ruby Royal Halo', 'Nhẫn vàng 18K đính ruby trung tâm và viền đá trắng nổi bật.', 27800000, 6, 4.1, 'RNG-RBY-HAL-003', 'nhan-ruby-royal-halo', 0.80, 'SI1', 'Red', 'Oval', '5-8', 'Female', 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&auto=format&fit=crop', 'P-R003', TRUE, 1001, 1007),
    (1004, 'Nhẫn bạc Minimal Line', 'Nhẫn bạc 925 dáng mảnh, dễ phối cùng nhiều phong cách hằng ngày.', 1250000, 35, 2.0, 'RNG-SLV-MIN-004', 'nhan-bac-minimal-line', NULL, NULL, 'Silver', 'Polished', '5-10', 'Unisex', 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=900&auto=format&fit=crop', 'P-R004', FALSE, 1001, 1003),
    (1005, 'Nhẫn sapphire Midnight', 'Nhẫn platinum với sapphire xanh đậm, kiểu dáng cổ điển và sang trọng.', 41200000, 5, 4.4, 'RNG-SAP-MID-005', 'nhan-sapphire-midnight', 1.10, 'VS2', 'Blue', 'Cushion', '5-8', 'Female', 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=900&auto=format&fit=crop', 'P-R005', TRUE, 1001, 1008),
    (1006, 'Dây chuyền trái tim vàng 18K', 'Dây chuyền mặt trái tim nhỏ, hoàn thiện bóng nhẹ và phù hợp làm quà tặng.', 6900000, 20, 3.7, 'NCK-GLD-HRT-006', 'day-chuyen-trai-tim-vang-18k', NULL, NULL, 'Gold', 'Polished', '42cm', 'Female', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&auto=format&fit=crop', 'P-N006', FALSE, 1002, 1001),
    (1007, 'Dây chuyền ngọc trai Grace', 'Chuỗi ngọc trai nước ngọt ánh kem, khóa vàng trắng tinh tế.', 12800000, 10, 18.0, 'NCK-PRL-GRC-007', 'day-chuyen-ngoc-trai-grace', NULL, NULL, 'Pearl', 'Round', '45cm', 'Female', 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=900&auto=format&fit=crop', 'P-N007', FALSE, 1002, 1006),
    (1008, 'Dây chuyền kim cương Dancing Stone', 'Mặt dây kim cương chuyển động nhẹ theo từng nhịp bước.', 21500000, 9, 4.0, 'NCK-DIA-DNC-008', 'day-chuyen-kim-cuong-dancing-stone', 0.25, 'VS1', 'F', 'Round', '40cm', 'Female', 'https://images.unsplash.com/photo-1599459182681-c938b7f99f6d?w=900&auto=format&fit=crop', 'P-N008', FALSE, 1002, 1005),
    (1009, 'Dây chuyền bạc Moonlight', 'Dây chuyền bạc 925 mặt trăng khuyết, phủ rhodium chống xỉn màu.', 1650000, 28, 3.1, 'NCK-SLV-MON-009', 'day-chuyen-bac-moonlight', NULL, NULL, 'Silver', 'Polished', '42cm', 'Female', 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=900&auto=format&fit=crop', 'P-N009', FALSE, 1002, 1003),
    (1010, 'Bông tai ngọc trai Akoya', 'Bông tai nụ ngọc trai Akoya ánh hồng nhẹ, khóa vàng trắng.', 8400000, 14, 2.4, 'EAR-PRL-AKO-010', 'bong-tai-ngoc-trai-akoya', NULL, NULL, 'Pearl', 'Round', '8mm', 'Female', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=900&auto=format&fit=crop', 'P-E010', FALSE, 1003, 1006),
    (1011, 'Bông tai kim cương Halo', 'Bông tai vàng trắng đính kim cương dáng halo rực sáng.', 24500000, 7, 2.9, 'EAR-DIA-HAL-011', 'bong-tai-kim-cuong-halo', 0.40, 'VS2', 'G', 'Round', 'One Size', 'Female', 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=900&auto=format&fit=crop', 'P-E011', FALSE, 1003, 1005),
    (1012, 'Bông tai bạc Clover', 'Bông tai bạc 925 hình cỏ bốn lá, điểm đá zircon trắng.', 980000, 40, 1.8, 'EAR-SLV-CLV-012', 'bong-tai-bac-clover', NULL, NULL, 'Silver', 'Polished', 'One Size', 'Female', 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=900&auto=format&fit=crop', 'P-E012', FALSE, 1003, 1003),
    (1013, 'Bông tai ruby Drop', 'Bông tai dáng thả với ruby đỏ và chi tiết vàng 18K.', 19800000, 6, 3.3, 'EAR-RBY-DRP-013', 'bong-tai-ruby-drop', 0.70, 'SI1', 'Red', 'Pear', 'One Size', 'Female', 'https://images.unsplash.com/photo-1608508644127-ba99d7732fee?w=900&auto=format&fit=crop', 'P-E013', FALSE, 1003, 1007),
    (1014, 'Vòng tay tennis kim cương', 'Vòng tay tennis vàng trắng với dải kim cương đều màu, khóa an toàn.', 68900000, 4, 9.5, 'BRC-DIA-TEN-014', 'vong-tay-tennis-kim-cuong', 2.00, 'VS1', 'F', 'Round', '17cm', 'Female', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&auto=format&fit=crop', 'P-B014', TRUE, 1004, 1005),
    (1015, 'Vòng tay charm vàng 18K Lucky Star', 'Vòng tay vàng 18K có charm ngôi sao nhỏ, trẻ trung và dễ phối.', 7600000, 18, 4.2, 'BRC-GLD-STR-015', 'vong-tay-charm-vang-18k-lucky-star', NULL, NULL, 'Gold', 'Polished', '16-18cm', 'Female', 'https://images.unsplash.com/photo-1615655096345-61a54750068d?w=900&auto=format&fit=crop', 'P-B015', FALSE, 1004, 1001),
    (1016, 'Vòng tay bạc Infinity', 'Vòng tay bạc 925 biểu tượng vô cực, thiết kế nhẹ cho hằng ngày.', 1450000, 32, 3.6, 'BRC-SLV-INF-016', 'vong-tay-bac-infinity', NULL, NULL, 'Silver', 'Polished', '16-19cm', 'Unisex', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=900&auto=format&fit=crop', 'P-B016', FALSE, 1004, 1003),
    (1017, 'Vòng tay sapphire Ocean', 'Vòng tay platinum điểm sapphire xanh biển, cảm hứng đại dương.', 33600000, 5, 8.0, 'BRC-SAP-OCN-017', 'vong-tay-sapphire-ocean', 1.50, 'VS2', 'Blue', 'Round', '17cm', 'Female', 'https://images.unsplash.com/photo-1620656798579-1984d9e87df1?w=900&auto=format&fit=crop', 'P-B017', FALSE, 1004, 1008),
    (1018, 'Lắc chân bạc Tiny Bell', 'Lắc chân bạc 925 kèm chuông nhỏ, phong cách nữ tính.', 890000, 30, 2.5, 'ANK-SLV-BEL-018', 'lac-chan-bac-tiny-bell', NULL, NULL, 'Silver', 'Polished', '22-25cm', 'Female', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&auto=format&fit=crop', 'P-A018', FALSE, 1005, 1003),
    (1019, 'Lắc chân vàng 18K Sunray', 'Lắc chân vàng 18K mảnh, charm tia nắng nhỏ tinh tế.', 5200000, 15, 2.8, 'ANK-GLD-SUN-019', 'lac-chan-vang-18k-sunray', NULL, NULL, 'Gold', 'Polished', '22-25cm', 'Female', 'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=900&auto=format&fit=crop', 'P-A019', FALSE, 1005, 1001),
    (1020, 'Đồng hồ trang sức Celeste', 'Đồng hồ nữ mặt xà cừ, viền đá trắng và dây thép mạ vàng.', 15200000, 9, 38.0, 'WAT-CEL-020', 'dong-hop-trang-suc-celeste', NULL, NULL, 'Mother of Pearl', 'Polished', '28mm', 'Female', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=900&auto=format&fit=crop', 'P-W020', FALSE, 1006, 1001),
    (1021, 'Đồng hồ bạc Stella', 'Đồng hồ dây bạc mặt tối giản, phù hợp trang phục công sở.', 9800000, 11, 42.0, 'WAT-STL-021', 'dong-hop-bac-stella', NULL, NULL, 'Silver', 'Polished', '30mm', 'Female', 'https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=900&auto=format&fit=crop', 'P-W021', FALSE, 1006, 1003),
    (1022, 'Mặt dây kim cương North Star', 'Mặt dây hình sao Bắc Đẩu đính kim cương nhỏ, vàng trắng 14K.', 11200000, 13, 1.7, 'PND-DIA-NST-022', 'mat-day-kim-cuong-north-star', 0.18, 'VS1', 'F', 'Round', 'One Size', 'Female', 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=900&auto=format&fit=crop', 'P-P022', FALSE, 1007, 1005),
    (1023, 'Mặt dây ruby Heart Flame', 'Mặt dây ruby hình trái tim, sắc đỏ nổi bật trên nền vàng 18K.', 13800000, 8, 2.1, 'PND-RBY-HRT-023', 'mat-day-ruby-heart-flame', 0.55, 'SI1', 'Red', 'Heart', 'One Size', 'Female', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=900&auto=format&fit=crop', 'P-P023', FALSE, 1007, 1007),
    (1024, 'Mặt dây bạc Zodiac', 'Mặt dây bạc 925 chủ đề cung hoàng đạo, có thể khắc tên.', 1150000, 45, 2.2, 'PND-SLV-ZOD-024', 'mat-day-bac-zodiac', NULL, NULL, 'Silver', 'Engraved', 'One Size', 'Unisex', 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=900&auto=format&fit=crop', 'P-P024', FALSE, 1007, 1003),
    (1025, 'Bộ trang sức cưới Eterna', 'Bộ dây chuyền và bông tai vàng trắng đính đá, dành cho lễ cưới.', 56500000, 3, 24.0, 'SET-WED-ETR-025', 'bo-trang-suc-cuoi-eterna', 1.20, 'VS2', 'G', 'Round', 'Set', 'Female', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&auto=format&fit=crop', 'P-S025', TRUE, 1008, 1002),
    (1026, 'Nhẫn nam Platinum Edge', 'Nhẫn nam platinum bản vừa, hoàn thiện xước satin mạnh mẽ.', 22400000, 10, 7.4, 'RNG-PLT-EDG-026', 'nhan-nam-platinum-edge', NULL, NULL, 'Platinum', 'Satin', '8-12', 'Male', 'https://images.unsplash.com/photo-1602752250015-52934bc45613?w=900&auto=format&fit=crop', 'P-R026', FALSE, 1001, 1004),
    (1027, 'Dây chuyền nam Black Sapphire', 'Dây chuyền nam mặt sapphire xanh đen, thiết kế gọn và hiện đại.', 17600000, 7, 6.5, 'NCK-SAP-BLK-027', 'day-chuyen-nam-black-sapphire', 0.90, 'VS2', 'Blue', 'Emerald', '50cm', 'Male', 'https://images.unsplash.com/photo-1619119069152-a2b331eb392a?w=900&auto=format&fit=crop', 'P-N027', FALSE, 1002, 1008),
    (1028, 'Bông tai vàng Mini Hoop', 'Bông tai vòng nhỏ vàng 18K, nhẹ và tiện dụng mỗi ngày.', 3900000, 25, 2.2, 'EAR-GLD-HOP-028', 'bong-tai-vang-mini-hoop', NULL, NULL, 'Gold', 'Polished', '12mm', 'Female', 'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=900&auto=format&fit=crop', 'P-E028', FALSE, 1003, 1001),
    (1029, 'Vòng tay ngọc trai Belle', 'Vòng tay ngọc trai nước ngọt phối charm vàng trắng.', 7200000, 13, 9.0, 'BRC-PRL-BEL-029', 'vong-tay-ngoc-trai-belle', NULL, NULL, 'Pearl', 'Round', '17cm', 'Female', 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=900&auto=format&fit=crop', 'P-B029', FALSE, 1004, 1006),
    (1030, 'Lắc chân sapphire Dew', 'Lắc chân vàng trắng điểm sapphire xanh nhỏ, thanh mảnh.', 8600000, 9, 3.0, 'ANK-SAP-DEW-030', 'lac-chan-sapphire-dew', 0.25, 'VS2', 'Blue', 'Round', '22-25cm', 'Female', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&auto=format&fit=crop', 'P-A030', FALSE, 1005, 1008)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_image (id, url, is_primary, product_id) VALUES
    (1001, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900&auto=format&fit=crop', TRUE, 1001),
    (1002, 'https://images.unsplash.com/photo-1515626553181-0f218cb03f14?w=900&auto=format&fit=crop', TRUE, 1002),
    (1003, 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&auto=format&fit=crop', TRUE, 1003),
    (1004, 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=900&auto=format&fit=crop', TRUE, 1004),
    (1005, 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=900&auto=format&fit=crop', TRUE, 1005),
    (1006, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&auto=format&fit=crop', TRUE, 1006),
    (1007, 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=900&auto=format&fit=crop', TRUE, 1007),
    (1008, 'https://images.unsplash.com/photo-1599459182681-c938b7f99f6d?w=900&auto=format&fit=crop', TRUE, 1008),
    (1009, 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=900&auto=format&fit=crop', TRUE, 1009),
    (1010, 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=900&auto=format&fit=crop', TRUE, 1010),
    (1011, 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=900&auto=format&fit=crop', TRUE, 1011),
    (1012, 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=900&auto=format&fit=crop', TRUE, 1012),
    (1013, 'https://images.unsplash.com/photo-1608508644127-ba99d7732fee?w=900&auto=format&fit=crop', TRUE, 1013),
    (1014, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&auto=format&fit=crop', TRUE, 1014),
    (1015, 'https://images.unsplash.com/photo-1615655096345-61a54750068d?w=900&auto=format&fit=crop', TRUE, 1015),
    (1016, 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=900&auto=format&fit=crop', TRUE, 1016),
    (1017, 'https://images.unsplash.com/photo-1620656798579-1984d9e87df1?w=900&auto=format&fit=crop', TRUE, 1017),
    (1018, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&auto=format&fit=crop', TRUE, 1018),
    (1019, 'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=900&auto=format&fit=crop', TRUE, 1019),
    (1020, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=900&auto=format&fit=crop', TRUE, 1020),
    (1021, 'https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=900&auto=format&fit=crop', TRUE, 1021),
    (1022, 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=900&auto=format&fit=crop', TRUE, 1022),
    (1023, 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=900&auto=format&fit=crop', TRUE, 1023),
    (1024, 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=900&auto=format&fit=crop', TRUE, 1024),
    (1025, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&auto=format&fit=crop', TRUE, 1025),
    (1026, 'https://images.unsplash.com/photo-1602752250015-52934bc45613?w=900&auto=format&fit=crop', TRUE, 1026),
    (1027, 'https://images.unsplash.com/photo-1619119069152-a2b331eb392a?w=900&auto=format&fit=crop', TRUE, 1027),
    (1028, 'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=900&auto=format&fit=crop', TRUE, 1028),
    (1029, 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=900&auto=format&fit=crop', TRUE, 1029),
    (1030, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&auto=format&fit=crop', TRUE, 1030),
    (1031, 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=900&auto=format&fit=crop', FALSE, 1001),
    (1032, 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=900&auto=format&fit=crop', FALSE, 1006),
    (1033, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&auto=format&fit=crop', FALSE, 1025)
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_addresses (id, user_id, first_name, last_name, street_address, city, postal_code, country, is_default, created_at, updated_at) VALUES
    (1001, 1002, 'Minh', 'Anh', '12 Nguyen Hue, Ben Nghe', 'Ho Chi Minh City', '700000', 'Vietnam', TRUE, NOW(), NOW()),
    (1002, 1003, 'Hoang', 'Nam', '45 Le Loi, Hai Chau', 'Da Nang', '550000', 'Vietnam', TRUE, NOW(), NOW()),
    (1003, 1004, 'Thao', 'Linh', '88 Tran Phu, Ba Dinh', 'Ha Noi', '100000', 'Vietnam', TRUE, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO review (id, rating, comment, created_at, user_id, product_id) VALUES
    (1001, 5, 'Nhẫn rất sáng, đóng gói đẹp và đúng size.', NOW() - INTERVAL '14 days', 1002, 1001),
    (1002, 5, 'Dây chuyền tinh tế, hợp làm quà sinh nhật.', NOW() - INTERVAL '12 days', 1003, 1006),
    (1003, 4, 'Bông tai ngọc trai đẹp, màu hơi kem hơn ảnh.', NOW() - INTERVAL '10 days', 1004, 1010),
    (1004, 5, 'Vòng tay chắc chắn, đá lên rất đều.', NOW() - INTERVAL '9 days', 1002, 1014),
    (1005, 4, 'Sản phẩm nhẹ, đeo hằng ngày rất tiện.', NOW() - INTERVAL '8 days', 1003, 1016),
    (1006, 5, 'Ruby màu đẹp, nhìn sang hơn mong đợi.', NOW() - INTERVAL '7 days', 1004, 1003),
    (1007, 5, 'Đồng hồ thanh lịch, dây vừa tay.', NOW() - INTERVAL '5 days', 1002, 1020),
    (1008, 4, 'Mặt dây nhỏ xinh, hoàn thiện tốt.', NOW() - INTERVAL '4 days', 1003, 1022),
    (1009, 5, 'Bộ trang sức cưới rất nổi bật khi lên ảnh.', NOW() - INTERVAL '3 days', 1004, 1025),
    (1010, 4, 'Lắc chân đẹp, khóa hơi nhỏ nhưng chắc.', NOW() - INTERVAL '2 days', 1002, 1019)
ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (
    id, order_code, user_id, user_name, user_email, user_phone, total_tickets,
    sub_total, estimated_tax, total_price, payment_method,
    status, gift_message, shipping_address_dump, paid_at, created_at, updated_at
)
SELECT
    id, order_code, user_id, user_name, user_email, user_phone, total_tickets,
    sub_total, estimated_tax, total_price, payment_method,
    status, gift_message, shipping_address_dump, paid_at, created_at, updated_at
FROM (VALUES
          ('11111111-1111-1111-1111-111111111001', 'AUR-94012', 1002, 'Minh Anh', 'minhanh@example.com', '0901234567', 2, 39400000, 3152000, 42552000, 'CREDIT_CARD', 'DELIVERED', 'Chuc mung ky niem cua chung minh.', '12 Nguyen Hue, Ben Nghe, Ho Chi Minh City, Vietnam', NOW() - INTERVAL '11 days', NOW() - INTERVAL '12 days', NOW() - INTERVAL '10 days'),
          ('11111111-1111-1111-1111-111111111002', 'AUR-94013', 1003, 'Hoang Nam', 'hoangnam@example.com', '0912345678', 2, 22500000, 1800000, 24300000, 'BANK_TRANSFER', 'PROCESSING', NULL, '45 Le Loi, Hai Chau, Da Nang, Vietnam', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),
          ('11111111-1111-1111-1111-111111111003', 'AUR-94014', 1004, 'Thao Linh', 'thaolinh@example.com', '0987654321', 1, 56500000, 4520000, 61020000, 'CREDIT_CARD', 'DELIVERED', 'Gui co dau trong ngay dac biet.', '88 Tran Phu, Ba Dinh, Ha Noi, Vietnam', NOW() - INTERVAL '20 days', NOW() - INTERVAL '21 days', NOW() - INTERVAL '19 days')
     ) AS seed(id, order_code, user_id, user_name, user_email, user_phone, total_tickets, sub_total, estimated_tax, total_price, payment_method, status, gift_message, shipping_address_dump, paid_at, created_at, updated_at)
WHERE NOT EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.id = seed.id OR o.order_code = seed.order_code
);

-- This second statement can now run safely once the orders exist
INSERT INTO order_item (id, quantity, size, price, order_id, product_id) VALUES
                                                                             (1001, 1, 6, 32500000, '11111111-1111-1111-1111-111111111001', 1001),
                                                                             (1002, 1, NULL, 6900000, '11111111-1111-1111-1111-111111111001', 1006),
                                                                             (1003, 1, NULL, 21500000, '11111111-1111-1111-1111-111111111002', 1008),
                                                                             (1004, 1, NULL, 1000000, '11111111-1111-1111-1111-111111111002', 1024),
                                                                             (1005, 1, NULL, 56500000, '11111111-1111-1111-1111-111111111003', 1025)
    ON CONFLICT (id) DO NOTHING;
INSERT INTO wishlist (id, user_id, product_id, added_at) VALUES
    (1001, 1002, 1014, NOW() - INTERVAL '6 days'),
    (1002, 1002, 1020, NOW() - INTERVAL '5 days'),
    (1003, 1003, 1005, NOW() - INTERVAL '4 days'),
    (1004, 1004, 1028, NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO cart_item (id, quantity, size, price, user_id, product_id) VALUES
    (1001, 1, 7, 27800000, 1002, 1003),
    (1002, 2, NULL, 980000, 1003, 1012),
    (1003, 1, NULL, 7200000, 1004, 1029)
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('roles', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM roles), 1), TRUE);
SELECT setval(pg_get_serial_sequence('users', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM users), 1), TRUE);
SELECT setval(pg_get_serial_sequence('category', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM category), 1), TRUE);
SELECT setval(pg_get_serial_sequence('materials', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM materials), 1), TRUE);
SELECT setval(pg_get_serial_sequence('product', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM product), 1), TRUE);
SELECT setval(pg_get_serial_sequence('product_image', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM product_image), 1), TRUE);
SELECT setval(pg_get_serial_sequence('user_addresses', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM user_addresses), 1), TRUE);
SELECT setval(pg_get_serial_sequence('review', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM review), 1), TRUE);
SELECT setval(pg_get_serial_sequence('order_item', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM order_item), 1), TRUE);
SELECT setval(pg_get_serial_sequence('wishlist', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM wishlist), 1), TRUE);
SELECT setval(pg_get_serial_sequence('cart_item', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM cart_item), 1), TRUE);
