export interface DBFoodItem {
  id: string;
  name: string;
  category: string;
  calories: number; // kcal
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  serving: string; // standard serving description
  aliases: string[]; // search keywords to match
}

export const INDIAN_FOOD_DB: DBFoodItem[] = [
  // --- STAPLES & BREADS ---
  {
    id: "roti_plain",
    name: "Roti / Chapati (Plain, no oil/ghee)",
    category: "Breads & Staples",
    calories: 85,
    protein: 3.1,
    carbs: 18.2,
    fat: 0.5,
    serving: "1 medium (approx 35g)",
    aliases: ["roti", "chapati", "phulka", "chapatis", "rotis"]
  },
  {
    id: "roti_butter",
    name: "Roti with Butter/Ghee",
    category: "Breads & Staples",
    calories: 120,
    protein: 3.1,
    carbs: 18.2,
    fat: 4.5,
    serving: "1 medium",
    aliases: ["butter roti", "ghee roti", "roti with ghee", "roti with butter"]
  },
  {
    id: "tandoori_roti_plain",
    name: "Tandoori Roti (Plain)",
    category: "Breads & Staples",
    calories: 110,
    protein: 4.0,
    carbs: 22.0,
    fat: 0.5,
    serving: "1 pc",
    aliases: ["tandoori roti", "tandoori phulka"]
  },
  {
    id: "tandoori_roti_butter",
    name: "Tandoori Roti (Butter)",
    category: "Breads & Staples",
    calories: 145,
    protein: 4.0,
    carbs: 22.0,
    fat: 4.5,
    serving: "1 pc",
    aliases: ["butter tandoori roti"]
  },
  {
    id: "plain_paratha",
    name: "Plain Paratha (Ghee/Oil roasted)",
    category: "Breads & Staples",
    calories: 220,
    protein: 4.5,
    carbs: 32.0,
    fat: 8.5,
    serving: "1 pc",
    aliases: ["paratha", "plain paratha", "parathas"]
  },
  {
    id: "aloo_paratha",
    name: "Aloo Paratha (with oil/butter)",
    category: "Breads & Staples",
    calories: 290,
    protein: 6.0,
    carbs: 45.0,
    fat: 10.0,
    serving: "1 medium pc",
    aliases: ["aloo paratha", "alu paratha", "potato paratha"]
  },
  {
    id: "paneer_paratha",
    name: "Paneer Paratha",
    category: "Breads & Staples",
    calories: 330,
    protein: 12.5,
    carbs: 42.0,
    fat: 13.0,
    serving: "1 medium pc",
    aliases: ["paneer paratha", "cheese paratha"]
  },
  {
    id: "gobi_paratha",
    name: "Gobi Paratha",
    category: "Breads & Staples",
    calories: 240,
    protein: 5.5,
    carbs: 38.0,
    fat: 8.0,
    serving: "1 medium pc",
    aliases: ["gobi paratha", "cauliflower paratha"]
  },
  {
    id: "butter_naan",
    name: "Butter Naan",
    category: "Breads & Staples",
    calories: 310,
    protein: 8.0,
    carbs: 48.0,
    fat: 11.0,
    serving: "1 pc",
    aliases: ["butter naan", "naan", "nan"]
  },
  {
    id: "garlic_naan",
    name: "Garlic Naan (Butter)",
    category: "Breads & Staples",
    calories: 325,
    protein: 8.2,
    carbs: 49.0,
    fat: 11.5,
    serving: "1 pc",
    aliases: ["garlic naan", "garlic butter naan"]
  },
  {
    id: "bhatura",
    name: "Bhatura (Deep fried bread)",
    category: "Breads & Staples",
    calories: 250,
    protein: 4.5,
    carbs: 34.0,
    fat: 11.0,
    serving: "1 large pc",
    aliases: ["bhatura", "bhature"]
  },
  {
    id: "puri",
    name: "Puri / Poori (Deep fried bread)",
    category: "Breads & Staples",
    calories: 101,
    protein: 1.8,
    carbs: 13.5,
    fat: 5.0,
    serving: "1 pc",
    aliases: ["puri", "poori", "puris"]
  },

  // --- RICE & BIRYANIS ---
  {
    id: "white_rice",
    name: "Plain Cooked White Rice (Basmati)",
    category: "Rice & Grains",
    calories: 130,
    protein: 2.7,
    carbs: 28.0,
    fat: 0.3,
    serving: "100g (approx 1/2 cup cooked)",
    aliases: ["white rice", "rice", "boiled rice", "cooked rice", "bhaat", "chawal"]
  },
  {
    id: "brown_rice",
    name: "Cooked Brown Rice",
    category: "Rice & Grains",
    calories: 111,
    protein: 2.6,
    carbs: 23.0,
    fat: 0.9,
    serving: "100g (approx 1/2 cup cooked)",
    aliases: ["brown rice"]
  },
  {
    id: "jeera_rice",
    name: "Jeera Rice (roasted with oil/ghee)",
    category: "Rice & Grains",
    calories: 180,
    protein: 3.5,
    carbs: 35.0,
    fat: 3.5,
    serving: "1 plate (approx 150g)",
    aliases: ["jeera rice", "zeera rice"]
  },
  {
    id: "veg_pulao",
    name: "Vegetable Pulao / Pilaf",
    category: "Rice & Grains",
    calories: 240,
    protein: 4.8,
    carbs: 45.0,
    fat: 5.0,
    serving: "1 medium plate (approx 200g)",
    aliases: ["veg pulao", "vegetable pulao", "pulao"]
  },
  {
    id: "khichdi_plain",
    name: "Plain Dal Khichdi (with 1 tsp ghee)",
    category: "Rice & Grains",
    calories: 290,
    protein: 9.5,
    carbs: 52.0,
    fat: 5.5,
    serving: "1 bowl (approx 250g)",
    aliases: ["khichdi", "khichri", "dal khichdi"]
  },
  {
    id: "chicken_biryani",
    name: "Chicken Biryani (Standard commercial style)",
    category: "Rice & Grains",
    calories: 480,
    protein: 22.0,
    carbs: 58.0,
    fat: 17.0,
    serving: "1 plate (approx 300g)",
    aliases: ["chicken biryani", "biryani", "chicken biriyani"]
  },
  {
    id: "veg_biryani",
    name: "Vegetable Biryani",
    category: "Rice & Grains",
    calories: 380,
    protein: 8.5,
    carbs: 62.0,
    fat: 11.5,
    serving: "1 plate (approx 300g)",
    aliases: ["veg biryani", "vegetable biryani"]
  },
  {
    id: "egg_fried_rice",
    name: "Egg Fried Rice (Chinese style)",
    category: "Rice & Grains",
    calories: 320,
    protein: 10.5,
    carbs: 48.0,
    fat: 9.5,
    serving: "1 plate (approx 220g)",
    aliases: ["egg fried rice", "fried rice"]
  },

  // --- VEG CURRIES & DAL ---
  {
    id: "yellow_dal_tadka",
    name: "Yellow Dal Tadka (Toor / Moong)",
    category: "Dals & Curries",
    calories: 140,
    protein: 7.0,
    carbs: 21.0,
    fat: 3.5,
    serving: "1 bowl (approx 150ml)",
    aliases: ["dal tadka", "yellow dal", "dal fry", "arhar dal", "toor dal", "yellow daal", "dal"]
  },
  {
    id: "dal_makhani",
    name: "Dal Makhani (with cream and butter)",
    category: "Dals & Curries",
    calories: 280,
    protein: 9.2,
    carbs: 26.0,
    fat: 15.5,
    serving: "1 bowl (approx 150ml)",
    aliases: ["dal makhani", "dal makhni", "makhani dal"]
  },
  {
    id: "paneer_butter_masala",
    name: "Paneer Butter Masala",
    category: "Dals & Curries",
    calories: 340,
    protein: 12.0,
    carbs: 12.0,
    fat: 28.0,
    serving: "1 bowl (approx 150g)",
    aliases: ["paneer butter masala", "paneer butter", "butter paneer"]
  },
  {
    id: "palak_paneer",
    name: "Palak Paneer",
    category: "Dals & Curries",
    calories: 190,
    protein: 11.5,
    carbs: 8.0,
    fat: 13.0,
    serving: "1 bowl (approx 150g)",
    aliases: ["palak paneer", "spinach paneer"]
  },
  {
    id: "kadai_paneer",
    name: "Kadai Paneer",
    category: "Dals & Curries",
    calories: 260,
    protein: 12.2,
    carbs: 10.0,
    fat: 19.5,
    serving: "1 bowl (approx 150g)",
    aliases: ["kadai paneer", "karahi paneer"]
  },
  {
    id: "paneer_bhurji",
    name: "Paneer Bhurji (Scrambled Cottage Cheese)",
    category: "Dals & Curries",
    calories: 275,
    protein: 14.5,
    carbs: 6.5,
    fat: 21.0,
    serving: "1 plate (approx 150g)",
    aliases: ["paneer bhurji", "scrambled paneer", "paneer bhurzi"]
  },
  {
    id: "chole_masala",
    name: "Chole Masala / Chickpeas Curry",
    category: "Dals & Curries",
    calories: 180,
    protein: 7.2,
    carbs: 28.0,
    fat: 4.5,
    serving: "1 bowl (approx 150g)",
    aliases: ["chole", "chana masala", "choley", "chole masala"]
  },
  {
    id: "rajma_masala",
    name: "Rajma Masala / Red Kidney Beans Curry",
    category: "Dals & Curries",
    calories: 165,
    protein: 7.8,
    carbs: 24.0,
    fat: 4.2,
    serving: "1 bowl (approx 150g)",
    aliases: ["rajma", "rajmah", "rajma masala"]
  },
  {
    id: "mixed_veg",
    name: "Mixed Vegetable Sabji (Dry style)",
    category: "Dals & Curries",
    calories: 120,
    protein: 3.2,
    carbs: 14.0,
    fat: 6.0,
    serving: "1 cup (approx 150g)",
    aliases: ["mixed veg", "veg sabji", "mixed vegetable", "sabji", "bhaji"]
  },
  {
    id: "bhindi_fry",
    name: "Bhindi Masala / Fry (Okra)",
    category: "Dals & Curries",
    calories: 110,
    protein: 2.2,
    carbs: 11.5,
    fat: 6.5,
    serving: "1 cup (approx 150g)",
    aliases: ["bhindi", "bhindi fry", "bhindi masala", "okra"]
  },
  {
    id: "aloo_gobi",
    name: "Aloo Gobi Dry Sabji",
    category: "Dals & Curries",
    calories: 145,
    protein: 3.5,
    carbs: 21.0,
    fat: 5.5,
    serving: "1 cup (approx 150g)",
    aliases: ["aloo gobi", "aloo gobhi", "alu gobi"]
  },
  {
    id: "baingan_bharta",
    name: "Baingan Bharta (Roasted Eggplant Mash)",
    category: "Dals & Curries",
    calories: 105,
    protein: 2.5,
    carbs: 12.0,
    fat: 5.0,
    serving: "1 cup (approx 150g)",
    aliases: ["baingan bharta", "baingan", "eggplant bharta"]
  },
  {
    id: "kadhi_pakora",
    name: "Punjabi Kadhi Pakora (with 2 pakoras)",
    category: "Dals & Curries",
    calories: 210,
    protein: 6.5,
    carbs: 24.0,
    fat: 10.0,
    serving: "1 bowl (approx 200ml)",
    aliases: ["kadhi", "kadhi pakora", "karhi"]
  },

  // --- NON-VEG CURRIES ---
  {
    id: "butter_chicken",
    name: "Butter Chicken (Murgh Makhani)",
    category: "Dals & Curries",
    calories: 380,
    protein: 24.0,
    carbs: 11.0,
    fat: 26.0,
    serving: "1 bowl (approx 180g)",
    aliases: ["butter chicken", "murgh makhani", "chicken butter masala"]
  },
  {
    id: "chicken_curry",
    name: "Home Style Chicken Curry (Thin Gravy)",
    category: "Dals & Curries",
    calories: 220,
    protein: 26.0,
    carbs: 6.0,
    fat: 10.0,
    serving: "1 bowl (approx 180g)",
    aliases: ["chicken curry", "tari wali chicken", "chicken gravy"]
  },
  {
    id: "chicken_tikka_masala",
    name: "Chicken Tikka Masala",
    category: "Dals & Curries",
    calories: 290,
    protein: 25.0,
    carbs: 9.0,
    fat: 17.0,
    serving: "1 bowl (approx 180g)",
    aliases: ["chicken tikka masala", "chicken tikka curry"]
  },
  {
    id: "egg_curry",
    name: "Egg Curry (with 2 boiled eggs)",
    category: "Dals & Curries",
    calories: 240,
    protein: 14.0,
    carbs: 7.0,
    fat: 17.0,
    serving: "1 bowl (approx 200g)",
    aliases: ["egg curry", "anda curry", "egg gravy"]
  },
  {
    id: "fish_curry",
    name: "Fish Curry (Bengali/Goan style)",
    category: "Dals & Curries",
    calories: 190,
    protein: 20.0,
    carbs: 5.0,
    fat: 10.0,
    serving: "1 bowl (approx 180g)",
    aliases: ["fish curry", "machher jhol", "fish gravy"]
  },
  {
    id: "mutton_curry",
    name: "Mutton Curry / Lamb Rogan Josh",
    category: "Dals & Curries",
    calories: 340,
    protein: 22.0,
    carbs: 7.0,
    fat: 25.0,
    serving: "1 bowl (approx 180g)",
    aliases: ["mutton curry", "rogan josh", "lamb curry", "goat curry"]
  },

  // --- BREAKFAST & SOUTH INDIAN ---
  {
    id: "idli",
    name: "Idli (Plain steamed rice cake)",
    category: "Breakfast & South Indian",
    calories: 40,
    protein: 1.0,
    carbs: 8.5,
    fat: 0.1,
    serving: "1 pc (approx 35g)",
    aliases: ["idli", "idlis", "steamed idli"]
  },
  {
    id: "sambar",
    name: "Vegetable Sambar",
    category: "Breakfast & South Indian",
    calories: 80,
    protein: 2.8,
    carbs: 14.0,
    fat: 1.5,
    serving: "1 bowl (approx 150ml)",
    aliases: ["sambar", "sambhar"]
  },
  {
    id: "coconut_chutney",
    name: "Coconut Chutney",
    category: "Breakfast & South Indian",
    calories: 45,
    protein: 0.6,
    carbs: 2.5,
    fat: 3.8,
    serving: "1 tablespoon (approx 20g)",
    aliases: ["coconut chutney", "nariyal chutney", "chutney"]
  },
  {
    id: "plain_dosa",
    name: "Plain Dosa (roasted with oil)",
    category: "Breakfast & South Indian",
    calories: 135,
    protein: 2.5,
    carbs: 22.0,
    fat: 4.2,
    serving: "1 large pc (approx 70g)",
    aliases: ["plain dosa", "dosa", "dosas"]
  },
  {
    id: "masala_dosa",
    name: "Masala Dosa (with potato filling)",
    category: "Breakfast & South Indian",
    calories: 255,
    protein: 4.0,
    carbs: 42.0,
    fat: 8.0,
    serving: "1 plate",
    aliases: ["masala dosa"]
  },
  {
    id: "poha",
    name: "Kanda Poha / Flattened Rice",
    category: "Breakfast & South Indian",
    calories: 210,
    protein: 3.5,
    carbs: 38.0,
    fat: 4.5,
    serving: "1 plate (approx 150g)",
    aliases: ["poha", "pohe", "kanda poha"]
  },
  {
    id: "upma",
    name: "Suji Upma / Semolina Porridge",
    category: "Breakfast & South Indian",
    calories: 220,
    protein: 4.6,
    carbs: 36.0,
    fat: 6.2,
    serving: "1 plate (approx 150g)",
    aliases: ["upma"]
  },
  {
    id: "besan_chilla",
    name: "Besan Chilla (Gram flour pancake)",
    category: "Breakfast & South Indian",
    calories: 160,
    protein: 6.8,
    carbs: 22.0,
    fat: 5.0,
    serving: "1 pc",
    aliases: ["besan chilla", "chilla", "besan cheela", "cheela"]
  },
  {
    id: "medu_vada",
    name: "Medu Vada (Deep fried black gram donut)",
    category: "Breakfast & South Indian",
    calories: 95,
    protein: 2.4,
    carbs: 11.5,
    fat: 4.5,
    serving: "1 pc",
    aliases: ["vada", "medu vada", "medu wada", "wada"]
  },
  {
    id: "dhokla",
    name: "Khaman Dhokla (Steamed gram flour cake)",
    category: "Breakfast & South Indian",
    calories: 85,
    protein: 3.0,
    carbs: 14.0,
    fat: 1.8,
    serving: "1 pc (approx 45g)",
    aliases: ["dhokla", "khaman", "khaman dhokla", "dhoklas"]
  },

  // --- STREET FOOD & SNACKS ---
  {
    id: "samosa",
    name: "Samosa (Potato filled fried pastry)",
    category: "Street Food & Snacks",
    calories: 250,
    protein: 3.8,
    carbs: 31.0,
    fat: 12.5,
    serving: "1 pc (approx 80g)",
    aliases: ["samosa", "singara", "samosas"]
  },
  {
    id: "vada_pav",
    name: "Vada Pav",
    category: "Street Food & Snacks",
    calories: 300,
    protein: 5.5,
    carbs: 42.0,
    fat: 12.0,
    serving: "1 pc",
    aliases: ["vada pav", "vadapav", "wada pav"]
  },
  {
    id: "pav_bhaji",
    name: "Pav Bhaji (1 plate bhaji + 2 buttered pav)",
    category: "Street Food & Snacks",
    calories: 600,
    protein: 11.0,
    carbs: 70.0,
    fat: 28.0,
    serving: "1 plate",
    aliases: ["pav bhaji", "pavbhaji", "paov bhaji"]
  },
  {
    id: "misal_pav",
    name: "Misal Pav (with 2 pav)",
    category: "Street Food & Snacks",
    calories: 450,
    protein: 12.0,
    carbs: 55.0,
    fat: 20.0,
    serving: "1 plate",
    aliases: ["misal pav", "misal", "misaal"]
  },
  {
    id: "panipuri",
    name: "Pani Puri / Puchka / Golgappa",
    category: "Street Food & Snacks",
    calories: 30,
    protein: 0.5,
    carbs: 4.8,
    fat: 1.0,
    serving: "1 pc",
    aliases: ["panipuri", "pani puri", "golgappa", "gol gappa", "puchka", "golgappe"]
  },
  {
    id: "sev_puri",
    name: "Sev Puri (Flat puris with potato & sev)",
    category: "Street Food & Snacks",
    calories: 240,
    protein: 4.0,
    carbs: 36.0,
    fat: 8.0,
    serving: "1 plate (6 pcs)",
    aliases: ["sev puri", "sevpuri"]
  },
  {
    id: "bhel_puri",
    name: "Bhel Puri",
    category: "Street Food & Snacks",
    calories: 210,
    protein: 4.0,
    carbs: 38.0,
    fat: 5.0,
    serving: "1 plate",
    aliases: ["bhel", "bhel puri", "bhelpuri"]
  },
  {
    id: "veg_momos_steamed",
    name: "Veg Momos (Steamed)",
    category: "Street Food & Snacks",
    calories: 35,
    protein: 1.0,
    carbs: 6.8,
    fat: 0.4,
    serving: "1 pc",
    aliases: ["veg momo", "momos", "veg momos", "momo"]
  },
  {
    id: "chicken_momos_steamed",
    name: "Chicken Momos (Steamed)",
    category: "Street Food & Snacks",
    calories: 45,
    protein: 2.2,
    carbs: 6.5,
    fat: 1.0,
    serving: "1 pc",
    aliases: ["chicken momos", "chicken momo"]
  },
  {
    id: "cheese_chilli_toast",
    name: "Cheese Chilli Toast",
    category: "Street Food & Snacks",
    calories: 220,
    protein: 8.5,
    carbs: 21.0,
    fat: 11.5,
    serving: "1 slice",
    aliases: ["cheese toast", "chilli cheese toast", "cheese chilli toast"]
  },

  // --- DAIRY, BEVERAGES & GYM STAPLES ---
  {
    id: "cow_milk_glass",
    name: "Cow Milk (Double Toned / Low Fat)",
    category: "Dairy & Gym Staples",
    calories: 115,
    protein: 6.5,
    carbs: 9.5,
    fat: 3.5,
    serving: "1 glass (approx 200ml)",
    aliases: ["milk", "glass of milk", "cow milk", "skimmed milk", "doodh"]
  },
  {
    id: "whole_milk_glass",
    name: "Whole Buffalo/Cow Milk (Full Cream)",
    category: "Dairy & Gym Staples",
    calories: 160,
    protein: 7.0,
    carbs: 9.5,
    fat: 9.0,
    serving: "1 glass (approx 200ml)",
    aliases: ["full cream milk", "buffalo milk"]
  },
  {
    id: "plain_curd",
    name: "Plain Curd / Dahi (Low Fat)",
    category: "Dairy & Gym Staples",
    calories: 100,
    protein: 6.0,
    carbs: 8.0,
    fat: 4.5,
    serving: "1 cup (approx 150g)",
    aliases: ["curd", "dahi", "plain curd", "yogurt", "plain yogurt"]
  },
  {
    id: "greek_yogurt_plain",
    name: "Greek Yogurt (Plain Epigamia style)",
    category: "Dairy & Gym Staples",
    calories: 90,
    protein: 8.5,
    carbs: 5.0,
    fat: 3.0,
    serving: "1 cup (approx 100g)",
    aliases: ["greek yogurt", "epigamia"]
  },
  {
    id: "whey_protein_scoop",
    name: "Whey Protein Isolate/Concentrate",
    category: "Dairy & Gym Staples",
    calories: 120,
    protein: 24.0,
    carbs: 2.0,
    fat: 1.5,
    serving: "1 scoop (approx 33g)",
    aliases: ["whey protein", "protein shake", "whey", "protein powder", "scoop of whey"]
  },
  {
    id: "boiled_egg_white",
    name: "Boiled Egg White",
    category: "Dairy & Gym Staples",
    calories: 17,
    protein: 3.6,
    carbs: 0.2,
    fat: 0.1,
    serving: "1 egg white",
    aliases: ["egg white", "boiled egg white", "egg whites"]
  },
  {
    id: "boiled_whole_egg",
    name: "Boiled Whole Egg (Large)",
    category: "Dairy & Gym Staples",
    calories: 78,
    protein: 6.3,
    carbs: 0.6,
    fat: 5.3,
    serving: "1 egg",
    aliases: ["boiled egg", "egg", "whole egg", "eggs", "boiled eggs"]
  },
  {
    id: "egg_omlet_2_eggs",
    name: "Egg Omelette (2 whole eggs + 1 tsp oil)",
    category: "Dairy & Gym Staples",
    calories: 195,
    protein: 13.0,
    carbs: 1.2,
    fat: 15.0,
    serving: "1 plate",
    aliases: ["omelette", "omlet", "egg omelette"]
  },
  {
    id: "egg_bhurji_2_eggs",
    name: "Egg Bhurji (2 eggs scrambled with onions)",
    category: "Dairy & Gym Staples",
    calories: 220,
    protein: 13.5,
    carbs: 4.5,
    fat: 16.5,
    serving: "1 plate",
    aliases: ["egg bhurji", "anda bhurji", "scrambled eggs"]
  },
  {
    id: "paneer_raw",
    name: "Paneer (Raw, low fat / skimmed)",
    category: "Dairy & Gym Staples",
    calories: 190,
    protein: 18.0,
    carbs: 4.0,
    fat: 11.0,
    serving: "100g",
    aliases: ["raw paneer", "paneer 100g", "cottage cheese"]
  },
  {
    id: "paneer_raw_regular",
    name: "Paneer (Raw, standard full cream)",
    category: "Dairy & Gym Staples",
    calories: 265,
    protein: 18.0,
    carbs: 3.0,
    fat: 20.0,
    serving: "100g",
    aliases: ["full cream paneer"]
  },
  {
    id: "soya_chunks_cooked",
    name: "Soya Chunks / Soya Nuggets (Boiled)",
    category: "Dairy & Gym Staples",
    calories: 170,
    protein: 26.0,
    carbs: 15.0,
    fat: 0.5,
    serving: "50g dry wt (equivalent to 1 large bowl cooked)",
    aliases: ["soya chunks", "soya nuggets", "soy chunks", "soya", "soy nuggets"]
  },
  {
    id: "peanut_butter_tbsp",
    name: "Peanut Butter (Unsweetened)",
    category: "Dairy & Gym Staples",
    calories: 95,
    protein: 4.0,
    carbs: 3.0,
    fat: 8.0,
    serving: "1 tablespoon (approx 16g)",
    aliases: ["peanut butter", "pb"]
  },
  {
    id: "roasted_chana",
    name: "Roasted Chana / Bengal Gram (without skin)",
    category: "Dairy & Gym Staples",
    calories: 180,
    protein: 11.0,
    carbs: 29.0,
    fat: 3.0,
    serving: "50g",
    aliases: ["chana", "roasted chana", "bhuna chana"]
  },
  {
    id: "sattu_drink",
    name: "Sattu Drink (Roasted gram flour in water)",
    category: "Dairy & Gym Staples",
    calories: 150,
    protein: 8.5,
    carbs: 25.0,
    fat: 2.2,
    serving: "1 glass (with 2 tbsp sattu)",
    aliases: ["sattu", "sattu drink", "sattu shake"]
  },
  {
    id: "oats_raw",
    name: "Rolled Oats / Instant Oats (Raw)",
    category: "Dairy & Gym Staples",
    calories: 150,
    protein: 5.2,
    carbs: 27.0,
    fat: 2.8,
    serving: "40g (approx 1/2 cup raw)",
    aliases: ["oats", "oatmeal"]
  },
  {
    id: "chai_with_sugar",
    name: "Masala Chai (with whole milk & 1 tsp sugar)",
    category: "Dairy & Gym Staples",
    calories: 65,
    protein: 1.8,
    carbs: 9.0,
    fat: 2.5,
    serving: "1 cup (approx 120ml)",
    aliases: ["chai", "tea", "masala chai", "sugar chai", "doodh wali chai"]
  },
  {
    id: "chai_no_sugar",
    name: "Chai (with milk, no sugar)",
    category: "Dairy & Gym Staples",
    calories: 45,
    protein: 1.8,
    carbs: 4.5,
    fat: 2.5,
    serving: "1 cup (approx 120ml)",
    aliases: ["sugarless chai", "sugarless tea", "chai no sugar"]
  },
  {
    id: "black_coffee_cup",
    name: "Black Coffee / Espresso (no sugar)",
    category: "Dairy & Gym Staples",
    calories: 2,
    protein: 0.2,
    carbs: 0.0,
    fat: 0.0,
    serving: "1 cup",
    aliases: ["black coffee", "espresso", "coffee", "americano"]
  },
  {
    id: "sweet_lassi",
    name: "Sweet Lassi",
    category: "Dairy & Gym Staples",
    calories: 180,
    protein: 4.5,
    carbs: 30.0,
    fat: 4.5,
    serving: "1 glass (approx 200ml)",
    aliases: ["lassi", "sweet lassi"]
  },
  {
    id: "buttermilk_chaas",
    name: "Masala Chaas / Buttermilk (Salted)",
    category: "Dairy & Gym Staples",
    calories: 45,
    protein: 1.5,
    carbs: 2.8,
    fat: 1.2,
    serving: "1 glass (approx 200ml)",
    aliases: ["chaas", "buttermilk", "chas", "chhaas"]
  },
  {
    id: "coconut_water",
    name: "Fresh Coconut Water",
    category: "Dairy & Gym Staples",
    calories: 40,
    protein: 0.7,
    carbs: 9.0,
    fat: 0.1,
    serving: "1 medium coconut (approx 250ml)",
    aliases: ["coconut water", "nariyal paani", "nariyal pani"]
  },

  // --- SWEETS & DESSERTS ---
  {
    id: "gulab_jamun",
    name: "Gulab Jamun (fried dumpling in syrup)",
    category: "Sweets & Desserts",
    calories: 175,
    protein: 2.0,
    carbs: 28.0,
    fat: 6.5,
    serving: "1 pc",
    aliases: ["gulab jamun", "gulabjamun"]
  },
  {
    id: "jalebi",
    name: "Jalebi",
    category: "Sweets & Desserts",
    calories: 150,
    protein: 1.0,
    carbs: 29.0,
    fat: 4.0,
    serving: "1 pc (approx 35g)",
    aliases: ["jalebi", "jalebis"]
  },
  {
    id: "kaju_katli",
    name: "Kaju Katli",
    category: "Sweets & Desserts",
    calories: 75,
    protein: 1.5,
    carbs: 9.0,
    fat: 4.0,
    serving: "1 pc (approx 15g)",
    aliases: ["kaju katli", "kajukatli", "kaju barfi"]
  },
  {
    id: "rasgulla",
    name: "Rasgulla (squeezed of excess syrup)",
    category: "Sweets & Desserts",
    calories: 120,
    protein: 2.5,
    carbs: 24.0,
    fat: 1.8,
    serving: "1 pc",
    aliases: ["rasgulla", "roshogolla", "rasgullas"]
  },
  {
    id: "gajar_halwa",
    name: "Gajar Halwa (Carrot dessert)",
    category: "Sweets & Desserts",
    calories: 240,
    protein: 4.5,
    carbs: 32.0,
    fat: 11.0,
    serving: "1 small bowl (approx 100g)",
    aliases: ["gajar halwa", "carrot halwa", "gajar ka halwa"]
  },

  // --- FRUITS & SALADS ---
  {
    id: "banana_medium",
    name: "Banana",
    category: "Fruits & Salads",
    calories: 105,
    protein: 1.3,
    carbs: 27.0,
    fat: 0.3,
    serving: "1 medium (approx 115g)",
    aliases: ["banana", "kela", "bananas"]
  },
  {
    id: "apple_medium",
    name: "Apple (with skin)",
    category: "Fruits & Salads",
    calories: 95,
    protein: 0.5,
    carbs: 25.0,
    fat: 0.3,
    serving: "1 medium (approx 180g)",
    aliases: ["apple", "apples", "seb"]
  },
  {
    id: "papaya_bowl",
    name: "Papaya (Cubed)",
    category: "Fruits & Salads",
    calories: 60,
    protein: 0.7,
    carbs: 15.0,
    fat: 0.2,
    serving: "1 bowl (approx 150g)",
    aliases: ["papaya", "papeeta"]
  },
  {
    id: "mango_medium",
    name: "Mango (Alphonso / Kesar)",
    category: "Fruits & Salads",
    calories: 150,
    protein: 1.5,
    carbs: 35.0,
    fat: 0.6,
    serving: "1 medium (approx 200g)",
    aliases: ["mango", "aam", "mangoes"]
  },
  {
    id: "cucumber_salad",
    name: "Cucumber Raita or Salad",
    category: "Fruits & Salads",
    calories: 65,
    protein: 2.2,
    carbs: 6.5,
    fat: 3.0,
    serving: "1 cup",
    aliases: ["cucumber salad", "cucumber raita", "raita", "cucumber"]
  },
  {
    id: "green_salad_plain",
    name: "Green Salad (Onion, Tomato, Cucumber, Lemon)",
    category: "Fruits & Salads",
    calories: 30,
    protein: 1.0,
    carbs: 6.5,
    fat: 0.2,
    serving: "1 plate",
    aliases: ["green salad", "salad", "onion salad"]
  },
  // --- ADDITIONAL INDIAN HOME DISHES (MASSIVE EXPANSION) ---
  // 1. SOYABEAN & SOYA CHUNKS DISHES (10+ VARIETIES)
  {
    id: "soyabean_sabji",
    name: "Soyabean Chunks Sabji (Home Gravy style)",
    category: "Dals & Curries",
    calories: 185,
    protein: 15.5,
    carbs: 12.0,
    fat: 7.0,
    serving: "1 bowl (approx 150g)",
    aliases: ["soyabean sabji", "soya chunks curry", "soya curry", "soyabean curry", "soya chunks sabji", "soyabean", "soya chunks", "soyabean ki sabji"]
  },
  {
    id: "soya_bhurji",
    name: "Soya Keema / Soya Bhurji (High Protein Gym Diet)",
    category: "Dairy & Gym Staples",
    calories: 210,
    protein: 18.0,
    carbs: 10.5,
    fat: 8.5,
    serving: "1 bowl (approx 150g)",
    aliases: ["soya bhurji", "soya keema", "soyabean bhurji", "soya keema mutter", "soyabean bhurzi"]
  },
  {
    id: "soya_chunks_pulav",
    name: "Soya Chunks Pulav / Pulao",
    category: "Rice & Grains",
    calories: 320,
    protein: 12.0,
    carbs: 52.0,
    fat: 5.5,
    serving: "1 plate (approx 200g)",
    aliases: ["soya pulav", "soya rice", "soyabean pulav", "soya chunks pulav", "soya chunks pulao", "soyabean pulao"]
  },
  {
    id: "soya_chilli",
    name: "Chilli Soya Chunks (Dry Indo-Chinese style)",
    category: "Street Food & Snacks",
    calories: 240,
    protein: 14.0,
    carbs: 22.0,
    fat: 9.0,
    serving: "1 plate",
    aliases: ["soya chilli", "chilli soya", "soya chunks chilli", "chilli soya chunks"]
  },
  {
    id: "soya_chaap_masala",
    name: "Soya Chaap Masala (Rich Spiced Gravy)",
    category: "Dals & Curries",
    calories: 310,
    protein: 16.5,
    carbs: 18.0,
    fat: 18.0,
    serving: "1 plate (approx 200g)",
    aliases: ["soya chaap", "soya chaap gravy", "soya chaap masala", "chaap curry"]
  },
  {
    id: "soya_chaap_tikka",
    name: "Tandoori Soya Chaap Tikka (Dry)",
    category: "Dairy & Gym Staples",
    calories: 260,
    protein: 17.5,
    carbs: 14.0,
    fat: 13.0,
    serving: "1 plate (approx 150g)",
    aliases: ["soya chaap tikka", "tandoori soya chaap", "tandoori chaap", "chaap tikka"]
  },
  {
    id: "soya_chaap_butter_masala",
    name: "Soya Chaap Butter Masala (Rich Creamy Gravy)",
    category: "Dals & Curries",
    calories: 380,
    protein: 15.0,
    carbs: 20.0,
    fat: 26.0,
    serving: "1 plate",
    aliases: ["soya chaap butter masala", "butter soya chaap", "butter chaap"]
  },
  {
    id: "malai_soya_chaap",
    name: "Malai Soya Chaap (Creamy & Mild)",
    category: "Dairy & Gym Staples",
    calories: 395,
    protein: 14.0,
    carbs: 16.0,
    fat: 30.0,
    serving: "1 plate",
    aliases: ["malai soya chaap", "malai chaap", "creamy soya chaap"]
  },
  {
    id: "soya_chaap_roll",
    name: "Soya Chaap Kathi Roll",
    category: "Street Food & Snacks",
    calories: 410,
    protein: 15.0,
    carbs: 48.0,
    fat: 16.0,
    serving: "1 roll",
    aliases: ["soya chaap roll", "chaap roll", "soya roll"]
  },
  {
    id: "soya_chunks_dry_fry",
    name: "Soya Chunks Dry Fry (Clean Protein snack)",
    category: "Dairy & Gym Staples",
    calories: 160,
    protein: 18.2,
    carbs: 11.0,
    fat: 4.0,
    serving: "1 cup (approx 80g)",
    aliases: ["soya chunks dry", "soya chunks fry", "soyabean fry", "high protein soya snack"]
  },
  {
    id: "soya_granules_upma",
    name: "Soya Granules Upma (Gym breakfast style)",
    category: "Breakfast & South Indian",
    calories: 210,
    protein: 14.5,
    carbs: 25.0,
    fat: 5.0,
    serving: "1 plate (approx 150g)",
    aliases: ["soya upma", "soya granules upma", "soyabean upma"]
  },

  // 2. PANEER DISHES (10+ VARIETIES)
  {
    id: "paneer_bhurji_dry",
    name: "Paneer Bhurji (Dry Scrambled Cottage Cheese with Veggies)",
    category: "Dairy & Gym Staples",
    calories: 280,
    protein: 14.5,
    carbs: 6.0,
    fat: 22.0,
    serving: "1 plate (approx 150g)",
    aliases: ["paneer bhurji", "paneer bhurzi", "scrambled paneer"]
  },
  {
    id: "palak_paneer_light",
    name: "Palak Paneer (Home Style, light oil)",
    category: "Dals & Curries",
    calories: 190,
    protein: 10.2,
    carbs: 7.0,
    fat: 14.0,
    serving: "1 bowl (approx 150g)",
    aliases: ["palak paneer", "spinach paneer", "saag paneer"]
  },
  {
    id: "paneer_butter_masala",
    name: "Paneer Butter Masala (Rich Creamy Gravy)",
    category: "Dals & Curries",
    calories: 360,
    protein: 11.5,
    carbs: 12.0,
    fat: 29.0,
    serving: "1 bowl (approx 150g)",
    aliases: ["paneer butter masala", "butter paneer", "paneer makhani"]
  },
  {
    id: "kadai_paneer",
    name: "Kadai Paneer (Capsicum & Onion semi-dry curry)",
    category: "Dals & Curries",
    calories: 290,
    protein: 12.0,
    carbs: 9.0,
    fat: 22.5,
    serving: "1 bowl (approx 150g)",
    aliases: ["kadai paneer", "karahi paneer", "kadaipaneer"]
  },
  {
    id: "shahi_paneer",
    name: "Shahi Paneer (Mild Mughlai Sweetish gravy)",
    category: "Dals & Curries",
    calories: 320,
    protein: 10.8,
    carbs: 15.0,
    fat: 24.0,
    serving: "1 bowl (approx 150g)",
    aliases: ["shahi paneer", "shahipaneer"]
  },
  {
    id: "mattar_paneer_home",
    name: "Matar Paneer (Home style gravy with peas)",
    category: "Dals & Curries",
    calories: 210,
    protein: 10.5,
    carbs: 14.0,
    fat: 12.0,
    serving: "1 bowl (approx 150g)",
    aliases: ["matar paneer", "mattar paneer", "paneer matar"]
  },
  {
    id: "chilli_paneer_dry",
    name: "Chilli Paneer (Dry Indo-Chinese style starter)",
    category: "Street Food & Snacks",
    calories: 310,
    protein: 11.0,
    carbs: 18.0,
    fat: 21.0,
    serving: "1 plate (6-8 pieces)",
    aliases: ["chilli paneer", "dry chilli paneer", "chilly paneer"]
  },
  {
    id: "paneer_tikka_dry",
    name: "Paneer Tikka (Tandoori spiced roasted skewers, dry)",
    category: "Dairy & Gym Staples",
    calories: 270,
    protein: 14.0,
    carbs: 8.0,
    fat: 19.5,
    serving: "1 plate (approx 6 pieces)",
    aliases: ["paneer tikka", "tandoori paneer tikka", "paneer tikka dry"]
  },
  {
    id: "paneer_paratha_ghee",
    name: "Paneer Paratha (Stuffed wholewheat bread with ghee)",
    category: "Breads & Staples",
    calories: 320,
    protein: 12.0,
    carbs: 42.0,
    fat: 11.5,
    serving: "1 piece",
    aliases: ["paneer paratha", "paneer ka paratha", "stuffed paneer paratha"]
  },
  {
    id: "paneer_roll",
    name: "Paneer Tikka Roll / Kathi Roll",
    category: "Street Food & Snacks",
    calories: 430,
    protein: 14.8,
    carbs: 46.0,
    fat: 18.0,
    serving: "1 roll",
    aliases: ["paneer roll", "paneer kathi roll", "paneer tikka roll"]
  },
  {
    id: "paneer_lababdar",
    name: "Paneer Lababdar (Thick Onion Tomato Gravy)",
    category: "Dals & Curries",
    calories: 340,
    protein: 12.0,
    carbs: 11.0,
    fat: 27.0,
    serving: "1 bowl (approx 150g)",
    aliases: ["paneer lababdar", "lababdar paneer"]
  },

  // 3. CHICKEN DISHES (10 VARIETIES)
  {
    id: "chicken_curry_home",
    name: "Chicken Curry (Home style, 3 boneless pieces with light gravy)",
    category: "Dairy & Gym Staples",
    calories: 245,
    protein: 26.0,
    carbs: 6.0,
    fat: 13.0,
    serving: "1 bowl (approx 150g chicken)",
    aliases: ["chicken curry", "home style chicken curry", "chicken masala", "chicken gravy"]
  },
  {
    id: "chicken_tikka_dry",
    name: "Chicken Tikka (6 pieces roasted in tandoor, dry)",
    category: "Dairy & Gym Staples",
    calories: 280,
    protein: 38.0,
    carbs: 4.5,
    fat: 12.0,
    serving: "1 plate (6 pieces)",
    aliases: ["chicken tikka", "tandoori chicken tikka", "tikka"]
  },
  {
    id: "butter_chicken",
    name: "Butter Chicken / Murgh Makhani (Rich, creamy)",
    category: "Dals & Curries",
    calories: 390,
    protein: 28.0,
    carbs: 10.0,
    fat: 26.0,
    serving: "1 serving (approx 180g)",
    aliases: ["butter chicken", "murgh makhani", "butterchicken"]
  },
  {
    id: "kadai_chicken",
    name: "Kadai Chicken (Capsicum, Onion & tomato thick gravy)",
    category: "Dals & Curries",
    calories: 310,
    protein: 29.0,
    carbs: 8.0,
    fat: 17.0,
    serving: "1 bowl (approx 150g)",
    aliases: ["kadai chicken", "karahi chicken", "kadai chicken masala"]
  },
  {
    id: "grilled_chicken_breast_clean",
    name: "Grilled Chicken Breast (Salt & Pepper, Clean Gym Diet)",
    category: "Dairy & Gym Staples",
    calories: 230,
    protein: 44.0,
    carbs: 1.0,
    fat: 5.0,
    serving: "1 large breast (approx 150g raw weight)",
    aliases: ["chicken breast", "boiled chicken breast", "boiled chicken", "grilled chicken breast", "grilled chicken", "gym chicken"]
  },
  {
    id: "chicken_biryani_plate",
    name: "Chicken Biryani (with 1 chicken piece & masala rice)",
    category: "Rice & Grains",
    calories: 450,
    protein: 22.5,
    carbs: 64.0,
    fat: 11.0,
    serving: "1 plate (approx 250g)",
    aliases: ["chicken biryani", "biryani chicken", "chicken biriyani", "biryani"]
  },
  {
    id: "chicken_roll",
    name: "Chicken Tikka Kathi Roll",
    category: "Street Food & Snacks",
    calories: 460,
    protein: 24.0,
    carbs: 45.0,
    fat: 18.0,
    serving: "1 roll",
    aliases: ["chicken roll", "chicken kathi roll", "chicken tikka roll"]
  },
  {
    id: "chicken_tikka_masala",
    name: "Chicken Tikka Masala (Thick spiced gravy with tikka pieces)",
    category: "Dals & Curries",
    calories: 330,
    protein: 28.5,
    carbs: 9.0,
    fat: 19.0,
    serving: "1 plate",
    aliases: ["chicken tikka masala", "chicken tikka gravy"]
  },
  {
    id: "tandoori_chicken_half",
    name: "Tandoori Chicken (Half portion with bone, tandoori leg + breast)",
    category: "Dairy & Gym Staples",
    calories: 320,
    protein: 42.0,
    carbs: 3.5,
    fat: 14.5,
    serving: "1 half chicken serving",
    aliases: ["tandoori chicken", "tandoori leg piece", "tandoori breast", "tandoori chicken leg"]
  },
  {
    id: "chicken_keema_curry",
    name: "Chicken Keema / Minced Chicken Curry",
    category: "Dairy & Gym Staples",
    calories: 260,
    protein: 28.0,
    carbs: 7.0,
    fat: 12.5,
    serving: "1 bowl (approx 150g)",
    aliases: ["chicken keema", "chicken minced", "chicken keema curry", "chicken bhurji"]
  },

  // 4. EGG DISHES (10 VARIETIES)
  {
    id: "egg_curry_2eggs",
    name: "Egg Curry (with 2 boiled eggs & gravy)",
    category: "Dals & Curries",
    calories: 260,
    protein: 13.5,
    carbs: 8.0,
    fat: 19.0,
    serving: "1 plate",
    aliases: ["egg curry", "anda curry", "egg masala", "egg gravy"]
  },
  {
    id: "egg_bhurji_2eggs",
    name: "Egg Bhurji (2 eggs scrambled with onions, tomato & spices)",
    category: "Dairy & Gym Staples",
    calories: 220,
    protein: 13.0,
    carbs: 5.0,
    fat: 16.5,
    serving: "1 plate",
    aliases: ["egg bhurji", "anda bhurji", "egg scrambled"]
  },
  {
    id: "whole_egg_boiled_single",
    name: "Whole Egg (Boiled, Standard size)",
    category: "Dairy & Gym Staples",
    calories: 78,
    protein: 6.3,
    carbs: 0.6,
    fat: 5.3,
    serving: "1 large egg",
    aliases: ["boiled egg", "whole egg", "boiled eggs", "1 egg", "two eggs", "three eggs"]
  },
  {
    id: "egg_white_boiled_single",
    name: "Egg White (Boiled, Standard size)",
    category: "Dairy & Gym Staples",
    calories: 17,
    protein: 3.6,
    carbs: 0.2,
    fat: 0.1,
    serving: "1 large egg white",
    aliases: ["egg white", "boiled egg white", "egg whites", "1 egg white", "2 egg whites", "3 egg whites", "4 egg whites", "5 egg whites", "6 egg whites"]
  },
  {
    id: "egg_omelette_double",
    name: "Double Egg Omelette (Plain, low oil)",
    category: "Dairy & Gym Staples",
    calories: 180,
    protein: 12.5,
    carbs: 1.0,
    fat: 14.0,
    serving: "1 omelette (2 eggs)",
    aliases: ["plain omelette", "omelette", "omlet", "egg omelette", "double egg omelette"]
  },
  {
    id: "masala_omelette_double",
    name: "Masala Omelette (2 eggs with chopped onion, green chilli & ghee)",
    category: "Breakfast & South Indian",
    calories: 210,
    protein: 13.0,
    carbs: 3.5,
    fat: 16.0,
    serving: "1 omelette (2 eggs)",
    aliases: ["masala omelette", "indian omelette", "anda omlet"]
  },
  {
    id: "egg_paratha_ghee",
    name: "Egg Paratha (Wheat flatbread with scrambled egg layer)",
    category: "Breads & Staples",
    calories: 295,
    protein: 10.5,
    carbs: 38.0,
    fat: 11.0,
    serving: "1 piece",
    aliases: ["egg paratha", "anda paratha", "egg paratta"]
  },
  {
    id: "egg_biryani_plate",
    name: "Egg Biryani (with 2 boiled eggs & spiced basmati rice)",
    category: "Rice & Grains",
    calories: 390,
    protein: 15.0,
    carbs: 58.0,
    fat: 10.0,
    serving: "1 plate",
    aliases: ["egg biryani", "egg pulao", "egg biriyani", "anda biryani"]
  },
  {
    id: "egg_roll_street",
    name: "Kolkata Egg Roll (Single Egg wrap with onion & sauces)",
    category: "Street Food & Snacks",
    calories: 340,
    protein: 11.0,
    carbs: 44.0,
    fat: 13.0,
    serving: "1 roll",
    aliases: ["egg roll", "anda roll", "single egg roll", "street egg roll"]
  },
  {
    id: "sunny_side_up_double",
    name: "Egg Half-Fry / Sunny Side Up (2 eggs cooked in butter)",
    category: "Dairy & Gym Staples",
    calories: 195,
    protein: 12.5,
    carbs: 0.8,
    fat: 15.5,
    serving: "1 plate (2 eggs)",
    aliases: ["half fry", "sunny side up", "egg half fry", "anda half fry"]
  },

  // 5. VEGETABLE SABJIS & HOMESTYLE DRY PREPS (10+ VARIETIES)
  {
    id: "aloo_baingan",
    name: "Aloo Baingan Sabji (Potato & Eggplant dry curry)",
    category: "Dals & Curries",
    calories: 135,
    protein: 2.2,
    carbs: 18.0,
    fat: 6.0,
    serving: "1 bowl (approx 150g)",
    aliases: ["aloo baingan", "alu baingan", "baingan aloo"]
  },
  {
    id: "baingan_bharta",
    name: "Baingan Bharta (Roasted Charcoal Eggplant Mash with peas)",
    category: "Dals & Curries",
    calories: 110,
    protein: 2.5,
    carbs: 12.0,
    fat: 5.5,
    serving: "1 bowl (approx 150g)",
    aliases: ["baingan bharta", "eggplant bharta", "baingan ka bharta", "bharta"]
  },
  {
    id: "aloo_gobi_matar",
    name: "Aloo Gobi Matar Sabji (Potato, Cauliflower & Green Peas)",
    category: "Dals & Curries",
    calories: 145,
    protein: 3.5,
    carbs: 21.0,
    fat: 5.0,
    serving: "1 bowl (approx 150g)",
    aliases: ["aloo gobi", "aloo gobi matar", "gobi aloo", "alu gobi", "gobhi ki sabji"]
  },
  {
    id: "bhindi_masala",
    name: "Bhindi Masala (Okra stir-fry with onions and light spices)",
    category: "Dals & Curries",
    calories: 120,
    protein: 2.0,
    carbs: 11.5,
    fat: 7.5,
    serving: "1 bowl (approx 150g)",
    aliases: ["bhindi masala", "bhindi fry", "okra fry", "bhindi", "okra", "bhindi ki sabji"]
  },
  {
    id: "lauki_sabji",
    name: "Lauki / Ghiya Sabji (Bottle Gourd homestyle, very light)",
    category: "Dals & Curries",
    calories: 75,
    protein: 1.2,
    carbs: 6.8,
    fat: 4.0,
    serving: "1 bowl (approx 150g)",
    aliases: ["lauki sabji", "ghiya sabji", "lauki ki sabji", "ghiya", "bottle gourd sabji"]
  },
  {
    id: "torai_sabji",
    name: "Turai / Torai Sabji (Ridge Gourd light stew)",
    category: "Dals & Curries",
    calories: 80,
    protein: 1.4,
    carbs: 7.2,
    fat: 4.2,
    serving: "1 bowl (approx 150g)",
    aliases: ["turai sabji", "torai sabji", "turai", "tori", "tori sabji"]
  },
  {
    id: "kaddu_sabji",
    name: "Kaddu Ki Sabji (Pumpkin Curry, tangy & sweet)",
    category: "Dals & Curries",
    calories: 115,
    protein: 1.8,
    carbs: 14.0,
    fat: 5.5,
    serving: "1 bowl (approx 150g)",
    aliases: ["kaddu sabji", "kaddu ki sabji", "pumpkin sabji", "petha sabji"]
  },
  {
    id: "kathal_sabji",
    name: "Kathal Ki Sabji (Jackfruit masala curry)",
    category: "Dals & Curries",
    calories: 160,
    protein: 3.0,
    carbs: 22.0,
    fat: 6.5,
    serving: "1 bowl (approx 150g)",
    aliases: ["kathal sabji", "kathal ki sabji", "jackfruit curry", "jackfruit"]
  },
  {
    id: "karela_fry",
    name: "Karela Fry / Bitter Gourd crispy sabji (mildly bitter)",
    category: "Dals & Curries",
    calories: 130,
    protein: 2.1,
    carbs: 10.0,
    fat: 9.0,
    serving: "1 bowl (approx 100g)",
    aliases: ["karela fry", "karela sabji", "bitter gourd fry", "karela", "karela ki sabji"]
  },
  {
    id: "patta_gobi_sabji",
    name: "Patta Gobi Matar (Cabbage & Green Peas dry stir-fry)",
    category: "Dals & Curries",
    calories: 95,
    protein: 2.4,
    carbs: 10.5,
    fat: 4.8,
    serving: "1 bowl (approx 150g)",
    aliases: ["patta gobi", "bandh gobi", "cabbage sabji", "patta gobi sabji", "bandhgobi sabzi"]
  },
  {
    id: "mix_veg_curry",
    name: "Mix Vegetable Curry (Semi-dry with carrot, beans, gobi & paneer)",
    category: "Dals & Curries",
    calories: 170,
    protein: 4.0,
    carbs: 16.0,
    fat: 10.0,
    serving: "1 bowl (approx 150g)",
    aliases: ["mix veg", "mix vegetable", "mix veg curry", "veg jalfrezi"]
  },
  {
    id: "crispy_bhindi_fry",
    name: "Crispy Kurkuri Bhindi Fry (Dry sliced & deep fried okra)",
    category: "Street Food & Snacks",
    calories: 180,
    protein: 2.2,
    carbs: 14.0,
    fat: 13.0,
    serving: "1 bowl (approx 100g)",
    aliases: ["kurkuri bhindi", "crispy bhindi", "bhindi kurkuri"]
  },

  // 6. DALS, LENTILS & GRAVY BEANS (10 VARIETIES)
  {
    id: "rajma_masala",
    name: "Rajma Masala (Red Kidney Bean homestyle curry)",
    category: "Dals & Curries",
    calories: 195,
    protein: 8.5,
    carbs: 26.0,
    fat: 6.0,
    serving: "1 bowl (approx 150g)",
    aliases: ["rajma masala", "rajma", "kidney beans curry", "rajma gravy"]
  },
  {
    id: "chana_masala",
    name: "Chana Masala / Spicy Chickpea Curry",
    category: "Dals & Curries",
    calories: 210,
    protein: 9.0,
    carbs: 28.0,
    fat: 6.5,
    serving: "1 bowl (approx 150g)",
    aliases: ["chana masala", "chole curry", "chana curry", "kabuli chana", "chole", "punjabi chole"]
  },
  {
    id: "kala_chana_curry",
    name: "Kala Chana Curry (Black Chickpeas Gravy)",
    category: "Dals & Curries",
    calories: 180,
    protein: 9.5,
    carbs: 24.0,
    fat: 5.0,
    serving: "1 bowl (approx 150g)",
    aliases: ["kala chana", "black chana curry", "kala chana curry", "black chickpea", "kala chana soup"]
  },
  {
    id: "lobia_curry",
    name: "Lobia Curry (Black-Eyed Peas gravy curry)",
    category: "Dals & Curries",
    calories: 175,
    protein: 9.0,
    carbs: 24.0,
    fat: 4.5,
    serving: "1 bowl (approx 150g)",
    aliases: ["lobia curry", "lobia", "black eyed peas curry", "rongi"]
  },
  {
    id: "moong_dal_tadka",
    name: "Moong Dal Tadka (Yellow Split Lentils with ghee & cumin)",
    category: "Dals & Curries",
    calories: 140,
    protein: 7.2,
    carbs: 21.0,
    fat: 3.5,
    serving: "1 bowl (approx 150g)",
    aliases: ["moong dal", "mung dal", "yellow dal", "dal tadka", "peeli dal"]
  },
  {
    id: "masoor_dal",
    name: "Masoor Dal Curry (Red Lentils plain home style)",
    category: "Dals & Curries",
    calories: 135,
    protein: 7.8,
    carbs: 20.0,
    fat: 3.0,
    serving: "1 bowl (approx 150g)",
    aliases: ["masoor dal", "red dal", "masur dal", "kali masoor dal"]
  },
  {
    id: "dal_makhani",
    name: "Dal Makhani (Black Urad & Kidney beans slow cooked with butter)",
    category: "Dals & Curries",
    calories: 290,
    protein: 9.2,
    carbs: 28.0,
    fat: 15.5,
    serving: "1 bowl (approx 150g)",
    aliases: ["dal makhani", "dal makhni", "makhani dal", "makhni dal"]
  },
  {
    id: "chana_dal_fry",
    name: "Chana Dal Fry (Bengal Gram thicker dal with spices)",
    category: "Dals & Curries",
    calories: 165,
    protein: 8.5,
    carbs: 24.0,
    fat: 4.0,
    serving: "1 bowl (approx 150g)",
    aliases: ["chana dal", "chana dal fry", "bengal gram dal"]
  },
  {
    id: "toor_dal_tadka",
    name: "Toor / Arhar Dal Tadka (Pigeon Peas traditional yellow dal)",
    category: "Dals & Curries",
    calories: 150,
    protein: 7.5,
    carbs: 22.0,
    fat: 3.8,
    serving: "1 bowl (approx 150g)",
    aliases: ["toor dal", "arhar dal", "tuvar dal", "yellow arhar dal"]
  },
  {
    id: "whole_moong_dal",
    name: "Sabut Moong Dal (Green Whole Mung Lentil Curry)",
    category: "Dals & Curries",
    calories: 145,
    protein: 8.2,
    carbs: 23.0,
    fat: 3.0,
    serving: "1 bowl (approx 150g)",
    aliases: ["sabut moong", "whole moong dal", "green moong dal", "whole green gram"]
  },

  // 7. RICE & GRAINS (10 VARIETIES)
  {
    id: "plain_basmati_rice",
    name: "Boiled Plain Basmati Rice",
    category: "Rice & Grains",
    calories: 240,
    protein: 4.4,
    carbs: 53.0,
    fat: 0.4,
    serving: "1 plate (approx 180g cooked)",
    aliases: ["boiled rice", "plain rice", "white rice", "rice plain", "steamed rice", "cooked rice", "bhaat"]
  },
  {
    id: "jeera_rice",
    name: "Jeera Rice (Cumin seeds fried white rice with little ghee)",
    category: "Rice & Grains",
    calories: 270,
    protein: 4.6,
    carbs: 55.0,
    fat: 3.5,
    serving: "1 plate (approx 180g cooked)",
    aliases: ["jeera rice", "cumin rice", "zeera rice"]
  },
  {
    id: "veg_biryani_plate",
    name: "Veg Biryani / Veg Pulao",
    category: "Rice & Grains",
    calories: 310,
    protein: 6.5,
    carbs: 58.0,
    fat: 6.0,
    serving: "1 plate (approx 200g)",
    aliases: ["veg biryani", "biryani veg", "veg pulao", "pulao", "vegetable pulao"]
  },
  {
    id: "khichdi_home",
    name: "Moong Dal Khichdi (Healthy comfort food with light ghee)",
    category: "Rice & Grains",
    calories: 210,
    protein: 6.8,
    carbs: 38.0,
    fat: 3.5,
    serving: "1 bowl (approx 200g)",
    aliases: ["khichdi", "khichri", "moong dal khichdi", "healthy khichdi"]
  },
  {
    id: "masala_oats_saffola",
    name: "Masala Oats (Spiced savory oatmeal, Saffola style)",
    category: "Breakfast & South Indian",
    calories: 160,
    protein: 4.8,
    carbs: 26.0,
    fat: 4.0,
    serving: "1 bowl (approx 300ml prepared)",
    aliases: ["masala oats", "savory oats", "oats masala", "saffola oats"]
  },
  {
    id: "curd_rice_south",
    name: "Curd Rice (Traditional tempered yogurt rice)",
    category: "Breakfast & South Indian",
    calories: 240,
    protein: 5.5,
    carbs: 42.0,
    fat: 5.2,
    serving: "1 bowl (approx 200g)",
    aliases: ["curd rice", "thayir sadam", "dahi chawal"]
  },
  {
    id: "egg_fried_rice",
    name: "Egg Fried Rice (Indo-Chinese street style)",
    category: "Rice & Grains",
    calories: 380,
    protein: 13.0,
    carbs: 58.0,
    fat: 10.5,
    serving: "1 plate (approx 220g)",
    aliases: ["egg fried rice", "fried rice with egg", "anda fried rice"]
  },
  {
    id: "veg_fried_rice",
    name: "Veg Fried Rice (Indo-Chinese wok style)",
    category: "Rice & Grains",
    calories: 330,
    protein: 5.2,
    carbs: 62.0,
    fat: 7.0,
    serving: "1 plate (approx 220g)",
    aliases: ["veg fried rice", "vegetable fried rice", "chinese fried rice"]
  },
  {
    id: "cooked_brown_rice",
    name: "Cooked Brown Rice (High fiber)",
    category: "Rice & Grains",
    calories: 215,
    protein: 4.5,
    carbs: 45.0,
    fat: 1.6,
    serving: "1 cup (approx 150g cooked)",
    aliases: ["brown rice", "cooked brown rice", "brown rice cooked"]
  },
  {
    id: "sweet_kashmiri_pulao",
    name: "Kashmiri Pulao (Sweetish rice with dry fruits & pomegranate)",
    category: "Rice & Grains",
    calories: 340,
    protein: 5.8,
    carbs: 64.0,
    fat: 7.5,
    serving: "1 plate",
    aliases: ["kashmiri pulao", "kashmiri pulao", "sweet pulao"]
  },

  // 8. BREADS & FLATBREAD STAPLES (10 VARIETIES)
  {
    id: "plain_roti_tawa",
    name: "Plain Roti / Chapati (Without Ghee/Butter)",
    category: "Breads & Staples",
    calories: 85,
    protein: 3.1,
    carbs: 18.0,
    fat: 0.4,
    serving: "1 medium roti (approx 30g raw wheat)",
    aliases: ["roti", "chapati", "chapatis", "plain roti", "dry roti", "phulka", "tawa roti", "1 roti", "two rotis", "three rotis", "four rotis", "five rotis"]
  },
  {
    id: "butter_roti_ghee",
    name: "Roti with Ghee / Butter Chapati",
    category: "Breads & Staples",
    calories: 110,
    protein: 3.1,
    carbs: 18.0,
    fat: 3.0,
    serving: "1 medium roti with 1/2 tsp ghee",
    aliases: ["butter roti", "ghee roti", "ghee chapati", "roti with ghee", "ghee phulka"]
  },
  {
    id: "tandoori_roti_plain",
    name: "Tandoori Roti (Wheat clay oven bread, no butter)",
    category: "Breads & Staples",
    calories: 115,
    protein: 4.0,
    carbs: 24.0,
    fat: 0.5,
    serving: "1 piece",
    aliases: ["tandoori roti", "plain tandoori roti", "clay oven roti"]
  },
  {
    id: "plain_paratha_oil",
    name: "Plain Paratha (Triangle/Layered with oil/ghee)",
    category: "Breads & Staples",
    calories: 220,
    protein: 4.5,
    carbs: 34.0,
    fat: 7.5,
    serving: "1 paratha",
    aliases: ["plain paratha", "parantha", "paratta", "simple paratha", "layered paratha"]
  },
  {
    id: "aloo_paratha_ghee",
    name: "Aloo Paratha (Stuffed potato flatbread cooked with ghee)",
    category: "Breads & Staples",
    calories: 290,
    protein: 5.8,
    carbs: 48.0,
    fat: 8.5,
    serving: "1 large piece",
    aliases: ["aloo paratha", "alu paratha", "potato paratha", "aloo ka paratha"]
  },
  {
    id: "sattu_paratha",
    name: "Sattu Paratha (Bihari roasted gram stuffed flatbread)",
    category: "Breads & Staples",
    calories: 280,
    protein: 9.5,
    carbs: 46.0,
    fat: 6.8,
    serving: "1 piece",
    aliases: ["sattu paratha", "sattu ka paratha", "chana sattu paratha"]
  },
  {
    id: "butter_naan_maida",
    name: "Butter Naan (Refined flour tandoor bread with butter)",
    category: "Breads & Staples",
    calories: 310,
    protein: 7.8,
    carbs: 48.0,
    fat: 10.0,
    serving: "1 naan",
    aliases: ["butter naan", "naan with butter", "plain naan", "maida naan"]
  },
  {
    id: "garlic_naan",
    name: "Garlic Naan (Clay oven bread topped with garlic and butter)",
    category: "Breads & Staples",
    calories: 320,
    protein: 8.0,
    carbs: 49.0,
    fat: 10.5,
    serving: "1 naan",
    aliases: ["garlic naan", "butter garlic naan"]
  },
  {
    id: "poori_fried_single",
    name: "Puri / Poori (Deep-fried puffed wheat bread)",
    category: "Breads & Staples",
    calories: 110,
    protein: 1.8,
    carbs: 14.5,
    fat: 5.2,
    serving: "1 puri",
    aliases: ["puri", "poori", "fried puri", "one puri", "two puris", "four pooris"]
  },
  {
    id: "missi_roti_healthy",
    name: "Missi Roti (Gram flour & wholewheat mixed flatbread)",
    category: "Breads & Staples",
    calories: 140,
    protein: 5.2,
    carbs: 22.0,
    fat: 3.5,
    serving: "1 medium",
    aliases: ["missi roti", "missi chapati", "besan roti"]
  },

  // 9. STREET FOOD & SNACKS (10 VARIETIES)
  {
    id: "samosa_single",
    name: "Samosa (Potato filled crispy triangular pastry)",
    category: "Street Food & Snacks",
    calories: 200,
    protein: 3.5,
    carbs: 24.0,
    fat: 10.5,
    serving: "1 piece",
    aliases: ["samosa", "singara", "one samosa", "two samosas"]
  },
  {
    id: "vada_pav_single",
    name: "Vada Pav (Mumbai burger with single batata vada)",
    category: "Street Food & Snacks",
    calories: 280,
    protein: 5.5,
    carbs: 42.0,
    fat: 10.0,
    serving: "1 piece",
    aliases: ["vada pav", "vadapav", "wada pav", "one vada pav"]
  },
  {
    id: "chole_bhature_plate",
    name: "Chole Bhature (2 Bhaturas fried + spicy chickpeas curry)",
    category: "Street Food & Snacks",
    calories: 580,
    protein: 12.0,
    carbs: 78.0,
    fat: 24.0,
    serving: "1 plate (2 bhature + chole)",
    aliases: ["chole bhature", "chola bhatura", "bhature", "chole bhature plate"]
  },
  {
    id: "pani_puri_6pcs",
    name: "Pani Puri / Golgappa (6 pieces with spiced mint water)",
    category: "Street Food & Snacks",
    calories: 120,
    protein: 2.0,
    carbs: 22.0,
    fat: 2.5,
    serving: "6 pieces",
    aliases: ["pani puri", "golgappa", "gol gappa", "puchka", "fuchka", "gupchup"]
  },
  {
    id: "aloo_tikki_chaat",
    name: "Aloo Tikki Chaat (Pan-fried potato patties with dahi & chutney)",
    category: "Street Food & Snacks",
    calories: 275,
    protein: 4.5,
    carbs: 38.0,
    fat: 11.5,
    serving: "1 plate (2 tikkis with curd & chutneys)",
    aliases: ["tikki chaat", "aloo tikki chaat", "aloo tikki", "tikki"]
  },
  {
    id: "papdi_chaat_plate",
    name: "Papdi Chaat (Crispy flour crackers topped with curd & potatoes)",
    category: "Street Food & Snacks",
    calories: 290,
    protein: 5.0,
    carbs: 42.0,
    fat: 11.0,
    serving: "1 plate",
    aliases: ["papdi chaat", "papri chaat", "chaat papdi"]
  },
  {
    id: "pav_bhaji_butter",
    name: "Pav Bhaji (2 butter toasted buns + vegetable mash curry)",
    category: "Street Food & Snacks",
    calories: 450,
    protein: 9.0,
    carbs: 62.0,
    fat: 18.0,
    serving: "1 plate (2 pavs + bhaji)",
    aliases: ["pav bhaji", "pavbhaji", "butter pav bhaji"]
  },
  {
    id: "bhel_puri_mumbai",
    name: "Bhel Puri (Puffed rice with chopped vegetables & tangy chutneys)",
    category: "Street Food & Snacks",
    calories: 160,
    protein: 3.2,
    carbs: 31.0,
    fat: 2.5,
    serving: "1 plate",
    aliases: ["bhel puri", "bhelpuri", "bhel"]
  },
  {
    id: "veg_momos_steamed",
    name: "Veg Momos (Steamed cabbage-stuffed dumplings)",
    category: "Street Food & Snacks",
    calories: 190,
    protein: 4.5,
    carbs: 38.0,
    fat: 1.5,
    serving: "6 pieces",
    aliases: ["veg momos", "steamed momos", "momos", "momo"]
  },
  {
    id: "khaman_dhokla_gujarati",
    name: "Khaman Dhokla (Steamed savory gram flour sponge)",
    category: "Breakfast & South Indian",
    calories: 140,
    protein: 4.8,
    carbs: 22.0,
    fat: 3.8,
    serving: "2 medium square pieces",
    aliases: ["dhokla", "khaman dhokla", "khaman", "gujarati dhokla"]
  },

  // 10. SWEETS & DESSERTS (10 VARIETIES)
  {
    id: "gulab_jamun_2pcs",
    name: "Gulab Jamun (Soft milk-solid balls in sugar syrup)",
    category: "Sweets & Desserts",
    calories: 300,
    protein: 4.2,
    carbs: 48.0,
    fat: 10.5,
    serving: "2 pieces",
    aliases: ["gulab jamun", "gulabjamun", "sweet jamun"]
  },
  {
    id: "gajar_halwa_bowl",
    name: "Gajar Ka Halwa (Sweet grated carrot pudding with khoya)",
    category: "Sweets & Desserts",
    calories: 220,
    protein: 3.8,
    carbs: 32.0,
    fat: 8.5,
    serving: "1 small bowl (approx 100g)",
    aliases: ["gajar halwa", "gajar ka halwa", "carrot halwa", "gajar halva"]
  },
  {
    id: "rice_kheer_bowl",
    name: "Rice Kheer / Payasam (Creamy cardamon-spiced milk pudding)",
    category: "Sweets & Desserts",
    calories: 180,
    protein: 4.5,
    carbs: 28.0,
    fat: 5.5,
    serving: "1 small bowl (approx 120ml)",
    aliases: ["kheer", "payasam", "rice kheer", "rice pudding"]
  },
  {
    id: "rasgulla_bengali_2pcs",
    name: "Rasgulla / Rossogolla (Spongy chenna spheres in sugar syrup)",
    category: "Sweets & Desserts",
    calories: 190,
    protein: 3.8,
    carbs: 42.0,
    fat: 1.2,
    serving: "2 pieces",
    aliases: ["rasgulla", "rasgullas", "bengali rasgulla", "rosogolla"]
  },
  {
    id: "kaju_katli_2pcs",
    name: "Kaju Katli (Cashew fudge diamonds)",
    category: "Sweets & Desserts",
    calories: 120,
    protein: 2.2,
    carbs: 14.0,
    fat: 6.2,
    serving: "2 pieces",
    aliases: ["kaju katli", "kaju barfi", "cashew barfi"]
  },
  {
    id: "jalebi_standard_100g",
    name: "Jalebi (Fried fermented batter spirals in syrup)",
    category: "Sweets & Desserts",
    calories: 300,
    protein: 1.8,
    carbs: 68.0,
    fat: 2.5,
    serving: "1 small plate (approx 100g)",
    aliases: ["jalebi", "jelebi", "jalebis"]
  },
  {
    id: "moong_dal_halwa",
    name: "Moong Dal Halwa (Rich yellow lentil ghee pudding)",
    category: "Sweets & Desserts",
    calories: 340,
    protein: 5.0,
    carbs: 40.0,
    fat: 18.0,
    serving: "1 small bowl (approx 80g)",
    aliases: ["moong dal halwa", "mung dal halwa", "dal halwa"]
  },
  {
    id: "rasmalai_2pcs",
    name: "Rasmalai (Chenna discs soaked in saffron-cardamom milk)",
    category: "Sweets & Desserts",
    calories: 250,
    protein: 7.0,
    carbs: 32.0,
    fat: 10.5,
    serving: "2 pieces with milk syrup",
    aliases: ["rasmalai", "ras malai", "rasamalai"]
  },
  {
    id: "soan_papdi_2pcs",
    name: "Soan Papdi (Flaky crisp gram flour sweet dessert)",
    category: "Sweets & Desserts",
    calories: 160,
    protein: 2.0,
    carbs: 24.0,
    fat: 6.5,
    serving: "2 pieces",
    aliases: ["soan papdi", "son papdi", "shon papdi"]
  },
  {
    id: "plain_vanilla_scoop",
    name: "Vanilla Ice Cream (Single standard scoop)",
    category: "Sweets & Desserts",
    calories: 140,
    protein: 2.5,
    carbs: 16.0,
    fat: 7.2,
    serving: "1 scoop",
    aliases: ["ice cream", "vanilla ice cream", "scoop of ice cream", "icecream"]
  }
];

