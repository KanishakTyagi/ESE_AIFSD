import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { Send, Cpu, AlertTriangle } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-blue-600 px-8 py-6 text-white">
          <h2 className="text-2xl font-bold">Register New Complaint</h2>
          <p className="text-blue-100 mt-1">Provide details about your issue, and our AI will help categorize it.</p>
        </div>
        
        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="E.g., Water leakage in main street"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="City or Area name"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Water Supply">Water Supply</option>
                <option value="Electricity">Electricity</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Roads">Roads</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                <span>Description</span>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={analyzing || !formData.description}
                  className="text-xs inline-flex items-center text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  <Cpu className="w-3 h-3 mr-1" />
                  {analyzing ? 'Analyzing...' : 'Analyze with AI'}
                </button>
              </label>
              <textarea
                name="description"
                required
                rows="4"
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the issue in detail..."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4 mr-2" />
              {submitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>

          {/* AI Analysis Result Section */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
              <Cpu className="w-5 h-5 mr-2 text-blue-500" />
              AI Assistant Analysis
            </h3>
            
            {aiAnalysis ? (
              <div className="space-y-4 flex-grow">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Priority</span>
                  <div className="flex items-center">
                    <AlertTriangle className={`w-4 h-4 mr-2 ${
                      aiAnalysis.priority?.toLowerCase().includes('high') ? 'text-red-500' : 
                      aiAnalysis.priority?.toLowerCase().includes('medium') ? 'text-yellow-500' : 'text-green-500'
                    }`} />
                    <span className="font-medium text-gray-900">{aiAnalysis.priority}</span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Recommended Department</span>
                  <p className="font-medium text-gray-900">{aiAnalysis.department}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Summary</span>
                  <p className="text-sm text-gray-700">{aiAnalysis.summary}</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-auto">
                  <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider block mb-1">Auto-Response Preview</span>
                  <p className="text-sm text-blue-900 italic">"{aiAnalysis.autoResponse}"</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-grow text-gray-400 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <Cpu className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-sm max-w-[200px]">Type your description and click "Analyze with AI" to see intelligent insights.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateComplaint;
