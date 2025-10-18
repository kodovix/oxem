import { db } from './db';
import { 
  users, 
  lostFoundItems, 
  fundraisingCampaigns, 
  campusEvents,
  donations,
  eventRsvps,
  comments,
  likes
} from '@shared/schema';

async function seed() {
  console.log('Starting database seed...');

  try {
    // Create sample users
    console.log('Creating sample users...');
    const sampleUsers = [
      {
        id: 'user1',
        email: 'admin@reva.edu',
        firstName: 'Admin',
        lastName: 'User',
        profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        role: 'admin',
      },
      {
        id: 'user2',
        email: 'student1@reva.edu',
        firstName: 'Priya',
        lastName: 'Sharma',
        profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
        role: 'student',
      },
      {
        id: 'user3',
        email: 'student2@reva.edu',
        firstName: 'Rahul',
        lastName: 'Kumar',
        profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
        role: 'student',
      },
      {
        id: 'user4',
        email: 'student3@reva.edu',
        firstName: 'Ananya',
        lastName: 'Reddy',
        profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ananya',
        role: 'student',
      },
      {
        id: 'user5',
        email: 'student4@reva.edu',
        firstName: 'Aditya',
        lastName: 'Patel',
        profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aditya',
        role: 'student',
      },
    ];

    await db.insert(users).values(sampleUsers);
    console.log('Sample users created successfully');

    // Create sample lost & found items
    console.log('Creating sample lost & found items...');
    const sampleLostFoundItems = [
      {
        id: 'lf1',
        userId: 'user2',
        title: 'Lost iPhone 13 Pro',
        description: 'Lost my iPhone 13 Pro in Pacific Blue color near the library. It has a clear case with a sticker on the back.',
        type: 'lost',
        category: 'electronics',
        location: 'Main Library, 2nd Floor',
        tags: ['phone', 'iphone', 'blue'],
        imageUrls: ['https://images.unsplash.com/photo-1592286927505-b0501e63c79b?w=400'],
        status: 'active',
        likes: 12,
      },
      {
        id: 'lf2',
        userId: 'user3',
        title: 'Found Laptop Charger',
        description: 'Found a Dell laptop charger in the Computer Science block. Contact me if it\'s yours!',
        type: 'found',
        category: 'electronics',
        location: 'CS Block, Room 305',
        tags: ['charger', 'dell', 'laptop'],
        imageUrls: ['https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400'],
        status: 'active',
        likes: 8,
      },
      {
        id: 'lf3',
        userId: 'user4',
        title: 'Lost Brown Leather Wallet',
        description: 'Lost my brown leather wallet containing ID card and some cash. Please contact if found!',
        type: 'lost',
        category: 'accessories',
        location: 'Campus Cafeteria',
        tags: ['wallet', 'leather', 'brown'],
        imageUrls: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=400'],
        status: 'active',
        likes: 15,
      },
      {
        id: 'lf4',
        userId: 'user5',
        title: 'Found Set of Keys',
        description: 'Found a set of keys with a REVA keychain near the parking lot.',
        type: 'found',
        category: 'accessories',
        location: 'Main Parking Area',
        tags: ['keys', 'keychain'],
        imageUrls: ['https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400'],
        status: 'active',
        likes: 6,
      },
    ];

    await db.insert(lostFoundItems).values(sampleLostFoundItems);
    console.log('Sample lost & found items created successfully');

    // Create sample fundraising campaigns
    console.log('Creating sample fundraising campaigns...');
    const sampleCampaigns = [
      {
        id: 'camp1',
        userId: 'user2',
        title: 'Help Ravi Complete His Engineering Degree',
        description: 'Ravi is a brilliant Computer Science student who is facing financial difficulties. He needs ₹50,000 to pay his semester fees and continue his education.',
        goalAmount: '50000',
        raisedAmount: '32000',
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600',
        category: 'education',
        status: 'active',
        endDate: new Date('2025-12-31'),
      },
      {
        id: 'camp2',
        userId: 'user3',
        title: 'Medical Emergency Fund for Sneha',
        description: 'Our classmate Sneha\'s family is facing a medical emergency. Let\'s come together to support her in this difficult time.',
        goalAmount: '100000',
        raisedAmount: '78000',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600',
        category: 'emergency',
        status: 'active',
        endDate: new Date('2025-11-30'),
      },
      {
        id: 'camp3',
        userId: 'user4',
        title: 'College Basketball Team Equipment',
        description: 'Our basketball team needs new equipment and jerseys to compete in the inter-university championship.',
        goalAmount: '75000',
        raisedAmount: '45000',
        imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600',
        category: 'sports',
        status: 'active',
        endDate: new Date('2026-01-15'),
      },
      {
        id: 'camp4',
        userId: 'user5',
        title: 'Tech Club Robotics Project',
        description: 'Support our robotics club in building an autonomous robot for the national competition.',
        goalAmount: '120000',
        raisedAmount: '95000',
        imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600',
        category: 'tech',
        status: 'active',
        endDate: new Date('2025-12-20'),
      },
    ];

    await db.insert(fundraisingCampaigns).values(sampleCampaigns);
    console.log('Sample fundraising campaigns created successfully');

    // Create sample donations
    console.log('Creating sample donations...');
    const sampleDonations = [
      {
        id: 'don1',
        campaignId: 'camp1',
        userId: 'user3',
        amount: '5000',
        anonymous: false,
        message: 'Education is important! Keep going, Ravi!',
      },
      {
        id: 'don2',
        campaignId: 'camp1',
        userId: 'user4',
        amount: '2000',
        anonymous: true,
      },
      {
        id: 'don3',
        campaignId: 'camp2',
        userId: 'user2',
        amount: '10000',
        anonymous: false,
        message: 'Wishing Sneha a speedy recovery!',
      },
    ];

    await db.insert(donations).values(sampleDonations);
    console.log('Sample donations created successfully');

    // Create sample campus events
    console.log('Creating sample campus events...');
    const sampleEvents = [
      {
        id: 'event1',
        userId: 'user2',
        title: 'Tech Fest 2025',
        description: 'Annual technology festival featuring hackathons, workshops, and tech talks from industry experts.',
        location: 'Main Auditorium',
        startDate: new Date('2025-11-15T09:00:00'),
        endDate: new Date('2025-11-17T18:00:00'),
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
        category: 'tech',
        maxAttendees: 500,
        status: 'active',
        tags: ['hackathon', 'tech', 'workshop'],
      },
      {
        id: 'event2',
        userId: 'user3',
        title: 'Cultural Night',
        description: 'Celebrate the diversity of our campus with performances, food stalls, and cultural activities.',
        location: 'Open Air Theatre',
        startDate: new Date('2025-11-20T17:00:00'),
        endDate: new Date('2025-11-20T22:00:00'),
        imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600',
        category: 'cultural',
        maxAttendees: 1000,
        status: 'active',
        tags: ['cultural', 'music', 'dance'],
      },
      {
        id: 'event3',
        userId: 'user4',
        title: 'Career Fair 2025',
        description: 'Meet recruiters from top companies and explore career opportunities.',
        location: 'Convention Center',
        startDate: new Date('2025-12-01T10:00:00'),
        endDate: new Date('2025-12-01T16:00:00'),
        imageUrl: 'https://images.unsplash.com/photo-1560264280-88b68371db39?w=600',
        category: 'academic',
        maxAttendees: 800,
        status: 'active',
        tags: ['career', 'jobs', 'networking'],
      },
      {
        id: 'event4',
        userId: 'user5',
        title: 'Inter-College Sports Meet',
        description: 'Annual sports championship with competitions in cricket, football, basketball, and athletics.',
        location: 'Sports Complex',
        startDate: new Date('2025-12-10T08:00:00'),
        endDate: new Date('2025-12-12T18:00:00'),
        imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600',
        category: 'sports',
        maxAttendees: 2000,
        status: 'active',
        tags: ['sports', 'competition', 'athletics'],
      },
    ];

    await db.insert(campusEvents).values(sampleEvents);
    console.log('Sample campus events created successfully');

    // Create sample RSVPs
    console.log('Creating sample RSVPs...');
    const sampleRsvps = [
      {
        id: 'rsvp1',
        eventId: 'event1',
        userId: 'user3',
        status: 'attending',
      },
      {
        id: 'rsvp2',
        eventId: 'event1',
        userId: 'user4',
        status: 'attending',
      },
      {
        id: 'rsvp3',
        eventId: 'event2',
        userId: 'user2',
        status: 'interested',
      },
    ];

    await db.insert(eventRsvps).values(sampleRsvps);
    console.log('Sample RSVPs created successfully');

    // Create sample comments
    console.log('Creating sample comments...');
    const sampleComments = [
      {
        id: 'comment1',
        userId: 'user3',
        itemId: 'lf1',
        itemType: 'lost_found',
        content: 'I think I saw this phone near the library yesterday!',
      },
      {
        id: 'comment2',
        userId: 'user4',
        itemId: 'camp1',
        itemType: 'campaign',
        content: 'Great cause! Just donated.',
      },
      {
        id: 'comment3',
        userId: 'user5',
        itemId: 'event1',
        itemType: 'event',
        content: 'Can\'t wait for this event!',
      },
    ];

    await db.insert(comments).values(sampleComments);
    console.log('Sample comments created successfully');

    // Create sample likes
    console.log('Creating sample likes...');
    const sampleLikes = [
      {
        id: 'like1',
        userId: 'user3',
        itemId: 'lf1',
        itemType: 'lost_found',
      },
      {
        id: 'like2',
        userId: 'user4',
        itemId: 'lf1',
        itemType: 'lost_found',
      },
      {
        id: 'like3',
        userId: 'user5',
        itemId: 'camp1',
        itemType: 'campaign',
      },
    ];

    await db.insert(likes).values(sampleLikes);
    console.log('Sample likes created successfully');

    console.log('Database seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log('Seed script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed script failed:', error);
    process.exit(1);
  });