export interface ParsedMatch {
  item: DBFoodItem;
  quantity: number;
}

export function parseDescriptionToLocalMatch(text: string): ParsedMatch[] {
  if (!text || text.trim().length < 2) return [];
  const matches: ParsedMatch[] = [];
  const normalizedText = text.toLowerCase();

  INDIAN_FOOD_DB.forEach(item => {
    let matchedAlias = "";
    const isMatched = item.aliases.some(alias => {
      const regex = new RegExp(`\\b${alias.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
      if (regex.test(normalizedText)) {
        matchedAlias = alias;
        return true;
      }
      return false;
    }) || normalizedText.includes(item.name.toLowerCase());

    if (isMatched) {
      let quantity = 1; // default to 1 portion
      const targetWord = matchedAlias || item.name.toLowerCase();
      try {
        const escapedWord = targetWord.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        // Search for decimal or integer numbers right before the target word,
        // allowing units like plates, cups, glasses, rotis, bowl, bowls, etc. in between
        const numRegex = new RegExp(`(?:\\b(\\d+(?:\\.\\d+)?)\\s*(?:pcs?|plates?|cups?|bowls?|g|grams?|glass|glasses|rotis|chapatis)?\\s+)?(?:${escapedWord})`, 'i');
        const match = normalizedText.match(numRegex);
        if (match && match[1]) {
          quantity = parseFloat(match[1]);
        } else {
          // Alternative: look for "X of [food]" e.g. "2 portions of chicken curry" or "1.5 bowls of dal"
          const ofRegex = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(?:plate|plates|bowl|bowls|pc|pcs|cup|cups|glass|glasses|serving|servings)?\\s+(?:of\\s+)?(?:${escapedWord})`, 'i');
          const ofMatch = normalizedText.match(ofRegex);
          if (ofMatch && ofMatch[1]) {
            quantity = parseFloat(ofMatch[1]);
          }
        }
      } catch (e) {
        console.error("Regex error in parser:", e);
      }

      if (!matches.some(m => m.item.id === item.id)) {
        matches.push({ item, quantity });
      }
    }
  });

  return matches;
}

