import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { Search, Filter, AlertCircle, CheckCircle, Clock, Cpu, BarChart3, Clock4, CheckCircle2 } from 'lucide-react';

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
      case 'resolved': return <CheckCircle2 className="text-emerald-400 w-4 h-4" />;
      case 'in progress': return <AlertCircle className="text-indigo-400 w-4 h-4" />;
      default: return <Clock4 className="text-amber-400 w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    if (!priority) return 'bg-slate-800 text-slate-300 border-slate-700';
    const p = priority.toLowerCase();
    if (p.includes('high')) return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    if (p.includes('medium')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  };

  // Calculate Statistics
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="bg-slate-900 min-h-screen -mx-4 -my-8 px-4 py-8 sm:px-6 lg:px-8 text-slate-200 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Filters */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-5 p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-48 w-64 h-64 bg-purple-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage and track your complaints</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative z-10">
            <form onSubmit={handleSearch} className="relative flex-grow sm:max-w-xs group">
              <input
                type="text"
                placeholder="Search location..."
                className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner text-white placeholder-slate-500"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
              <Search className="absolute left-3.5 top-3.5 text-slate-500 w-5 h-5 group-hover:text-indigo-400 transition-colors" />
            </form>
            
            <div className="relative group">
              <select
                className="appearance-none w-full pl-11 pr-10 py-3 bg-slate-900/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner cursor-pointer font-medium text-slate-300"
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
              <Filter className="absolute left-3.5 top-3.5 text-slate-500 w-5 h-5 group-hover:text-indigo-400 transition-colors pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-lg flex items-center space-x-4">
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Total</p>
              <h4 className="text-2xl font-bold text-white">{totalComplaints}</h4>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-lg flex items-center space-x-4">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Pending</p>
              <h4 className="text-2xl font-bold text-white">{pendingComplaints}</h4>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-lg flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">In Progress</p>
              <h4 className="text-2xl font-bold text-white">{inProgressComplaints}</h4>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-lg flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Resolved</p>
              <h4 className="text-2xl font-bold text-white">{resolvedComplaints}</h4>
            </div>
          </div>
        </div>

        {/* Complaints Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-700 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 p-16 rounded-3xl text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-700">
              <AlertCircle className="h-10 w-10 text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-white">No complaints found</h3>
            <p className="text-slate-400 mt-2 text-lg">We couldn't find any records matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {complaints.map((complaint) => (
              <div key={complaint._id} className="bg-slate-800/80 backdrop-blur-md rounded-3xl overflow-hidden flex flex-col h-full border border-slate-700 hover:border-indigo-500/50 relative group transition-all duration-300 shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                
                <div className="p-7 flex-grow flex flex-col">
                  <div className="flex justify-between items-center mb-5">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-700 text-indigo-300 border border-slate-600 shadow-inner">
                      {complaint.category}
                    </span>
                    <div className="flex items-center space-x-1.5 text-sm font-semibold text-slate-300 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-700 shadow-sm">
                      {getStatusIcon(complaint.status)}
                      <span className="capitalize">{complaint.status}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 leading-tight">{complaint.title}</h3>
                  <p className="text-slate-400 text-sm mb-5 line-clamp-3 leading-relaxed flex-grow">{complaint.description}</p>
                  
                  {complaint.aiAnalysis && (
                    <div className="bg-slate-900/50 rounded-2xl p-4 mb-5 border border-indigo-500/20 shadow-inner group-hover:bg-slate-900/80 transition-colors">
                      <div className="flex items-center justify-between mb-3 border-b border-slate-700/50 pb-2">
                        <div className="flex items-center">
                          <Cpu className="w-4 h-4 text-indigo-400 mr-2" />
                          <span className="font-bold text-indigo-300 text-xs tracking-wider uppercase">AI Analysis</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-md border text-xs font-bold ${getPriorityColor(complaint.aiAnalysis.priority)}`}>
                          {complaint.aiAnalysis.priority || 'Unknown'}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Department</span>
                          <span className="font-semibold text-slate-200 text-sm block truncate" title={complaint.aiAnalysis.department}>
                            {complaint.aiAnalysis.department}
                          </span>
                        </div>
                        
                        {complaint.aiAnalysis.summary && (
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Summary</span>
                            <p className="text-slate-400 text-xs leading-relaxed">"{complaint.aiAnalysis.summary}"</p>
                          </div>
                        )}
                        
                        {complaint.aiAnalysis.autoResponse && (
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Auto-Response</span>
                            <p className="text-indigo-300 text-xs leading-relaxed bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">"{complaint.aiAnalysis.autoResponse}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-slate-500 flex items-center justify-between mt-auto pt-4 border-t border-slate-700/50">
                    <div className="font-semibold flex items-center">
                      <div className="w-6 h-6 rounded-full bg-slate-700 mr-2 flex items-center justify-center text-slate-300 text-[10px]">
                        {complaint.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-slate-300">{complaint.name}</span>
                    </div>
                    <div className="flex items-center bg-slate-900/50 px-2 py-1 rounded border border-slate-700 text-slate-400">
                      {complaint.location}
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-900/80 px-7 py-4 border-t border-slate-700 flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-500">
                    {new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <div className="relative">
                    <select
                      className="text-sm font-semibold bg-slate-800 border border-slate-600 text-slate-200 rounded-lg py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none shadow-sm cursor-pointer hover:bg-slate-700 transition-colors"
                      value={complaint.status}
                      onChange={(e) => updateStatus(complaint._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
