import { Link } from 'react-router-dom';
import { Smartphone, Zap, Palette } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Slim top contact bar */}
      <header className="bg-[#2e1815] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-y-1 text-[11px] sm:text-xs">
          <a href="mailto:hello@mymenu.co.ke" className="hover:underline opacity-90">
            hello@mymenu.co.ke
          </a>
          <div className="flex flex-wrap gap-x-4 gap-y-1 opacity-90 justify-end">
            <a
              href="https://wa.me/254713612141"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              WhatsApp +254 713 612141
            </a>
            <a href="#" className="hover:underline">
              TikTok
            </a>
            <a href="#" className="hover:underline">
              Instagram
            </a>
            <a href="#" className="hover:underline">
              Facebook
            </a>
          </div>
        </div>

        {/* Main nav bar (sticky on scroll) */}
        <div className="bg-[#3a221f] shadow-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-6 text-white">
            <div className="flex items-center gap-3">
              <img
                src="/my menu logo.avif"
                alt="QR Menu Platform logo"
                className="h-9 sm:h-10 w-auto rounded-md object-contain"
              />
            </div>
            <nav className="flex-1 flex items-center justify-end gap-6 text-xs sm:text-sm">
              <div className="hidden md:flex items-center gap-6">
                <a href="#about" className="hover:text-amber-200">
                  About
                </a>
                <a href="#pricing" className="hover:text-amber-200">
                  Pricing
                </a>
                <a href="#faqs" className="hover:text-amber-200">
                  FAQs
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-md border border-white/40 text-xs font-medium hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-md bg-white text-[#4b2e2a] text-xs font-semibold hover:bg-amber-50"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center" id="about">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            Digital Menus Made Simple
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create beautiful digital menus for your hotel, restaurant, or cafe in minutes.
            No technical skills required. Just scan and serve!
          </p>
          <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-block">
            Start Free Trial
          </Link>
        </div>

        {/* Stats strip */}
        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-700 mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">QR Code Menus</h3>
            <p className="text-gray-600">
              Customers scan your QR code to view your menu instantly on their phones
            </p>
          </div>

          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-700 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Updates</h3>
            <p className="text-gray-600">
              Update your menu in real-time. Changes appear immediately for all customers
            </p>
          </div>

          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-700 mb-4">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Customizable</h3>
            <p className="text-gray-600">
              Add your logo, colors, and branding to match your business identity
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="mt-20">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2">Register</h4>
              <p className="text-gray-600 text-sm">Create your account in 2 minutes</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2">Add Menu Items</h4>
              <p className="text-gray-600 text-sm">Upload your dishes with photos and prices</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2">Download QR Code</h4>
              <p className="text-gray-600 text-sm">Get your unique QR code instantly</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h4 className="font-semibold mb-2">Start Serving</h4>
              <p className="text-gray-600 text-sm">Place QR codes on tables and start!</p>
            </div>
          </div>
        </section>

        {/* Everything you need section */}
        <section className="mt-20" id="pricing">
          <h3 className="text-3xl font-bold text-center mb-4">Simple pricing for every venue</h3>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10 text-sm sm:text-base">
            Start free while you set up your menus. When you are ready to host your guests, upgrade to unlock
            advanced features like automated WhatsApp ordering and M-Pesa checkout. No setup fees.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card border border-emerald-200">
              <h4 className="text-lg font-semibold mb-1">Starter</h4>
              <p className="text-sm text-gray-600 mb-4">Perfect for trying out digital menus.</p>
              <div className="text-2xl font-bold mb-1">Free</div>
              <p className="text-xs text-gray-500 mb-4">during early MVP</p>
              <ul className="text-sm text-gray-600 space-y-1 mb-6">
                <li>• Unlimited menu items & categories</li>
                <li>• QR code per venue</li>
                <li>• Basic WhatsApp contact button</li>
              </ul>
              <Link to="/register" className="btn-primary w-full inline-block text-center">
                Get started free
              </Link>
            </div>

            <div className="card border-2 border-emerald-500 shadow-md relative">
              <div className="absolute -top-3 right-4 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-semibold tracking-wide">
                MOST POPULAR
              </div>
              <h4 className="text-lg font-semibold mb-1">Pro</h4>
              <p className="text-sm text-gray-600 mb-4">For busy hotels, restaurants and lounges.</p>
              <div className="text-2xl font-bold mb-1">TBA</div>
              <p className="text-xs text-gray-500 mb-4">when we host the MVP</p>
              <ul className="text-sm text-gray-600 space-y-1 mb-6">
                <li>• Everything in Starter</li>
                <li>• WhatsApp API ordering flows</li>
                <li>• M-Pesa checkout support</li>
                <li>• Multiple menu types (pool, room, bar)</li>
                <li>• Priority support</li>
              </ul>
              <button className="btn-secondary w-full text-center" type="button">
                Talk to us on WhatsApp
              </button>
            </div>

            <div className="card border border-gray-200">
              <h4 className="text-lg font-semibold mb-1">Enterprise</h4>
              <p className="text-sm text-gray-600 mb-4">For hotel groups and chains.</p>
              <div className="text-2xl font-bold mb-1">Custom</div>
              <p className="text-xs text-gray-500 mb-4">per property</p>
              <ul className="text-sm text-gray-600 space-y-1 mb-6">
                <li>• Multi-property management</li>
                <li>• Custom integrations & reporting</li>
                <li>• Dedicated success manager</li>
              </ul>
              <a
                href="mailto:hello@mymenu.co.ke?subject=Enterprise%20digital%20menu%20enquiry"
                className="btn-secondary w-full inline-block text-center"
              >
                Request a demo
              </a>
            </div>
          </div>
        </section>

        {/* Trusted by brands */}
        <section className="mt-16 bg-white/70 rounded-2xl shadow-sm px-6 py-10">
          <h3 className="text-2xl font-bold text-center mb-6">Trusted by hospitality brands</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 items-center justify-items-center">
            <img
              src="/clients/Marriott_Logo.svg"
              alt="Marriott"
              className="h-10 w-auto object-contain opacity-90"
            />
            <img
              src="/clients/hilton-hotels.jpg"
              alt="Hilton Hotels"
              className="h-10 w-auto object-contain opacity-90"
            />
            <img
              src="/clients/Park_Inn_by_Radisson_logo.png"
              alt="Park Inn by Radisson"
              className="h-10 w-auto object-contain opacity-90"
            />
            <img
              src="/clients/images.png"
              alt="Restaurant partner"
              className="h-10 w-auto object-contain opacity-90"
            />
          </div>
        </section>

        {/* FAQs */}
        <section className="mt-16 max-w-3xl mx-auto" aria-label="Frequently asked questions">
          <h3 className="text-2xl font-bold text-center mb-6" id="faqs">FAQs</h3>
          <div className="space-y-4 text-left">
            <div className="card">
              <h4 className="font-semibold mb-1 text-sm sm:text-base">Do I need any hardware to start?</h4>
              <p className="text-gray-600 text-sm">
                No. You only need a phone or laptop to manage your menu and any device that can print QR codes for
                your tables, rooms or pool beds.
              </p>
            </div>
            <div className="card">
              <h4 className="font-semibold mb-1 text-sm sm:text-base">How will WhatsApp API and M-Pesa checkout work?</h4>
              <p className="text-gray-600 text-sm">
                For the MVP we start with a simple WhatsApp order flow. When we host your menu, we will connect a
                verified WhatsApp API number and M-Pesa checkout so guests can order and pay directly from their
                phones.
              </p>
            </div>
            <div className="card">
              <h4 className="font-semibold mb-1 text-sm sm:text-base">Can I have different menus for pool, rooms and bar?</h4>
              <p className="text-gray-600 text-sm">
                Yes. You can create multiple menu types (e.g. Poolside, Room Service, Bar) and assign unique QR codes
                to tables, floors and rooms while still managing everything from one dashboard.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 QR Menu Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

