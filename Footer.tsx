import React from 'react';
import { Cake, Sparkles, Heart, MapPin, Clock, Phone, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveScreen, setIsAssistantOpen } = useApp();

  return (
    <footer className="bg-[#2B2321] text-[#E8DDD8] pt-16 pb-12 border-t border-[#3D312E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#3D312E] flex items-center justify-center text-[#E3C4C1]">
                <Cake className="w-5 h-5" />
              </div>
              <span className="font-serif-display text-2xl font-bold text-white">
                SweetSpot
              </span>
            </div>
            <p className="text-xs text-[#A89893] leading-relaxed">
              Handcrafting artisanal pastries, signature cakes, and delicate macarons daily with organic locally-sourced ingredients.
            </p>
          </div>

          {/* Bakery Hours & Location */}
          <div className="space-y-3">
            <h4 className="font-serif-display font-bold text-base text-white">Boutique Hours</h4>
            <div className="text-xs text-[#A89893] space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C28B87]" />
                <span>Mon – Sat: 7:00 AM – 8:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C28B87]" />
                <span>Sunday: 8:00 AM – 6:00 PM</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#C28B87]" />
                <span>742 Evergreen Terrace, Bakery District</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif-display font-bold text-base text-white">Explore</h4>
            <ul className="text-xs text-[#A89893] space-y-2">
              <li>
                <button onClick={() => setActiveScreen('home')} className="hover:text-white transition-colors cursor-pointer">
                  Chef's Signature Cakes
                </button>
              </li>
              <li>
                <button onClick={() => setActiveScreen('products')} className="hover:text-white transition-colors cursor-pointer">
                  Artisanal Collection
                </button>
              </li>
              <li>
                <button onClick={() => setActiveScreen('cart')} className="hover:text-white transition-colors cursor-pointer">
                  Your Basket
                </button>
              </li>
              <li>
                <button onClick={() => setIsAssistantOpen(true)} className="hover:text-[#E3C4C1] transition-colors cursor-pointer flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#E3C4C1]" />
                  <span>AI Pastry Concierge</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="space-y-3">
            <h4 className="font-serif-display font-bold text-base text-white">Sweet Club</h4>
            <p className="text-xs text-[#A89893]">
              Subscribe for secret seasonal releases, chef recipes, and 10% off your first custom order.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full px-3 py-2 bg-[#3D312E] text-xs text-white placeholder-[#8A7973] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C28B87]"
              />
              <button
                onClick={() => alert("Thank you for joining the SweetSpot family!")}
                className="px-4 py-2 bg-[#7A6360] hover:bg-[#C28B87] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Join
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#3D312E] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A7973] gap-4">
          <p>© 2026 SweetSpot Artisanal Confectionery. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[#8A7973]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#C25B5B] fill-[#C25B5B]" />
            <span>for pastry lovers everywhere</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
