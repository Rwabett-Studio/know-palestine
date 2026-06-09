-- ─────────────────────────────────────────────────────────────────────────────
-- Fix broken image URLs in seed data
-- Run in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- CITIES
UPDATE cities SET image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Jerusalem-2013%282%29-Temple_Mount-Dome_of_the_Rock_%28SE_exposure%29.jpg/640px-Jerusalem-2013%282%29-Temple_Mount-Dome_of_the_Rock_%28SE_exposure%29.jpg' WHERE id = 'al-quds';
UPDATE cities SET image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/BTS_Hebron_Tour_280215_24.jpg/640px-BTS_Hebron_Tour_280215_24.jpg' WHERE id = 'al-khalil';
UPDATE cities SET image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Images_of_war_23-25_from_Gaza%2C_by_Jaber_Badwen%2C_IMG_6315.jpg/640px-Images_of_war_23-25_from_Gaza%2C_by_Jaber_Badwen%2C_IMG_6315.jpg' WHERE id = 'ghazza';
UPDATE cities SET image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Nablus_2013.jpg/640px-Nablus_2013.jpg' WHERE id = 'nablus';
UPDATE cities SET image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/The_Hanging_Gardens_of_Haifa%2C_Israel_%2850099173503%29_%28cropped%29.jpg/640px-The_Hanging_Gardens_of_Haifa%2C_Israel_%2850099173503%29_%28cropped%29.jpg' WHERE id = 'haifa';
UPDATE cities SET image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/ISR-2013-Aerial-Jaffa-Port_of_Jaffa.jpg/640px-ISR-2013-Aerial-Jaffa-Port_of_Jaffa.jpg' WHERE id = 'yaffa';
UPDATE cities SET image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Salfit2024.jpg/640px-Salfit2024.jpg' WHERE id = 'salfit';
UPDATE cities SET image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Mausol%C3%A9e_de_Yasser_Arafat.jpg/640px-Mausol%C3%A9e_de_Yasser_Arafat.jpg' WHERE id = 'ramallah';
UPDATE cities SET image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Beit_shean.jpg/640px-Beit_shean.jpg' WHERE id = 'bisan';

-- FIGURES
UPDATE figures SET portrait = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Leader_of_the_PLO%2C_Yasser_Arafat%2C_1996_Dan_Hadani_Archive.jpg/640px-Leader_of_the_PLO%2C_Yasser_Arafat%2C_1996_Dan_Hadani_Archive.jpg' WHERE id = 'yasser-arafat';
UPDATE figures SET portrait = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/MahmoudDarwish.jpg/640px-MahmoudDarwish.jpg' WHERE id = 'mahmoud-darwish';
UPDATE figures SET portrait = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Jerusalem-2013-Temple_Mount-Al-Aqsa_Mosque_%28NE_exposure%29.jpg/640px-Jerusalem-2013-Temple_Mount-Al-Aqsa_Mosque_%28NE_exposure%29.jpg' WHERE id = 'ghassan-kanafani';
UPDATE figures SET portrait = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Edward_Said_and_Daniel_Barenboim_in_Sevilla%2C_2002_%28Said%29.jpg/640px-Edward_Said_and_Daniel_Barenboim_in_Sevilla%2C_2002_%28Said%29.jpg' WHERE id = 'edward-said';
UPDATE figures SET portrait = 'https://upload.wikimedia.org/wikipedia/en/f/fa/Fadwa_Tuqan.jpg' WHERE id = 'fadwa-touqan';
UPDATE figures SET portrait = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Izz_ad-Din_al-Qassam_HQ.jpg/640px-Izz_ad-Din_al-Qassam_HQ.jpg' WHERE id = 'izz-aldin-alqassam';
UPDATE figures SET portrait = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Leila_Khaled_%28cropped%29.jpg/640px-Leila_Khaled_%28cropped%29.jpg' WHERE id = 'leila-khaled';

-- HISTORY EVENTS
UPDATE history_events SET image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Balfour_declaration_unmarked.jpg/640px-Balfour_declaration_unmarked.jpg' WHERE id = 'balfour-1917';
UPDATE history_events SET image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Haifa_1948_expulsion.jpg/640px-Haifa_1948_expulsion.jpg' WHERE id = 'nakba-1948';
UPDATE history_events SET image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/6DayWarEnglish.png/640px-6DayWarEnglish.png' WHERE id = 'naksa-1967';
UPDATE history_events SET image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Intifada_in_Gaza_Strip%2C_1987_V_Dan_Hadani_Archive.jpg/640px-Intifada_in_Gaza_Strip%2C_1987_V_Dan_Hadani_Archive.jpg' WHERE id = 'intifada-1987';
UPDATE history_events SET image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Bill_Clinton%2C_Yitzhak_Rabin%2C_Yasser_Arafat_at_the_White_House_1993-09-13.jpg/640px-Bill_Clinton%2C_Yitzhak_Rabin%2C_Yasser_Arafat_at_the_White_House_1993-09-13.jpg' WHERE id = 'oslo-1993';
UPDATE history_events SET image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Jerusalem-2013-Temple_Mount-Al-Aqsa_Mosque_%28NE_exposure%29.jpg/640px-Jerusalem-2013-Temple_Mount-Al-Aqsa_Mosque_%28NE_exposure%29.jpg' WHERE id = 'aqsa-intifada-2000';
UPDATE history_events SET image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Images_of_war_23-25_from_Gaza%2C_by_Jaber_Badwen%2C_IMG_6315.jpg/640px-Images_of_war_23-25_from_Gaza%2C_by_Jaber_Badwen%2C_IMG_6315.jpg' WHERE id = 'tufan-alaqsa-2023';

-- ARTICLES — fix broken image URLs
UPDATE articles SET image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Haifa_1948_expulsion.jpg/640px-Haifa_1948_expulsion.jpg' WHERE id = 'salam-mafqoud';
UPDATE articles SET image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Images_of_war_23-25_from_Gaza%2C_by_Jaber_Badwen%2C_IMG_6315.jpg/640px-Images_of_war_23-25_from_Gaza%2C_by_Jaber_Badwen%2C_IMG_6315.jpg' WHERE id = 'tifl-aouni';
UPDATE articles SET image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Jerusalem-2013-Temple_Mount-Al-Aqsa_Mosque_%28NE_exposure%29.jpg/640px-Jerusalem-2013-Temple_Mount-Al-Aqsa_Mosque_%28NE_exposure%29.jpg' WHERE id = 'ard-almoqawama';
-- Fix articles with empty images
UPDATE articles SET image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Nablus_2013.jpg/640px-Nablus_2013.jpg' WHERE image = '' OR image IS NULL;

-- Fix 2 articles with broken titles (body text was stored in title field)
UPDATE articles
SET title = 'كيف بدأت شرارة الإنتفاضة الفلسطينية الكبرى؟'
WHERE id LIKE 'كيف-بدأت-شرارة%';

UPDATE articles
SET title = 'لوحة فنية بعنوان ''أرض المقاومة'' هل ترى ما أرى؟'
WHERE id LIKE 'عنوان-المقال%';
