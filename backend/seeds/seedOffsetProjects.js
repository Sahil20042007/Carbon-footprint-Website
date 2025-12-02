const mongoose = require('mongoose');
const dotenv = require('dotenv');
const OffsetProject = require('../models/OffsetProject');

dotenv.config();

const projects = [
  {
    name: 'Amazon Rainforest Protection',
    type: 'Reforestation',
    location: 'Brazil',
    description: 'Protect 1000 acres of Amazon rainforest from deforestation. Each ton offset helps preserve vital carbon sinks and biodiversity.',
    pricePerTon: 1200,
    certified: 'Gold Standard',
    image: '🌳',
    featured: true,
    totalTonsOffset: 1250,
    supporters: 85
  },
  {
    name: 'Solar Energy India',
    type: 'Renewable Energy',
    location: 'Rajasthan, India',
    description: 'Support large-scale solar farms providing clean energy to 50,000 homes, replacing coal-based electricity.',
    pricePerTon: 960,
    certified: 'Verra VCS',
    image: '☀️',
    featured: true,
    totalTonsOffset: 3400,
    supporters: 215
  },
  {
    name: 'Wind Farms Tamil Nadu',
    type: 'Renewable Energy',
    location: 'Tamil Nadu, India',
    description: 'Offshore wind energy project generating clean electricity and creating local jobs.',
    pricePerTon: 880,
    certified: 'UN CDM',
    image: '💨',
    featured: false,
    totalTonsOffset: 2100,
    supporters: 142
  },
  {
    name: 'Clean Water Kenya',
    type: 'Water Conservation',
    location: 'Kenya',
    description: 'Provide clean water filters to 10,000 families, eliminating need for wood-burning water purification.',
    pricePerTon: 800,
    certified: 'Gold Standard',
    image: '💧',
    featured: false,
    totalTonsOffset: 890,
    supporters: 98
  },
  {
    name: 'Mangrove Restoration',
    type: 'Reforestation',
    location: 'Sundarbans, India',
    description: 'Plant and protect mangrove forests that absorb 5x more carbon than traditional forests.',
    pricePerTon: 1000,
    certified: 'Plan Vivo',
    image: '🌿',
    featured: true,
    totalTonsOffset: 1670,
    supporters: 127
  },
  {
    name: 'Ocean Cleanup Pacific',
    type: 'Ocean Cleanup',
    location: 'Pacific Ocean',
    description: 'Remove plastic waste from oceans and support marine ecosystem restoration.',
    pricePerTon: 1400,
    certified: 'Verified Carbon Standard',
    image: '🌊',
    featured: false,
    totalTonsOffset: 560,
    supporters: 73
  }
];

async function seedProjects() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing projects
    await OffsetProject.deleteMany({});
    console.log('🗑️  Cleared existing projects');

    // Insert new projects
    await OffsetProject.insertMany(projects);
    console.log('✅ Inserted', projects.length, 'offset projects');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedProjects();