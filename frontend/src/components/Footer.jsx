import React from 'react'
import { Link } from 'react-router-dom'
import {
  FaFacebook,
  FaTwitterSquare,
  FaInstagram,
  FaPinterest
} from 'react-icons/fa'

function Footer() {
  return (
    <footer className="bg-[#050b14] text-gray-300 py-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4">

        {/* TOP SECTION */}
        <div className="grid md:grid-cols-4 gap-8">

          {/* BRAND */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              Elect<span className="text-cyan-400">Ecommerce</span>
            </h2>

            <p className="text-sm text-gray-400 leading-6">
              Your one-stop shop for the latest electronics at the best prices.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white font-semibold mb-3">
              Quick Links
            </h3>

            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/products"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Shop
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="hover:text-cyan-400 transition-colors"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-white font-semibold mb-3">
              Support
            </h3>

            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/help"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Help Center
                </Link>
              </li>

              <li>
                <Link
                  to="/returns"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Returns
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="text-white font-semibold mb-3">
              Follow Us
            </h3>

            <div className="flex gap-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-3xl hover:text-cyan-400 transition-colors"
              >
                <FaFacebook />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="text-3xl hover:text-cyan-400 transition-colors"
              >
                <FaTwitterSquare />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="text-3xl hover:text-cyan-400 transition-colors"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                aria-label="Pinterest"
                className="text-3xl hover:text-cyan-400 transition-colors"
              >
                <FaPinterest />
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ElectEcommerce. All rights reserved.
        </div>

      </div>
    </footer>
  )
}

export default Footer