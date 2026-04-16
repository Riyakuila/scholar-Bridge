import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/ScholarBridgeLogo.jpeg';
import ctaBg from '../assets/community.jpg';
import { BookOpen, Globe, MessageSquare, ShieldCheck, ArrowRight, BookMarked } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-brand-100 selection:text-brand-700">
      {/* 1. Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Link to="/home" className="flex items-center gap-2 group">
            <img
              src={logo}
              alt="ScholarBridge Logo"
              className="h-16 w-auto transition-transform group-hover:scale-105"
            />
            <span className="text-2xl font-bold text-gray-900 tracking-tight">ScholarBridge</span>
          </Link>
        </div>

        <div className="flex items-center gap-4 sm:gap-8">
          <Link to="/login" className="text-gray-600 font-semibold hover:text-brand-600 transition-colors">
            Sign In
          </Link>
          <Link
            to="/register"
            className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-brand-600 transition-all shadow-md active:scale-95"
          >
            Join Network
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className="px-6 pt-16 pb-24 max-w-7xl mx-auto text-center lg:text-left flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 px-4 py-1.5 rounded-full text-brand-700 text-sm font-bold">
            <Globe size={16} /> <span>Open for students worldwide</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
            The Global Bridge <br />
            <span className="text-brand-600">for Student Books.</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
            Don't let your knowledge gather dust. List your textbooks, find local peers,
            and exchange resources securely. Built by students, for the global student community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              to="/register"
              className="group flex items-center justify-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-brand-700 transition-all shadow-xl shadow-brand-100 active:scale-95"
            >
              Start Sharing <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <button className="px-8 py-4 rounded-2xl font-bold text-lg border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
              Explore Locally
            </button>
          </div>

          <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-gray-400 font-medium">
            <span className="flex items-center gap-1.5"><ShieldCheck size={18} className="text-green-500" /> Secure Exchange</span>
            <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
            <span className="flex items-center gap-1.5"><MessageSquare size={18} className="text-brand-500" /> Real-time Chat</span>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="flex-1 relative w-full max-w-xl group mt-12 lg:mt-0">
          {/* Animated Background Glow */}
          <div className="absolute -inset-10 bg-linear-to-tr from-indigo-200 to-purple-100 rounded-[3rem] blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>

          <div className="relative bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl p-4 overflow-hidden transform hover:-translate-y-2 transition-transform duration-500">
            {/* Real Student Image */}
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800"
              alt="Students collaborating"
              className="w-full h-auto rounded-[1.8rem] object-cover aspect-4/3 brightness-95 group-hover:brightness-100 transition"
            />

            {/* Floating UI Elements */}
            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/20 animate-bounce-slow">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-bold text-gray-700">Book Requested!</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Global Stats / Trust Section */}
      <section className="bg-gray-50 border-y border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="text-4xl font-black text-gray-900 mb-2">100+</h3>
            <p className="text-gray-500 font-semibold uppercase tracking-wider text-sm">Universities</p>
          </div>
          <div>
            <h3 className="text-4xl font-black text-gray-900 mb-2">5k+</h3>
            <p className="text-gray-500 font-semibold uppercase tracking-wider text-sm">Books Shared</p>
          </div>
          <div>
            <h3 className="text-4xl font-black text-gray-900 mb-2">Free</h3>
            <p className="text-gray-500 font-semibold uppercase tracking-wider text-sm">Forever for Students</p>
          </div>
        </div>
      </section>

      {/* 4. Visual Process Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">How it works</h2>
          <p className="text-gray-500 text-lg">Three simple steps to bridge the resource gap.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-6 group">
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <img src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400" className="group-hover:scale-110 transition duration-500" alt="List Book" />
            </div>
            <h4 className="text-xl font-bold">1. List Your Book</h4>
            <p className="text-gray-600">Snap a photo and list your textbook in under a minute.</p>
          </div>

          <div className="space-y-6 group">
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <img src="https://imgs.search.brave.com/r7ZFt0XXJk4lByzMY3WOwM9ETS3LRMPgzNjjD7PiRSw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTMw/NzI4ODQ0OC9waG90/by9oaWdoLXNjaG9v/bC1vci1jb2xsZWdl/LXN0dWRlbnQtcmV0/dXJpbmctbGlicmFy/eS5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9VHZ6TnB1XzFv/ZEJGX2J6ZldKWnlM/TWUyTTM1cWdtR2ti/bEt5Um5sTGpqWT0" className="group-hover:scale-110 transition duration-500" alt="Connect" />
            </div>
            <h4 className="text-xl font-bold">2. Connect Locally</h4>
            <p className="text-gray-600">Peers in your city or college request to borrow or buy.</p>
          </div>

          <div className="space-y-6 group">
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <img src="https://i.pinimg.com/1200x/82/15/a1/8215a110c414247cb1ce0b4897eaf740.jpg" className="group-hover:scale-110 transition duration-500" alt="Chat" />
            </div>
            <h4 className="text-xl font-bold">3. Chat & Exchange</h4>
            <p className="text-gray-600">Use our secure real-time chat to finalize the hand-off.</p>
          </div>
        </div>
      </section>

      {/* 5. Features / Trust Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
                Built for Students, <br />
                <span className="text-brand-600">Secure by Design.</span>
              </h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="bg-white p-3 rounded-2xl shadow-md h-fit">
                    <ShieldCheck className="text-green-500" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Ownership Control</h4>
                    <p className="text-gray-600">You decide who gets your resources. Review requests before accepting.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white p-3 rounded-2xl shadow-md h-fit">
                    <MessageSquare className="text-brand-600" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Encrypted Chat</h4>
                    <p className="text-gray-600">Communicate safely via our built-in socket system. No need to share personal numbers.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white p-3 rounded-2xl shadow-md h-fit">
                    <Globe className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Universal Access</h4>
                    <p className="text-gray-600">Find resources in any city or college across the globe with smart filters.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Mockup of the Chat/Request */}
            <div className="relative">
              <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 border border-gray-100 relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-bold text-gray-900">Active Request</span>
                  <span className="bg-brand-50 text-brand-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Accepted</span>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100"><img src="https://i.pinimg.com/736x/50/06/87/50068703160128325513ab5525066d70.jpg" alt="profile pic" /></div>
                    <div className="h-3 w-32"><p>Rosy K.</p></div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl text-sm text-gray-600 italic">
                    "Hey! I'm interested in the Data Structures book. Is it available for pickup tomorrow?"
                  </div>
                </div>
                <button className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold">Open Secure Chat</button>
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-brand-100 rounded-[2.5rem] -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Common Questions</h2>
          <p className="text-gray-500 text-lg">Everything you need to know about the platform.</p>
        </div>

        <div className="space-y-6">
          {[
            {
              q: "Is ScholarBridge free to use?",
              a: "Yes! ScholarBridge is built by students, for students. Listing and requesting books is completely free."
            },
            {
              q: "How do I get the book after my request is accepted?",
              a: "Once the owner accepts your request, a secure chat opens. You can then coordinate a safe public meetup spot (like the university library) to exchange the book."
            },
            {
              q: "Can I use this if I'm not in engineering?",
              a: "Absolutely. While we have many technical resources, ScholarBridge is open to all branches, from Arts and Science to Medical and Law."
            },
            {
              q: "Is my personal data safe?",
              a: "We never display your phone number or exact address. Communication happens through our encrypted real-time chat system."
            }
          ].map((item, index) => (
            <div key={index} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-lg font-bold text-gray-900 mb-2">{item.q}</h4>
              <p className="text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Final CTA Section - Update with Background Image */}
      <section className="px-6 py-20">
        <div
          className="max-w-7xl mx-auto rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-brand-200 
               bg-cover bg-center bg-no-repeat bg-blend-overlay"
          style={{
            backgroundImage: `url(${ctaBg})`
          }}
        >
          {/* Optional: Darken overlay if text is hard to read */}
          <div className="absolute inset-0 bg-black/30 z-0"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Ready to clear your shelf?
            </h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students globally and start making education more accessible for everyone.
            </p>
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 bg-white text-brand-600 px-10 py-4 rounded-2xl font-black text-xl hover:bg-brand-50 transition-all active:scale-95 shadow-lg"
            >
              Join for Free
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      {/* 8. Professional Footer */}
      <footer className="bg-white pt-24 pb-12 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

            {/* Brand Column */}
            <div className="col-span-1 md:col-span-1 space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl shadow-lg shadow-brand-100">
                  <img
                    src={logo}
                    alt="ScholarBridge Logo"
                    className="h-16 w-auto transition-transform group-hover:scale-105"
                  />
                </div>
                <span className="text-2xl font-bold text-gray-900 tracking-tight">ScholarBridge</span>
              </div>
              <p className="text-gray-500 leading-relaxed">
                The global network for students to share, find, and bridge the gap in academic resources.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-brand-50 hover:text-brand-600 transition-all">
                  <span className="sr-only">Twitter</span>
                  {/* Use Lucide icons or simple text labels */}
                  <Globe size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-brand-50 hover:text-brand-600 transition-all">
                  <MessageSquare size={18} />
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">Platform</h4>
              <ul className="space-y-4 text-gray-500 font-medium">
                <li><Link to="/home" className="hover:text-brand-600 transition">Explore Books</Link></li>
                <li><Link to="/register" className="hover:text-brand-600 transition">Join Network</Link></li>
                <li><Link to="/add-book" className="hover:text-brand-600 transition">List a Resource</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">Support</h4>
              <ul className="space-y-4 text-gray-500 font-medium">
                <li><a href="#" className="hover:text-brand-600 transition">How it Works</a></li>
                <li><a href="#" className="hover:text-brand-600 transition">Safety Center</a></li>
                <li><a href="#" className="hover:text-brand-600 transition">Help Desk</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">Global</h4>
              <div className="p-4 bg-brand-50 rounded-2xl border border-brand-100">
                <p className="text-xs text-brand-700 font-bold mb-2 uppercase tracking-tighter">Current Network Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-gray-900">124 Universities Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-sm">
              © 2026 ScholarBridge. Built with ❤️ for students globally.
            </p>
            <div className="flex gap-8 text-sm font-bold text-gray-400 uppercase tracking-widest">
              <a href="#" className="hover:text-gray-900 transition">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition">Terms</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;