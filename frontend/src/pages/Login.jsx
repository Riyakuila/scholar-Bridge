import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, BookMarked, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../assets/ScholarBridgeLogo.jpeg';



const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', formData);
      login(data);
      navigate('/home');
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-275 w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 min-h-150 border border-gray-100">
        <div className="p-12 lg:p-20 flex flex-col justify-center bg-white order-2 md:order-1">
          <div className="max-w-md mx-auto w-full">
            <Link to="/" className="flex items-center gap-2 mb-12 self-start md:hidden">
               <img
                src={logo}
                alt="ScholarBridge Logo"
                className="h-10 rounded-lg w-auto transition-transform group-hover:scale-105"
               />
               <span className="text-xl font-bold tracking-tight">ScholarBridge</span>
            </Link>

            <h3 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h3>
            <p className="text-gray-500 mb-10 font-medium">Please enter your details to sign in.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    placeholder="name@university.edu"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
                  <a href="#" className="text-xs font-bold text-brand-600 hover:underline">Forgot?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                  <input
                    type="password"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    placeholder="••••••••"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-100 hover:bg-brand-700 hover:shadow-brand-200 transition-all active:scale-95 mt-4"
              >
                Sign In
              </button>
            </form>

            <p className="text-center mt-10 text-gray-600 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-600 font-bold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>

        <div className="relative hidden md:flex flex-col justify-between p-12 text-white bg-brand-500 order-1 md:order-2">
          <div className="absolute inset-0 bg-linear-to-br from-brand-500 to-brand-700"></div>
          
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-80 h-80 bg-brand-400 rounded-full blur-3xl opacity-30"></div>
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-16 self-start group">
              <div className="bg-white p-2 rounded-xl">
                <BookMarked size={20} className="text-brand-500" />
              </div>
              <span className="text-xl font-bold tracking-tight">ScholarBridge</span>
            </Link>

            <div className="space-y-6 mt-20">
              <h2 className="text-5xl font-black leading-tight">
                Welcome <br /> Back, Scholar.
              </h2>
              <p className="text-lg text-brand-50/80 leading-relaxed max-w-xs">
                Log in to continue sharing knowledge and connecting with your global peers.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-8 mb-8">
            <img 
              src="https://i.pinimg.com/1200x/47/22/12/4722124295f8275d1bfdc9f945cb1d8b.jpg" 
              alt="Global Students" 
              className="rounded-2xl shadow-2xl border-4 "
            />
          </div>

          <div className="relative z-10 flex items-center gap-2 text-sm font-bold text-brand-200">
            <ShieldCheck size={18} />
            <span>Verified Secure Network</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;