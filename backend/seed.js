const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany();
        await Event.deleteMany();
        await Registration.deleteMany();

        console.log('Existing data cleared');

        // Create Admin User
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@eventhub.com',
            password: 'admin123',
            role: 'admin',
            phone: '+1 555-0100'
        });

        console.log('Admin user created');

        // Create Sample Users
        const user1 = await User.create({
            name: 'John Doe',
            email: 'user@eventhub.com',
            password: 'user123',
            role: 'user',
            phone: '+1 555-0101'
        });

        const user2 = await User.create({
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: 'password123',
            role: 'user',
            phone: '+1 555-0102'
        });

        const user3 = await User.create({
            name: 'Mike Johnson',
            email: 'mike@example.com',
            password: 'password123',
            role: 'user',
            phone: '+1 555-0103'
        });

        console.log('Sample users created');

        // Create Sample Events
        const events = [
            {
                title: 'Tech Innovation Summit 2024',
                description: 'Join us for the biggest tech innovation summit of the year! Featuring keynote speakers from leading tech companies, interactive workshops on AI and machine learning, networking sessions with industry leaders, and startup pitch competitions. This is your opportunity to learn about the latest technological advancements and connect with innovators from around the world.',
                date: new Date('2024-12-25'),
                time: '09:00 AM',
                category: 'Conference',
                venue: 'University Main Auditorium',
                location: {
                    lat: 40.7128,
                    lng: -74.0060,
                    address: '123 University Ave, New York, NY 10001'
                },
                image: 'event-tech.jpg',
                capacity: 500,
                createdBy: admin._id
            },
            {
                title: 'Spring Music Festival',
                description: 'Get ready for an unforgettable night of music! Our annual Spring Music Festival features performances from local bands, solo artists, and DJ sets across multiple stages. Enjoy food trucks, art installations, and a vibrant atmosphere perfect for students and music lovers. Bring your friends and celebrate the arrival of spring with amazing live music!',
                date: new Date('2024-12-28'),
                time: '06:00 PM',
                category: 'Concert',
                venue: 'Campus Open Ground',
                location: {
                    lat: 40.7580,
                    lng: -73.9855,
                    address: '456 Campus Drive, New York, NY 10002'
                },
                image: 'event-concert.jpg',
                capacity: 1000,
                createdBy: admin._id
            },
            {
                title: 'Web Development Workshop',
                description: 'Learn modern web development from scratch in this intensive hands-on workshop. Topics covered include HTML5, CSS3, JavaScript ES6+, React framework, responsive design principles, and deployment strategies. Perfect for beginners and intermediate learners. All participants will build and deploy a complete web application by the end of the workshop. Laptops required.',
                date: new Date('2024-12-30'),
                time: '10:00 AM',
                category: 'Workshop',
                venue: 'Computer Science Lab Building',
                location: {
                    lat: 40.7489,
                    lng: -73.9680,
                    address: '789 Tech Lane, New York, NY 10003'
                },
                image: 'event-workshop.jpg',
                capacity: 50,
                createdBy: admin._id
            },
            {
                title: 'Annual Sports Tournament',
                description: 'Compete in our annual inter-university sports tournament! Events include basketball, soccer, volleyball, track and field, and swimming. Open to all students with team and individual categories. Prizes for winners in each category. Show your athletic skills and represent your department. Registration closes one week before the event.',
                date: new Date('2025-01-05'),
                time: '08:00 AM',
                category: 'Sports',
                venue: 'University Sports Complex',
                location: {
                    lat: 40.7614,
                    lng: -73.9776,
                    address: '321 Athletic Way, New York, NY 10004'
                },
                image: 'event-sports.jpg',
                capacity: 300,
                createdBy: admin._id
            },
            {
                title: 'International Cultural Night',
                description: 'Experience the diversity of our university community! International Cultural Night features traditional performances, music, dance, and cuisine from around the world. Students from various countries will showcase their rich cultural heritage through colorful presentations. Enjoy authentic international food stalls and participate in cultural activities. A celebration of global unity and diversity.',
                date: new Date('2025-01-10'),
                time: '07:00 PM',
                category: 'Cultural',
                venue: 'Student Center Main Hall',
                location: {
                    lat: 40.7400,
                    lng: -74.0000,
                    address: '555 Student Plaza, New York, NY 10005'
                },
                image: 'event-cultural.jpg',
                capacity: 400,
                createdBy: admin._id
            },
            {
                title: 'Career Networking Event',
                description: 'Connect with industry professionals and potential employers at our exclusive career networking event. Meet recruiters from top companies, learn about job opportunities and internships, participate in mock interviews, attend career development workshops, and expand your professional network. Business casual attire recommended. Bring copies of your resume.',
                date: new Date('2025-01-15'),
                time: '05:00 PM',
                category: 'Networking',
                venue: 'Business School Conference Center',
                location: {
                    lat: 40.7350,
                    lng: -74.0100,
                    address: '888 Business Blvd, New York, NY 10006'
                },
                image: 'event-networking.jpg',
                capacity: 200,
                createdBy: admin._id
            },
            {
                title: 'AI & Machine Learning Seminar',
                description: 'Dive deep into the world of Artificial Intelligence and Machine Learning in this comprehensive seminar. Expert speakers from industry and academia will discuss the latest trends in AI, practical applications of ML algorithms, ethical considerations in AI development, and career opportunities in the field. Includes Q&A session and networking opportunities.',
                date: new Date('2025-01-20'),
                time: '02:00 PM',
                category: 'Seminar',
                venue: 'Engineering Lecture Hall',
                location: {
                    lat: 40.7500,
                    lng: -73.9950,
                    address: '101 Innovation Street, New York, NY 10007'
                },
                image: 'event-tech.jpg',
                capacity: 150,
                createdBy: admin._id
            }
        ];

        const createdEvents = await Event.insertMany(events);
        console.log('Sample events created');

        // Create some sample registrations
        await Registration.create([
            { user: user1._id, event: createdEvents[0]._id },
            { user: user1._id, event: createdEvents[1]._id },
            { user: user2._id, event: createdEvents[0]._id },
            { user: user2._id, event: createdEvents[2]._id },
            { user: user3._id, event: createdEvents[1]._id }
        ]);

        console.log('Sample registrations created');

        console.log('\n=== Database Seeded Successfully ===\n');
        console.log('Admin Login:');
        console.log('  Email: admin@eventhub.com');
        console.log('  Password: admin123\n');
        console.log('User Login:');
        console.log('  Email: user@eventhub.com');
        console.log('  Password: user123\n');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

connectDB().then(() => {
    seedData();
});
