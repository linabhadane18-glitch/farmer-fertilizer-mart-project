const products = [
  {
    name: 'Neem Oil Insecticide Spray',
    description:
      'Natural neem-based crop protection spray suitable for vegetables and fruits. Helps manage soft-bodied insects when used as directed on the label.',
    category: 'Pesticides',
    subcategory: 'Insecticides',
    price: 349,
    image:
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    brand: 'GreenShield',
    stock: 80,
    unit: '500 ml',
    specifications: {
      'Active Base': 'Cold-pressed neem oil',
      'Pack Size': '500 ml',
      'Crop Types': 'Vegetables, fruits, ornamentals',
    },
    safetyInformation:
      'For agricultural use as directed. Keep out of reach of children. Wear gloves and avoid inhalation of spray mist. Do not spray near water bodies. Read the product label before use.',
    usageInstructions:
      'Dilute as per label. Spray during cooler hours. Do not exceed recommended dose. Observe pre-harvest interval on the label.',
    ageRestriction:
      'Not for use by persons under 18 years without adult supervision. Follow all label restrictions.',
    featured: true,
  },
  {
    name: 'Copper Fungicide WP',
    description:
      'Wettable powder fungicide formulation commonly used for fungal disease management in vegetables and fruits when applied as per label directions.',
    category: 'Pesticides',
    subcategory: 'Fungicides',
    price: 289,
    image:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
    brand: 'CropCare Pro',
    stock: 60,
    unit: '250 g',
    specifications: {
      Form: 'Wettable powder',
      'Pack Size': '250 g',
    },
    safetyInformation:
      'Handle with care. Wear protective clothing, gloves, and a mask while mixing and spraying. Avoid contact with eyes and skin. Store locked away from food and animal feed.',
    usageInstructions:
      'Mix thoroughly with water as directed. Apply evenly. Do not mix with incompatible products. Follow local agricultural guidelines.',
    ageRestriction: 'Adult use only (18+). Keep away from children.',
    featured: true,
  },
  {
    name: 'Selective Herbicide Concentrate',
    description:
      'Herbicide concentrate for weed management in designated crop situations. Use only according to the approved label and local regulations.',
    category: 'Pesticides',
    subcategory: 'Herbicides',
    price: 459,
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    brand: 'FieldClear',
    stock: 45,
    unit: '1 L',
    specifications: {
      Type: 'Selective concentrate',
      'Pack Size': '1 litre',
    },
    safetyInformation:
      'Hazardous if misused. Wear full protective equipment. Avoid spray drift onto non-target crops. Do not enter treated areas until the re-entry interval has passed. Dispose of containers as per local rules.',
    usageInstructions:
      'Calibrate sprayer carefully. Apply only to approved crops and weeds listed on the label. Never exceed dosage rates.',
    ageRestriction:
      'Restricted to trained adult users (18+). Not for household recreational use.',
    featured: false,
  },
  {
    name: 'Bio Sticky Trap Kit',
    description:
      'Yellow sticky traps for monitoring and capturing flying insects in greenhouses and vegetable plots as part of an IPM approach.',
    category: 'Pesticides',
    subcategory: 'Other Crop Protection',
    price: 199,
    image:
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80',
    brand: 'TrapGuard',
    stock: 120,
    unit: 'pack of 10',
    specifications: {
      Colour: 'Yellow',
      Quantity: '10 traps',
    },
    safetyInformation: 'Non-toxic adhesive traps. Keep adhesive surface away from skin and clothing.',
    usageInstructions: 'Hang at canopy height. Replace when covered with insects or dust.',
    ageRestriction: '',
    featured: false,
  },
  {
    name: 'Premium Vermicompost 5 kg',
    description:
      'Nutrient-rich vermicompost made from organic matter processed by earthworms. Improves soil structure and moisture retention.',
    category: 'Organic Fertilizers',
    subcategory: 'Vermicompost',
    price: 249,
    image:
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    brand: 'EarthBloom',
    stock: 150,
    unit: '5 kg',
    specifications: {
      Form: 'Granular compost',
      'Organic Matter': 'High',
    },
    safetyInformation: 'Store in a cool, dry place. Keep sealed when not in use.',
    usageInstructions: 'Mix into soil or apply as top dressing around plants. Water after application.',
    featured: true,
  },
  {
    name: 'Farm Compost Mix 10 kg',
    description:
      'Well-decomposed compost blend for kitchen gardens and field crops. Supports healthier root development.',
    category: 'Organic Fertilizers',
    subcategory: 'Compost',
    price: 299,
    image:
      'https://images.unsplash.com/photo-1466692476862-a6e548d1d3bb?w=800&q=80',
    brand: 'SoilLife',
    stock: 100,
    unit: '10 kg',
    specifications: { Form: 'Compost mix', Moisture: 'Moderate' },
    safetyInformation: 'Use gloves if you have sensitive skin.',
    usageInstructions: 'Incorporate into planting beds before sowing or transplanting.',
    featured: true,
  },
  {
    name: 'Neem Cake Fertilizer 2 kg',
    description:
      'Neem cake organic manure that slowly releases nutrients and supports soil health in vegetable beds.',
    category: 'Organic Fertilizers',
    subcategory: 'Neem-based Fertilizers',
    price: 189,
    image:
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80',
    brand: 'NeemAgri',
    stock: 90,
    unit: '2 kg',
    specifications: { Form: 'Cake powder', 'Pack Size': '2 kg' },
    safetyInformation: 'Avoid inhaling fine dust while spreading.',
    usageInstructions: 'Mix into soil at planting. Suitable for vegetables and fruit trees.',
    featured: false,
  },
  {
    name: 'Organic Farmyard Manure Pellets',
    description:
      'Pelleted organic manure for convenient application in orchards and vegetable plots.',
    category: 'Organic Fertilizers',
    subcategory: 'Organic Manure',
    price: 329,
    image:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
    brand: 'AgroOrganic',
    stock: 70,
    unit: '5 kg',
    specifications: { Form: 'Pellets', 'Pack Size': '5 kg' },
    safetyInformation: 'Store away from moisture.',
    usageInstructions: 'Broadcast or band around plants and irrigate lightly.',
    featured: false,
  },
  {
    name: 'Hybrid Tomato Seeds',
    description:
      'High-germinating hybrid tomato seeds suitable for kitchen gardens and small farms.',
    category: 'Seeds',
    subcategory: 'Vegetable Seeds',
    price: 149,
    image:
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80',
    brand: 'SeedVista',
    stock: 200,
    unit: '10 g pack',
    specifications: { Type: 'Hybrid', Germination: 'High' },
    safetyInformation: 'Store in a cool, dry place. Keep out of reach of children.',
    usageInstructions: 'Sow in nursery trays. Transplant healthy seedlings after 3–4 weeks.',
    featured: true,
  },
  {
    name: 'Papaya Seed Pack',
    description:
      'Quality papaya seeds for home orchards and small fruit gardens.',
    category: 'Seeds',
    subcategory: 'Fruit Seeds',
    price: 99,
    image:
      'https://images.unsplash.com/photo-1619566636858-adf3ef4644b9?w=800&q=80',
    brand: 'FruitForge',
    stock: 110,
    unit: '5 g pack',
    specifications: { Type: 'Open pollinated', Crop: 'Papaya' },
    usageInstructions: 'Sow in fertile, well-drained soil. Thin seedlings after germination.',
    featured: false,
  },
  {
    name: 'Wheat Grain Seeds 1 kg',
    description:
      'Certified wheat seed lot for small trial plots and demonstration farms.',
    category: 'Seeds',
    subcategory: 'Grain Seeds',
    price: 89,
    image:
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80',
    brand: 'GrainTrust',
    stock: 180,
    unit: '1 kg',
    specifications: { Crop: 'Wheat', Grade: 'Certified' },
    usageInstructions: 'Treat and sow as per local agronomic advice and season.',
    featured: false,
  },
  {
    name: 'Multi-Vegetable Seed Combo',
    description:
      'Assorted vegetable seed combo for home kitchen gardens including leafy greens and common vegetables.',
    category: 'Seeds',
    subcategory: 'Other Agricultural Seeds',
    price: 259,
    image:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
    brand: 'GardenBasket',
    stock: 95,
    unit: 'combo pack',
    specifications: { Packs: '6 varieties' },
    usageInstructions: 'Follow sowing instructions printed on each inner pack.',
    featured: true,
  },
  {
    name: 'Manual Knapsack Sprayer 16L',
    description:
      'Durable knapsack sprayer for fertilizer solutions and approved crop sprays on small farms.',
    category: 'Farming Tools',
    subcategory: 'Sprayers',
    price: 1499,
    image:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    brand: 'SprayMaster',
    stock: 40,
    unit: '16 L',
    specifications: { Capacity: '16 litres', Type: 'Manual knapsack' },
    safetyInformation:
      'Rinse thoroughly after chemical use. Never use the same sprayer for food-related liquids after pesticide application without proper decontamination.',
    usageInstructions: 'Fill tank, pressurize with the lever, and spray evenly. Maintain seals regularly.',
    featured: true,
  },
  {
    name: 'Garden Tool Set (5 pcs)',
    description:
      'Essential hand gardening set with trowel, weeder, cultivator, and transplanting tools.',
    category: 'Farming Tools',
    subcategory: 'Gardening Tools',
    price: 699,
    image:
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    brand: 'DigWell',
    stock: 55,
    unit: 'set',
    specifications: { Pieces: '5', Handle: 'Ergonomic' },
    usageInstructions: 'Clean and dry tools after use to prevent rust.',
    featured: false,
  },
  {
    name: 'Heavy-Duty Hand Hoe',
    description:
      'Strong hand hoe for weeding and light soil work in vegetable beds.',
    category: 'Farming Tools',
    subcategory: 'Hand Tools',
    price: 399,
    image:
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    brand: 'FieldForge',
    stock: 75,
    unit: '1 piece',
    specifications: { Material: 'Steel blade', Handle: 'Wooden' },
    usageInstructions: 'Use with proper footing. Wear sturdy footwear while working.',
    featured: false,
  },
  {
    name: 'Drip Irrigation Starter Kit',
    description:
      'Water-efficient drip kit for kitchen gardens and small vegetable plots.',
    category: 'Farming Tools',
    subcategory: 'Irrigation Equipment',
    price: 1899,
    image:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
    brand: 'AquaCrop',
    stock: 35,
    unit: 'kit',
    specifications: { Coverage: 'Up to 50 plants', Type: 'Drip' },
    usageInstructions: 'Lay main line, attach emitters near plant roots, and flush system before first use.',
    featured: true,
  },
];

