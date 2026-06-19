const { Category, User, Event } = require('../models');
const bcrypt = require('bcrypt');

const CATEGORY_KEYS = {
    TECHNOLOGY: 'Technology',
    EDUCATION: 'Education',
    SPORTS: 'Sports',
    CULTURE: 'Culture',
    VOLUNTEER: 'Volunteer',
    BUSINESS: 'Business'
};

const seedData = async () => {
    try {
        const categoryCount = await Category.count();
        let categories = {};

        if (categoryCount === 0) {
            console.log('Seeding categories...');
            const cats = [
                { name: CATEGORY_KEYS.TECHNOLOGY, description: 'Workshops, hackathons, and technical training', icon: 'tech' },
                { name: CATEGORY_KEYS.EDUCATION, description: 'Academic courses and community learning sessions', icon: 'edu' },
                { name: CATEGORY_KEYS.SPORTS, description: 'Marathons, leagues, and athletic activities', icon: 'sports' },
                { name: CATEGORY_KEYS.CULTURE, description: 'Heritage exhibitions, literary talks, and arts festivals', icon: 'culture' },
                { name: CATEGORY_KEYS.VOLUNTEER, description: 'Relief campaigns, tree planting, and community service', icon: 'volunteer' },
                { name: CATEGORY_KEYS.BUSINESS, description: 'Startup meetups, entrepreneurship, and project funding', icon: 'startup' }
            ];

            for (const cat of cats) {
                const c = await Category.create(cat);
                categories[cat.name] = c.id;
            }
            console.log('Categories seeded.');
        } else {
            const allCats = await Category.findAll();
            allCats.forEach(c => {
                categories[c.name] = c.id;
            });
        }

        let organizer = await User.findOne({ where: { email: 'organizer@eventpulse.io' } });
        if (!organizer) {
            console.log('Seeding organizer user...');
            const hashedPassword = await bcrypt.hash('demo_password_2026', 10);
            organizer = await User.create({
                name: 'EventPulse Community Network',
                phone: '+15551234567',
                email: 'organizer@eventpulse.io',
                password: hashedPassword,
                role: 'organizer'
            });
            console.log('Organizer seeded.');
        }

        const eventCount = await Event.count();
        if (eventCount === 0) {
            console.log('Seeding demo events...');
            const mockEvents = [
                {
                    title: 'Youth Web Development Bootcamp 2026',
                    description: 'Demo data. An intensive workshop training computer science graduates and aspiring developers on full-stack web development using Node.js to build solutions that serve local communities.',
                    thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
                    location: 'Downtown',
                    address: 'Tech Innovation Hub, 120 Market Street, Suite 400',
                    startDate: new Date('2026-07-05T09:00:00Z'),
                    endDate: new Date('2026-07-09T15:00:00Z'),
                    capacity: 50,
                    availableSeats: 50,
                    price: 0.00,
                    categoryId: categories[CATEGORY_KEYS.TECHNOLOGY] || categories['Technology'],
                    organizerId: organizer.id
                },
                {
                    title: 'Annual City Marathon for Wellness',
                    description: 'Demo data. A community marathon for youth and families promoting physical and mental wellness. The race concludes with an awards ceremony for top finishers.',
                    thumbnail: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
                    location: 'Riverside District',
                    address: 'Harbor Promenade, starting at City Pier, finishing at Riverside Park',
                    startDate: new Date('2026-07-15T07:00:00Z'),
                    endDate: new Date('2026-07-15T12:00:00Z'),
                    capacity: 200,
                    availableSeats: 200,
                    price: 0.00,
                    categoryId: categories[CATEGORY_KEYS.SPORTS] || categories['Sports'],
                    organizerId: organizer.id
                },
                {
                    title: 'Interactive Heritage & Culture Exhibition',
                    description: 'Demo data. A cultural exhibition showcasing traditional crafts, folk embroidery, regional cuisine, and live performances celebrating local heritage and identity.',
                    thumbnail: 'https://images.unsplash.com/photo-1513829096970-cf9989577dfc?auto=format&fit=crop&w=800&q=80',
                    location: 'Arts Quarter',
                    address: 'Culture & Arts Center, 45 Heritage Lane',
                    startDate: new Date('2026-07-22T10:00:00Z'),
                    endDate: new Date('2026-07-24T18:00:00Z'),
                    capacity: 150,
                    availableSeats: 150,
                    price: 10.00,
                    categoryId: categories[CATEGORY_KEYS.CULTURE] || categories['Culture'],
                    organizerId: organizer.id
                },
                {
                    title: 'Green City Tree Planting Initiative',
                    description: 'Demo data. A youth-led volunteer initiative aiming to plant 500 trees across public parks and streets to restore green spaces and improve urban environments.',
                    thumbnail: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80',
                    location: 'Greenfield',
                    address: 'Central Park and Main Square, Greenfield City',
                    startDate: new Date('2026-07-10T08:00:00Z'),
                    endDate: new Date('2026-07-10T14:00:00Z'),
                    capacity: 80,
                    availableSeats: 80,
                    price: 0.00,
                    categoryId: categories[CATEGORY_KEYS.VOLUNTEER] || categories['Volunteer'],
                    organizerId: organizer.id
                },
                {
                    title: 'Startup Summit & Pitch Competition',
                    description: 'Demo data. A summit connecting young entrepreneurs with investors and institutions to discuss startup ideas and award grants to the top 5 innovative projects.',
                    thumbnail: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
                    location: 'Business District',
                    address: 'Summit Tower, Royal Hall, 88 Commerce Blvd',
                    startDate: new Date('2026-07-28T09:30:00Z'),
                    endDate: new Date('2026-07-28T16:00:00Z'),
                    capacity: 100,
                    availableSeats: 100,
                    price: 25.00,
                    categoryId: categories[CATEGORY_KEYS.BUSINESS] || categories['Business'],
                    organizerId: organizer.id
                },
                {
                    title: 'Summer Learning Camp for Children',
                    description: 'Demo data. An interactive summer camp for children ages 7–13 offering educational support through play, art, creative writing, and recreational activities.',
                    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
                    location: 'Westside',
                    address: 'Community Learning Center, 22 Oak Avenue',
                    startDate: new Date('2026-07-02T08:30:00Z'),
                    endDate: new Date('2026-07-07T12:30:00Z'),
                    capacity: 60,
                    availableSeats: 60,
                    price: 0.00,
                    categoryId: categories[CATEGORY_KEYS.EDUCATION] || categories['Education'],
                    organizerId: organizer.id
                },
                {
                    title: 'Free Community Health & Wellness Day',
                    description: 'Demo data. A full-day health event with specialist doctors offering free check-ups, medical consultations, and essential supplies for seniors and children in underserved areas.',
                    thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
                    location: 'North District',
                    address: 'Regional Medical Clinic, 300 Health Parkway',
                    startDate: new Date('2026-07-18T09:00:00Z'),
                    endDate: new Date('2026-07-18T17:00:00Z'),
                    capacity: 120,
                    availableSeats: 120,
                    price: 0.00,
                    categoryId: categories[CATEGORY_KEYS.VOLUNTEER] || categories['Volunteer'],
                    organizerId: organizer.id
                },
                {
                    title: 'Renewable Energy Solutions Symposium',
                    description: 'Demo data. An academic symposium exploring solar and wind energy applications to address power and water challenges, featuring researchers and engineers from local universities.',
                    thumbnail: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
                    location: 'University Campus',
                    address: 'Conference Hall, State University, 1 Campus Drive',
                    startDate: new Date('2026-07-30T10:00:00Z'),
                    endDate: new Date('2026-07-30T14:30:00Z'),
                    capacity: 110,
                    availableSeats: 110,
                    price: 0.00,
                    categoryId: categories[CATEGORY_KEYS.EDUCATION] || categories['Education'],
                    organizerId: organizer.id
                }
            ];

            await Event.bulkCreate(mockEvents);
            console.log('Demo events seeded.');
        } else {
            console.log('Events already seeded. Skipping...');
        }
    } catch (e) {
        console.error('Seed Data Error:', e);
    }
};

module.exports = { seedData };
