import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { Search, Filter, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const endpoint = searchLocation 
        ? `/complaints/search?location=${searchLocation}` 
        : `/complaints${categoryFilter ? `?category=${categoryFilter}` : ''}`;
      
      const response = await api.get(endpoint);
      setComplaints(response.data);
    } catch (error) {
      toast.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line
  }, [categoryFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/complaints/${id}`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved': return <CheckCircle className="text-green-500 w-5 h-5" />;
      case 'in progress': return <AlertCircle className="text-blue-500 w-5 h-5" />;
      default: return <Clock className="text-yellow-500 w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority) => {
    if (!priority) return 'bg-gray-100 text-gray-800';
    const p = priority.toLowerCase();
    if (p.includes('high')) return 'bg-red-100 text-red-800 border-red-200';
    if (p.includes('medium')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">Complaints Dashboard</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative flex-grow sm:max-w-xs">
            <input
              type="text"
              placeholder="Search by location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </form>
          
          <div className="relative">
            <select
              className="appearance-none w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Roads">Roads</option>
              <option value="General">General</option>
            </select>
            <Filter className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-gray-100">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No complaints found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {complaint.category}
                  </span>
                  <div className="flex items-center space-x-1 text-sm font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded-md">
                    {getStatusIcon(complaint.status)}
                    <span className="capitalize">{complaint.status}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{complaint.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{complaint.description}</p>
                
                {complaint.aiAnalysis && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm border border-gray-100">
                    <p className="font-semibold text-gray-700 mb-1 flex items-center">
                      <span className={`inline-block px-2 py-1 rounded border text-xs mr-2 ${getPriorityColor(complaint.aiAnalysis.priority)}`}>
                        {complaint.aiAnalysis.priority || 'Unknown'} Priority
                      </span>
                    </p>
                    <p className="text-gray-600"><span className="font-medium">Dept:</span> {complaint.aiAnalysis.department}</p>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 flex items-center mt-auto">
                  <span className="font-medium mr-1">{complaint.name}</span> • {complaint.location}
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
                <select
                  className="text-sm border-gray-300 rounded-md py-1 pl-2 pr-6 focus:ring-blue-500 focus:border-blue-500"
                  value={complaint.status}
                  onChange={(e) => updateStatus(complaint._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