const blogs = [
  {
    title: 'How to Choose the Right Fertilizer for Your Crop',
    category: 'Fertilizer Management',
    excerpt:
      'A practical guide to matching fertilizer type and timing with soil needs and crop stages.',
    image:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1000&q=80',
    content: `Choosing fertilizer starts with understanding what your soil already provides. A simple soil test helps identify nitrogen, phosphorus, and potassium levels before you buy any product.

Organic options such as vermicompost and farmyard manure improve soil structure and long-term fertility. They release nutrients slowly and support beneficial soil life.

Chemical fertilizers can supply nutrients quickly, but overuse may harm soil health. Always follow recommended doses for your crop and region.

Apply fertilizers at the right crop stage—basal doses at planting and top dressing during active growth. Water after application so nutrients reach the root zone.

Remember: product labels and local agricultural officers remain the best source of crop-specific guidance.`,
    published: true,
  },
  {
    title: 'Getting Started with Organic Farming',
    category: 'Organic Farming',
    excerpt:
      'Simple steps for farmers who want to reduce chemical inputs and build healthier soils.',
    image:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1000&q=80',
    content: `Organic farming focuses on soil health, biodiversity, and natural nutrient cycles. Begin by adding compost, green manures, and crop residues to your fields.

Rotate crops to break pest cycles and reduce disease pressure. Intercropping with legumes can also add nitrogen naturally.

Use botanical products such as neem-based preparations carefully and only as part of an integrated approach. Monitor fields regularly so problems are caught early.

Organic certification has specific rules—check local standards if you plan to sell certified produce. Even without certification, organic practices can improve soil and reduce input costs over time.`,
    published: true,
  },
  {
    title: 'Crop Protection Basics for Small Farms',
    category: 'Crop Protection',
    excerpt:
      'Prevention, monitoring, and safe product use for healthier harvests.',
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1000&q=80',
    content: `Good crop protection begins before pests appear. Healthy seedlings, clean tools, and field sanitation reduce many problems.

Scout fields weekly. Identify pests correctly before applying any product—many insects are beneficial.

When sprays are needed, choose the least disruptive option allowed for your crop, follow label rates, and spray in cooler hours with low wind.

Always wear protective gear, store products safely, and respect pre-harvest intervals. Never mix products unless the label permits it.

This article provides general information only and does not replace label instructions or professional advice.`,
    published: true,
  },
  {
    title: 'Selecting Quality Seeds for Better Yields',
    category: 'Seed Selection',
    excerpt:
      'What to look for when buying vegetable, fruit, and grain seeds.',
    image:
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1000&q=80',
    content: `Seed quality strongly influences germination and early plant vigour. Buy from trusted sources and check packing dates.

Match varieties to your climate, soil, and market. A high-yielding hybrid may not suit every region or growing system.

Store seeds in cool, dry containers away from moisture and rodents. Discard old seed lots with poor germination.

For grains, certified seed often gives more uniform stands. For kitchen gardens, open-pollinated varieties can be saved carefully if isolation is managed.`,
    published: true,
  },
  {
    title: 'Modern Tools That Save Time on the Farm',
    category: 'Modern Farming Technology',
    excerpt:
      'Affordable tools and irrigation ideas that make small farms more efficient.',
    image:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1000&q=80',
    content: `You do not need large machinery to benefit from better tools. A reliable knapsack sprayer, sharp hand tools, and a drip irrigation starter kit can reduce labour and water waste.

Drip systems deliver water near the roots and limit evaporation. Pair irrigation with mulching for even better moisture conservation.

Keep tools clean and service pumps and seals regularly. Small maintenance habits prevent costly downtime during peak seasons.

Weather apps and simple record-keeping also count as modern farming technology—they help you plan spraying and irrigation more wisely.`,
    published: true,
  },
  {
    title: 'Sustainable Practices for Long-Term Farm Health',
    category: 'Sustainable Agriculture',
    excerpt:
      'Practical habits that protect soil, water, and farm profitability together.',
    image:
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3036?w=1000&q=80',
    content: `Sustainable farming balances productivity with resource care. Cover crops, mulching, and reduced tillage help keep soil covered and alive.

Use water carefully—schedule irrigation based on crop need rather than fixed routines. Collect rainwater where possible.

Diversify income with mixed crops or kitchen garden produce to reduce risk. Avoid burning crop residues when composting or incorporation is feasible.

Sustainability is a journey of small improvements. Start with one practice this season and build from there with guidance from local extension services.`,
    published: true,
  },
];

module.exports = { products, blogs };
