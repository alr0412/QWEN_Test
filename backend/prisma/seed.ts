import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a demo barber user
  const barberUser = await prisma.user.upsert({
    where: { phone: '+375291234567' },
    update: {},
    create: {
      phone: '+375291234567',
      role: 'BARBER',
    },
  });

  // Create barber profile
  const barberProfile = await prisma.barberProfile.upsert({
    where: { userId: barberUser.id },
    update: {
      salonName: 'StyleBarber Minsk',
      address: 'Minsk, Independence Avenue 50',
      lat: 53.9045,
      lng: 27.5615,
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400',
    },
    create: {
      userId: barberUser.id,
      salonName: 'StyleBarber Minsk',
      address: 'Minsk, Independence Avenue 50',
      lat: 53.9045,
      lng: 27.5615,
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400',
    },
  });

  // Create services
  const services = [
    { name: "Men's Haircut", price: 25, durationMinutes: 30 },
    { name: "Beard Trim", price: 15, durationMinutes: 20 },
    { name: "Haircut + Beard", price: 35, durationMinutes: 45 },
    { name: "Kids Haircut", price: 20, durationMinutes: 25 },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { 
        id_barberId: { 
          id: `${service.name}-${barberProfile.id}`,
          barberId: barberProfile.id 
        } 
      },
      update: service,
      create: {
        ...service,
        barberId: barberProfile.id,
        id: `${service.name.replace(/\s+/g, '-')}-${barberProfile.id}`,
      },
    });
  }

  // Create availability windows (Mon-Fri 10:00-18:00, Sat 10:00-15:00)
  const availability = [
    { dayOfWeek: 1, startTime: '10:00', endTime: '18:00' },
    { dayOfWeek: 2, startTime: '10:00', endTime: '18:00' },
    { dayOfWeek: 3, startTime: '10:00', endTime: '18:00' },
    { dayOfWeek: 4, startTime: '10:00', endTime: '18:00' },
    { dayOfWeek: 5, startTime: '10:00', endTime: '18:00' },
    { dayOfWeek: 6, startTime: '10:00', endTime: '15:00' },
  ];

  for (const slot of availability) {
    await prisma.availabilityWindow.create({
      data: {
        barberId: barberProfile.id,
        ...slot,
      },
    });
  }

  // Create a demo customer
  const customerUser = await prisma.user.upsert({
    where: { phone: '+375297654321' },
    update: {},
    create: {
      phone: '+375297654321',
      role: 'CUSTOMER',
    },
  });

  console.log('Seeding completed!');
  console.log('Demo Barber:', barberUser.phone);
  console.log('Demo Customer:', customerUser.phone);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
