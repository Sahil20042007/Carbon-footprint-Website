import React, { useState, useEffect } from 'react';
import { ShoppingCart, Check, Trees, Wind, Droplets, Leaf, Waves, Award, TrendingUp, Users } from 'lucide-react';
import axios from 'axios';

const CarbonOffsetMarketplace = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFootprint, setUserFootprint] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchUserFootprint();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/${process.env.REACT_APP_API_URL || 'http://localhost:5000'}api/offset/projects');
      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFootprint = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/offset/calculate', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUserFootprint(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching footprint:', error);
    }
  };

  const handlePurchase = async (projectId, tonsToOffset) => {
    try {
      setPurchasing(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        '${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/offset/purchase',
        { projectId, tonsOffset: parseFloat(tonsToOffset) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPurchaseSuccess(true);
        setTimeout(() => {
          setPurchaseSuccess(false);
          setSelectedProjects([]);
          fetchProjects(); // Refresh projects to show updated stats
        }, 3000);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert(error.response?.data?.message || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Reforestation': return <Trees className="w-8 h-8" />;
      case 'Renewable Energy': return <Wind className="w-8 h-8" />;
      case 'Water Conservation': return <Droplets className="w-8 h-8" />;
      case 'Wildlife Protection': return <Leaf className="w-8 h-8" />;
      case 'Ocean Cleanup': return <Waves className="w-8 h-8" />;
      default: return <Trees className="w-8 h-8" />;
    }
  };

  const toggleProject = (projectId) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const calculateTotal = () => {
    if (!userFootprint) return { cost: 0, tons: 0 };
    
    const tonsToOffset = parseFloat(userFootprint.tonsToOffset);
    const totalCost = selectedProjects.reduce((sum, projectId) => {
      const project = projects.find(p => p._id === projectId);
      return sum + (project ? project.pricePerTon * tonsToOffset : 0);
    }, 0);

    return {
      cost: totalCost.toFixed(0),
      tons: (tonsToOffset * selectedProjects.length).toFixed(2)
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading offset projects...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Success Message */}
      {purchaseSuccess && (
        <div className="mb-6 bg-green-100 border-2 border-green-500 rounded-lg p-4 animate-bounce">
          <div className="flex items-center space-x-3">
            <Check className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-bold text-green-800 text-lg">Purchase Successful! 🎉</h3>
              <p className="text-green-700">You're now carbon neutral! Certificate generated.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Carbon Offset Marketplace
          </h2>
          {userFootprint && (
            <p className="text-gray-600">
              Offset your <strong className="text-primary">{userFootprint.tonsToOffset} tons</strong> of CO₂ 
              by supporting verified climate projects
            </p>
          )}
        </div>
        <ShoppingCart className="w-12 h-12 text-primary" />
      </div>

      {/* User Footprint Card */}
      {userFootprint && (
        <div className="mb-6 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Your Annual Carbon Footprint</p>
              <p className="text-4xl font-bold">{userFootprint.tonsToOffset} tons CO₂</p>
              <p className="text-sm opacity-90 mt-1">{userFootprint.yearlyFootprint.toFixed(0)} kg per year</p>
            </div>
            <TrendingUp className="w-16 h-16 opacity-80" />
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {projects.map(project => (
          <ProjectCard
            key={project._id}
            project={project}
            selected={selectedProjects.includes(project._id)}
            onSelect={() => toggleProject(project._id)}
            tonsToOffset={userFootprint?.tonsToOffset || 0}
            getIcon={getIcon}
          />
        ))}
      </div>

      {/* Purchase Summary */}
      {selectedProjects.length > 0 && userFootprint && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-primary rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Offset Plan</h3>
          
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Projects Selected</p>
              <p className="text-3xl font-bold text-primary">{selectedProjects.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Total CO₂ Offset</p>
              <p className="text-3xl font-bold text-green-600">{calculateTotal().tons}</p>
              <p className="text-xs text-gray-500">tons</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-3xl font-bold text-blue-600">₹{calculateTotal().cost}</p>
            </div>
          </div>

          <button
            onClick={() => {
              selectedProjects.forEach(projectId => {
                handlePurchase(projectId, userFootprint.tonsToOffset);
              });
            }}
            disabled={purchasing}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-bold text-lg hover:from-green-600 hover:to-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {purchasing ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                Processing...
              </span>
            ) : (
              `Offset ${userFootprint.tonsToOffset} Tons & Become Carbon Neutral`
            )}
          </button>

          <p className="text-xs text-gray-600 text-center mt-3">
            🔒 Secure payment • 💳 All major cards accepted • 📜 Certificate of offset provided
          </p>
        </div>
      )}

      {selectedProjects.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Select Projects to Offset</h3>
          <p className="text-gray-600">
            Choose one or more projects to support and neutralize your carbon footprint
          </p>
        </div>
      )}
    </div>
  );
};

const ProjectCard = ({ project, selected, onSelect, tonsToOffset, getIcon }) => {
  const cost = (project.pricePerTon * tonsToOffset).toFixed(0);

  return (
    <div
      className={`border-2 rounded-lg p-5 transition-all cursor-pointer hover:shadow-xl ${
        selected ? 'border-green-500 bg-green-50 shadow-lg' : 'border-gray-200 hover:border-green-300'
      }`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${selected ? 'bg-green-200' : 'bg-gray-100'}`}>
            {getIcon(project.type)}
          </div>
          <div className="text-4xl">{project.image}</div>
        </div>
        {selected && (
          <div className="bg-green-500 text-white rounded-full p-1">
            <Check className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
          {project.type}
        </span>
        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
          📍 {project.location}
        </span>
      </div>

      {/* Certification */}
      <div className="flex items-center space-x-2 mb-3 text-xs">
        <Award className="w-4 h-4 text-green-600" />
        <span className="text-green-600 font-semibold">Certified: {project.certified}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div className="bg-gray-50 rounded p-2 text-center">
          <p className="text-gray-600 text-xs">Total Offset</p>
          <p className="font-bold text-gray-900">{project.totalTonsOffset} tons</p>
        </div>
        <div className="bg-gray-50 rounded p-2 text-center">
          <p className="text-gray-600 text-xs">Supporters</p>
          <p className="font-bold text-gray-900 flex items-center justify-center">
            <Users className="w-3 h-3 mr-1" />
            {project.supporters}
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Your cost</p>
            <p className="text-2xl font-bold text-green-600">₹{cost}</p>
            <p className="text-xs text-gray-500">for {tonsToOffset} tons</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Per ton</p>
            <p className="text-lg font-bold text-gray-700">₹{project.pricePerTon}</p>
          </div>
        </div>
      </div>

      {project.featured && (
        <div className="mt-3 bg-yellow-100 border border-yellow-300 rounded p-2 text-center">
          <p className="text-xs font-bold text-yellow-800">⭐ FEATURED PROJECT</p>
        </div>
      )}
    </div>
  );
};

export default CarbonOffsetMarketplace;