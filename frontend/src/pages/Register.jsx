import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, School, GraduationCap, ArrowRight, BookMarked } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../assets/ScholarBridgeLogo.jpeg';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', college: '', branch: ''
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/register', formData);
      login(data);
      navigate('/home');
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 md:p-6">
      {/* Main Card Container */}
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-175">
        
        {/* Left Side: Branding & Image (Matches the Pinterest vibe) */}
        <div className="md:w-5/12 bg-brand-500 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-50 blur-3xl"></div>
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-12">
              <img
                src={logo}
                alt="ScholarBridge Logo"
                className="h-10 rounded-lg w-auto transition-transform group-hover:scale-105"
              />
              <span className="text-xl font-bold tracking-tight">ScholarBridge</span>
            </Link>
            
            <h2 className="text-4xl font-black leading-tight mb-6">
              Join the World's Largest Student Library.
            </h2>
            <p className="text-brand-100 text-lg leading-relaxed">
              Connect with students globally, share your resources, and build a bridge to accessible education.
            </p>
          </div>

          {/* Bottom Illustration Placeholder - You can add your image here */}
          <div className="relative z-10 mb-10">
            <img 
              src="https://i.pinimg.com/1200x/74/83/e8/7483e80deb1840cbc153a8ec3c96cbaf.jpg" 
              alt="Global Students" 
              className="rounded-2xl shadow-2xl border-4"
            />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h3 className="text-3xl font-black text-gray-900 mb-2">Create Account</h3>
            <p className="text-gray-500 mb-10">Start your journey with us today.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your name"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              {/* University & Branch Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">University</label>
                  <div className="relative group">
                    <School className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                    <input
                      type="text"
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
                      placeholder="College"
                      onChange={(e) => setFormData({...formData, college: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Branch</label>
                  <div className="relative group">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                    <input
                      type="text"
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
                      placeholder="Major"
                      onChange={(e) => setFormData({...formData, branch: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    placeholder="name@university.edu"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                  <input
                    type="password"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    placeholder="••••••••"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-100 hover:bg-brand-700 hover:shadow-brand-200 transition-all active:scale-95 mt-4"
              >
                Sign Up
              </button>
            </form>

            <p className="text-center mt-8 text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-600 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;