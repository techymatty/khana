import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding UmmahEats database...');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { phone: '9999999999' },
    update: {},
    create: {
      phone: '9999999999',
      name: 'Admin',
      role: Role.ADMIN,
    },
  });
  console.log('✅ Admin user created:', admin.id);

  // Create restaurant owners
  const owner1 = await prisma.user.upsert({
    where: { phone: '9000000001' },
    update: {},
    create: {
      phone: '9000000001',
      name: 'Ahmed Khan',
      role: Role.RESTAURANT,
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { phone: '9000000002' },
    update: {},
    create: {
      phone: '9000000002',
      name: 'Fatima Sheikh',
      role: Role.RESTAURANT,
    },
  });

  const owner3 = await prisma.user.upsert({
    where: { phone: '9000000003' },
    update: {},
    create: {
      phone: '9000000003',
      name: 'Yusuf Ali',
      role: Role.RESTAURANT,
    },
  });

  // Create sample user
  await prisma.user.upsert({
    where: { phone: '9100000001' },
    update: {},
    create: {
      phone: '9100000001',
      name: 'Zainab Begum',
      role: Role.USER,
    },
  });

  // Create restaurants
  const restaurant1 = await prisma.restaurant.create({
    data: {
      name: 'Al-Baik Express',
      description: 'Authentic Arabian broasted chicken and grills. Serving pure halal food since 2010.',
      image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800',
      halalVerified: true,
      isApproved: true,
      latitude: 19.076,
      longitude: 72.8777,
      address: '23, Mohammed Ali Road, Mumbai 400003',
      phone: '9000000001',
      rating: 4.5,
      totalReviews: 128,
      ownerId: owner1.id,
    },
  });

  const restaurant2 = await prisma.restaurant.create({
    data: {
      name: 'Biryani House',
      description: 'Famous Hyderabadi Dum Biryani made with authentic spices and premium basmati rice.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
      halalVerified: true,
      isApproved: true,
      latitude: 19.082,
      longitude: 72.882,
      address: '45, Zakaria Masjid Street, Mumbai 400009',
      phone: '9000000002',
      rating: 4.7,
      totalReviews: 256,
      ownerId: owner2.id,
    },
  });

  const restaurant3 = await prisma.restaurant.create({
    data: {
      name: 'Kebab Corner',
      description: 'Mughlai cuisine specialists - seekh kebabs, tandoori platters, and rich curries.',
      image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800',
      halalVerified: true,
      isApproved: true,
      latitude: 19.073,
      longitude: 72.875,
      address: '78, Bhendi Bazaar, Mumbai 400003',
      phone: '9000000003',
      rating: 4.3,
      totalReviews: 89,
      ownerId: owner3.id,
    },
  });

  const restaurant4 = await prisma.restaurant.create({
    data: {
      name: 'Naan & Curry',
      description: 'North Indian delicacies with fresh naans baked in traditional tandoor.',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
      halalVerified: false,
      isApproved: true,
      latitude: 19.078,
      longitude: 72.88,
      address: '12, Minara Masjid Lane, Mumbai 400001',
      phone: '9000000004',
      rating: 4.1,
      totalReviews: 45,
      ownerId: owner1.id,
    },
  });

  const restaurant5 = await prisma.restaurant.create({
    data: {
      name: 'Shawarma King',
      description: 'Lebanese-style shawarmas and falafel wraps. Quick bites, big flavours.',
      image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800',
      halalVerified: true,
      isApproved: false,
      latitude: 19.085,
      longitude: 72.889,
      address: '99, Kurla West, Mumbai 400070',
      phone: '9000000005',
      rating: 0,
      totalReviews: 0,
      ownerId: owner2.id,
    },
  });

  // Create menu items for Restaurant 1 — Al-Baik Express
  await prisma.menuItem.createMany({
    data: [
      { name: 'Broasted Chicken (4 pcs)', description: 'Crispy Arabian-style broasted chicken', price: 349, category: 'Chicken', restaurantId: restaurant1.id },
      { name: 'Chicken Shawarma Plate', description: 'Grilled chicken with garlic sauce and rice', price: 199, category: 'Shawarma', restaurantId: restaurant1.id },
      { name: 'Mutton Mandi', description: 'Slow-cooked mutton with fragrant mandi rice', price: 499, category: 'Rice', restaurantId: restaurant1.id },
      { name: 'Falafel Wrap', description: 'Crispy falafel with tahini and fresh veggies', price: 149, category: 'Wraps', restaurantId: restaurant1.id },
      { name: 'Hummus & Pita', description: 'Creamy hummus with warm pita bread', price: 129, category: 'Starters', restaurantId: restaurant1.id },
    ],
  });

  // Create menu items for Restaurant 2 — Biryani House
  await prisma.menuItem.createMany({
    data: [
      { name: 'Hyderabadi Chicken Biryani', description: 'Dum-cooked biryani with tender chicken', price: 299, category: 'Biryani', restaurantId: restaurant2.id },
      { name: 'Mutton Biryani', description: 'Premium goat meat biryani with saffron', price: 399, category: 'Biryani', restaurantId: restaurant2.id },
      { name: 'Egg Biryani', description: 'Flavourful biryani with boiled eggs', price: 199, category: 'Biryani', restaurantId: restaurant2.id },
      { name: 'Chicken 65', description: 'Spicy deep-fried chicken appetizer', price: 179, category: 'Starters', restaurantId: restaurant2.id },
      { name: 'Double Ka Meetha', description: 'Traditional Hyderabadi bread pudding', price: 99, category: 'Desserts', restaurantId: restaurant2.id },
      { name: 'Mirchi Ka Salan', description: 'Tangy chilli peanut curry', price: 149, category: 'Sides', restaurantId: restaurant2.id },
    ],
  });

  // Create menu items for Restaurant 3 — Kebab Corner
  await prisma.menuItem.createMany({
    data: [
      { name: 'Seekh Kebab (6 pcs)', description: 'Juicy minced meat kebabs on skewers', price: 249, category: 'Kebabs', restaurantId: restaurant3.id },
      { name: 'Chicken Tikka', description: 'Tandoor-grilled marinated chicken chunks', price: 229, category: 'Kebabs', restaurantId: restaurant3.id },
      { name: 'Mutton Rogan Josh', description: 'Rich Kashmiri-style mutton curry', price: 349, category: 'Curries', restaurantId: restaurant3.id },
      { name: 'Butter Naan', description: 'Soft buttered naan bread', price: 49, category: 'Breads', restaurantId: restaurant3.id },
      { name: 'Tandoori Roti', description: 'Whole wheat bread from clay oven', price: 29, category: 'Breads', restaurantId: restaurant3.id },
    ],
  });

  // Create menu items for Restaurant 4 — Naan & Curry
  await prisma.menuItem.createMany({
    data: [
      { name: 'Butter Chicken', description: 'Creamy tomato-based chicken curry', price: 279, category: 'Curries', restaurantId: restaurant4.id },
      { name: 'Dal Makhani', description: 'Slow-cooked black lentils in cream', price: 199, category: 'Curries', restaurantId: restaurant4.id },
      { name: 'Paneer Tikka Masala', description: 'Grilled paneer in spiced gravy', price: 249, category: 'Curries', restaurantId: restaurant4.id },
      { name: 'Garlic Naan', description: 'Garlic-infused naan bread', price: 59, category: 'Breads', restaurantId: restaurant4.id },
    ],
  });

  // Create riders
  await prisma.rider.createMany({
    data: [
      { name: 'Imran Patel', phone: '9200000001', isActive: true, latitude: 19.076, longitude: 72.877 },
      { name: 'Salman Khan', phone: '9200000002', isActive: true, latitude: 19.08, longitude: 72.88 },
      { name: 'Rafiq Ahmed', phone: '9200000003', isActive: false },
    ],
  });

  console.log('✅ Seed complete!');
  console.log('📱 Admin login: 9999999999');
  console.log('🏪 Restaurant owners: 9000000001, 9000000002, 9000000003');
  console.log('👤 Sample user: 9100000001');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
