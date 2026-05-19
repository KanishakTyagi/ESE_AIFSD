import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { Search, Filter, AlertCircle, CheckCircle, Clock, Cpu } from 'lucide-react';

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
      case 'resolved': return <CheckCircle className="text-emerald-500 w-5 h-5" />;
      case 'in progress': return <AlertCircle className="text-indigo-500 w-5 h-5" />;
      default: return <Clock className="text-amber-500 w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority) => {
    if (!priority) return 'bg-gray-100 text-gray-800 border-gray-200';
    const p = priority.toLowerCase();
    if (p.includes('high')) return 'bg-rose-50 text-rose-700 border-rose-200 shadow-sm shadow-rose-100';
    if (p.includes('medium')) return 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm shadow-amber-100';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-100';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="glass-card flex flex-col md:flex-row justify-between items-center gap-5 p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-48 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage and track your complaints</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative z-10">
          <form onSubmit={handleSearch} className="relative flex-grow sm:max-w-xs group">
            <input
              type="text"
              placeholder="Search location..."
              className="w-full pl-11 pr-4 py-3 bg-white/70 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all shadow-sm group-hover:shadow-md"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
            <Search className="absolute left-3.5 top-3.5 text-gray-400 w-5 h-5 group-hover:text-indigo-500 transition-colors" />
          </form>
          
          <div className="relative group">
            <select
              className="appearance-none w-full pl-11 pr-10 py-3 bg-white/70 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all shadow-sm group-hover:shadow-md cursor-pointer font-medium text-gray-700"
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
            <Filter className="absolute left-3.5 top-3.5 text-gray-400 w-5 h-5 group-hover:text-indigo-500 transition-colors pointer-events-none" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>
      ) : complaints.length === 0 ? (
        <div className="glass-card p-16 rounded-3xl text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <AlertCircle className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">No complaints found</h3>
          <p className="text-gray-500 mt-2 text-lg">We couldn't find any records matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="glass-card rounded-3xl overflow-hidden flex flex-col h-full border border-white/50 relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
              
              <div className="p-7 flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-5">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm">
                    {complaint.category}
                  </span>
                  <div className="flex items-center space-x-1.5 text-sm font-semibold text-gray-700 bg-white/80 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                    {getStatusIcon(complaint.status)}
                    <span className="capitalize">{complaint.status}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{complaint.title}</h3>
                <p className="text-gray-600 text-sm mb-5 line-clamp-3 leading-relaxed flex-grow">{complaint.description}</p>
                
                {complaint.aiAnalysis && (
                  <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 rounded-2xl p-4 mb-5 border border-indigo-100/50 shadow-sm group-hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3 border-b border-indigo-100/50 pb-2">
                      <div className="flex items-center">
                        <Cpu className="w-4 h-4 text-indigo-600 mr-2" />
                        <span className="font-bold text-indigo-900 text-xs tracking-wider uppercase">AI Analysis</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-md border text-xs font-bold ${getPriorityColor(complaint.aiAnalysis.priority)}`}>
                        {complaint.aiAnalysis.priority || 'Unknown'}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-0.5">Department</span>
                        <span className="font-semibold text-gray-800 text-sm block truncate" title={complaint.aiAnalysis.department}>
                          {complaint.aiAnalysis.department}
                        </span>
                      </div>
                      
                      {complaint.aiAnalysis.summary && (
                        <div>
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-0.5">Summary</span>
                          <p className="text-gray-700 text-xs leading-relaxed">"{complaint.aiAnalysis.summary}"</p>
                        </div>
                      )}
                      
                      {complaint.aiAnalysis.autoResponse && (
                        <div>
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-0.5">Auto-Response</span>
                          <p className="text-indigo-800 text-xs leading-relaxed bg-indigo-100/40 p-2 rounded-lg border border-indigo-100/50">"{complaint.aiAnalysis.autoResponse}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div className="font-semibold flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 mr-2 flex items-center justify-center text-gray-600 text-[10px]">
                      {complaint.name.charAt(0).toUpperCase()}
                    </div>
                    {complaint.name}
                  </div>
                  <div className="flex items-center bg-gray-50 px-2 py-1 rounded border border-gray-100">
                    {complaint.location}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50/80 backdrop-blur-sm px-7 py-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">
                  {new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <div className="relative">
                  <select
                    className="text-sm font-semibold bg-white border border-gray-200 text-gray-700 rounded-lg py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                    value={complaint.status}
                    onChange={(e) => updateStatus(complaint._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
