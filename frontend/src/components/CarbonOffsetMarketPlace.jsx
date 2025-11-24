import React, { useState } from 'react';
import { ShoppingCart, Check, Trees, Wind, Droplets } from 'lucide-react';

const CarbonOffsetMarketplace = ({ yearlyFootprint }) => {
  const [selectedProjects, setSelectedProjects] = useState([]);
  
  const projects = [
    {
      id: 1,
      name: 'Amazon Rainforest Protection',
      type: 'Reforestation',
      icon: <Trees className="w-8 h-8" />,
      pricePerTon: 15,
      location: 'Brazil',
      certified: 'Gold Standard',
      description: 'Protect 100 acres of rainforest',
      image: '🌳'
    },
    {
      id: 2,
      name: 'Wind Energy India',
      type: 'Renewable Energy',
      icon: <Wind className="w-8 h-8" />,
      pricePerTon: 12,
      location: 'Gujarat, India',
      certified: 'Verra VCS',
      description: 'Support wind farms reducing coal dependency',
      image: '💨'
    },
    {
      id: 3,
      name: 'Clean Water Project',
      type: 'Water Conservation',
      icon: <Droplets className="w-8 h-8" />,
      pricePerTon: 10,
      location: 'Kenya',
      certified: 'UN CDM',
      description: 'Provide clean water to 5000 families',
      image: '💧'
    }
  ];
  
  const tonsToOffset = (yearlyFootprint / 1000).toFixed(2);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Carbon Offset Marketplace
      </h2>
      <p className="text-gray-600 mb-6">
        Offset your {tonsToOffset} tons of CO₂ by supporting verified climate projects
      </p>
      
      <div className="grid md:grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectCard 
            key={project.id}
            project={project}
            tonsToOffset={tonsToOffset}
            selected={selectedProjects.includes(project.id)}
            onSelect={() => {
              setSelectedProjects(prev => 
                prev.includes(project.id) 
                  ? prev.filter(id => id !== project.id)
                  : [...prev, project.id]
              );
            }}
          />
        ))}
      </div>
      
      {selectedProjects.length > 0 && (
        <div className="mt-6 p-6 bg-green-50 rounded-lg border-2 border-green-500">
          <h3 className="text-xl font-bold text-green-800 mb-2">
            Selected Projects: {selectedProjects.length}
          </h3>
          <p className="text-green-700">
            Total Cost: ₹{calculateTotalCost(selectedProjects, projects, tonsToOffset)}
          </p>
          <button className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold">
            Proceed to Offset
          </button>
        </div>
      )}
    </div>
  );
};

const ProjectCard = ({ project, tonsToOffset, selected, onSelect }) => {
  const cost = (project.pricePerTon * tonsToOffset * 80).toFixed(0); // Convert to INR
  
  return (
    <div className={`border-2 rounded-lg p-6 transition-all cursor-pointer ${
      selected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
    }`} onClick={onSelect}>
      <div className="flex justify-between items-start mb-4">
        <div className="text-5xl">{project.image}</div>
        {selected && <Check className="w-6 h-6 text-green-600" />}
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
      <p className="text-sm text-gray-600 mb-4">{project.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <span className="text-gray-500">Location:</span>
          <span className="ml-2 font-semibold">{project.location}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className="text-gray-500">Certified:</span>
          <span className="ml-2 font-semibold text-green-600">{project.certified}</span>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <div className="text-2xl font-bold text-green-600">₹{cost}</div>
        <div className="text-xs text-gray-500">for {tonsToOffset} tons CO₂</div>
      </div>
    </div>
  );
};

function calculateTotalCost(selectedIds, projects, tons) {
  return selectedIds.reduce((total, id) => {
    const project = projects.find(p => p.id === id);
    return total + (project.pricePerTon * tons * 80);
  }, 0).toFixed(0);
}

export default CarbonOffsetMarketplace;