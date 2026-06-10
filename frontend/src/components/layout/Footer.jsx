import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi';

const Footer = () => (
  <footer className="bg-brand text-white mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        <div className="col-span-2 md:col-span-1">
          <div className="font-display text-2xl mb-3">Lux<span className="text-accent">ora</span></div>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">Premium e-commerce for the modern shopper. Curated selections, fast delivery, easy returns.</p>
          <div className="flex gap-3 mt-5">
            {[FiInstagram, FiFacebook, FiTwitter, FiYoutube].map((Icon, i) => (
              <button key={i} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-accent hover:border-accent transition-colors">
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>
        {[
          { title: 'Shop', links: [['All Products','/products'],['Electronics','/products?category=Electronics'],['Fashion','/products?category=Fashion'],['Sports','/products?category=Sports']] },
          { title: 'Support', links: [['Help Center','#'],['Shipping Info','#'],['Returns','#'],['Track Order','/orders']] },
          { title: 'Company', links: [['About Us','#'],['Careers','#'],['Press','#'],['Contact','#']] },
        ].map(({ title, links }) => (
          <div key={title}>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">{title}</h4>
            <ul className="space-y-2">
              {links.map(([label, to]) => (
                <li key={label}><Link to={to} className="text-sm text-white/45 hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/30">
        <p>© {new Date().getFullYear()} Luxora. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
