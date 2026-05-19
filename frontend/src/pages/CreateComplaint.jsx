import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { Send, Cpu, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

const CreateComplaint = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    location: ''
  });
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async () => {
    if (!formData.description) {
      toast.warning('Please enter a description to analyze');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await api.post('/ai/analyze', { description: formData.description });
      setAiAnalysis(response.data);
      
      // Auto-update category based on AI suggestion if it matches our options roughly
      if (response.data.department) {
        const dept = response.data.department.toLowerCase();
        if (dept.includes('water')) setFormData(prev => ({...prev, category: 'Water Supply'}));
        else if (dept.includes('electric')) setFormData(prev => ({...prev, category: 'Electricity'}));
        else if (dept.includes('sanitat') || dept.includes('garbage')) setFormData(prev => ({...prev, category: 'Sanitation'}));
      }
      
      toast.success('AI Analysis complete');
    } catch (error) {
      toast.error('AI Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const payload = {
        name: user.name,
        email: user.email,
        ...formData,
        aiAnalysis
      };
      
      await api.post('/complaints', payload);
      toast.success('Complaint submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 tracking-tight mb-3">Register Complaint</h1>
        <p className="text-gray-500 text-lg">Provide details below and let our AI assist you with proper routing.</p>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden shadow-xl border border-white/60">
        <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
          
          {/* Form Section */}
          <div className="p-8 sm:p-10 lg:col-span-3 border-b lg:border-b-0 lg:border-r border-gray-100 bg-white/40">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="block w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 placeholder-gray-400"
                  placeholder="E.g., Water leakage in main street"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    required
                    className="block w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 placeholder-gray-400"
                    placeholder="City or Area name"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <div className="relative">
                    <select
                      name="category"
                      className="block w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 appearance-none cursor-pointer"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="Water Supply">Water Supply</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Sanitation">Sanitation</option>
                      <option value="Roads">Roads</option>
                      <option value="General">General</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex justify-between items-end mb-2">
                  <span className="block text-sm font-bold text-gray-700">Description</span>
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={analyzing || !formData.description}
                    className="group inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 hover:text-indigo-800 transition-colors disabled:opacity-50 disabled:pointer-events-none shadow-sm"
                  >
                    {analyzing ? (
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-indigo-700 border-t-transparent mr-1.5"></div>
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 mr-1.5 group-hover:text-purple-600 transition-colors" />
                    )}
                    {analyzing ? 'Analyzing...' : 'Analyze with AI'}
                  </button>
                </label>
                <textarea
                  name="description"
                  required
                  rows="5"
                  className="block w-full px-5 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 placeholder-gray-400 resize-none"
                  placeholder="Describe the issue in detail. The more details you provide, the better our AI can categorize it..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:transform-none transition-all transform hover:-translate-y-0.5"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {submitting ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </div>
            </form>
          </div>

          {/* AI Analysis Result Section */}
          <div className="p-8 sm:p-10 lg:col-span-2 bg-gradient-to-br from-indigo-50 to-purple-50/50 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            
            <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center relative z-10">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3 text-indigo-600">
                <Cpu className="w-5 h-5" />
              </div>
              AI Assistant
            </h3>
            
            {aiAnalysis ? (
              <div className="space-y-4 flex-grow relative z-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-100/50 hover:shadow-md transition-shadow">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">Detected Priority</span>
                  <div className="flex items-center">
                    <AlertTriangle className={`w-5 h-5 mr-2.5 ${
                      aiAnalysis.priority?.toLowerCase().includes('high') ? 'text-rose-500' : 
                      aiAnalysis.priority?.toLowerCase().includes('medium') ? 'text-amber-500' : 'text-emerald-500'
                    }`} />
                    <span className="font-bold text-gray-900 text-lg">{aiAnalysis.priority}</span>
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-100/50 hover:shadow-md transition-shadow">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">Routed Department</span>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 mr-2.5" />
                    <span className="font-bold text-gray-900 text-lg">{aiAnalysis.department}</span>
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-100/50 hover:shadow-md transition-shadow">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-2">Issue Summary</span>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">"{aiAnalysis.summary}"</p>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 rounded-2xl shadow-lg mt-auto text-white">
                  <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest block mb-2 flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" /> Auto-Response Draft
                  </span>
                  <p className="text-sm italic leading-relaxed text-indigo-50 font-medium">"{aiAnalysis.autoResponse}"</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-grow text-center space-y-4 relative z-10 opacity-70">
                <div className="w-24 h-24 rounded-full bg-indigo-100/50 flex items-center justify-center mb-2 border-2 border-dashed border-indigo-200">
                  <Cpu className="w-10 h-10 text-indigo-300" strokeWidth={1.5} />
                </div>
                <h4 className="font-bold text-gray-700 text-lg">Waiting for Input</h4>
                <p className="text-sm text-gray-500 max-w-[220px] leading-relaxed">
                  Type your description and click "Analyze with AI" to see intelligent categorization and auto-responses.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateComplaint;
