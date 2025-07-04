"use client";

import Link from "next/link";
import { useWebsiteConfig } from "@/features/websiteConfig/configApiSlice";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import FaviconSetter from "./faviconSetter";

const Footer = () => {
  const { config, loading } = useWebsiteConfig();
  const { favicon, contactInfo, socialMedia, metaTags } = config;
  const currentYear = new Date().getFullYear();
  const faviconUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}${favicon}`;

  // Quick links for navigation
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Donate Blood", href: "/donate" },
    { name: "Request Blood", href: "/request" },
    { name: "Events", href: "/events" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="bg-primary text-white text-center sm:text-start">
      <FaviconSetter faviconUrl={faviconUrl} />
      <div className="container mx-auto px-4 py-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About section */}
          <div>
            <h3 className="text-xl font-bold mb-4">About BloodCellBD</h3>
            <p className="text-text-secondary mb-4">
              {loading ? "Loading..." : metaTags.description}
            </p>
            <p className="text-text-secondary">
              Our mission is to save lives by making blood donation accessible
              to everyone in Bangladesh.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-white transition duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            {loading ? (
              <p className="text-text-secondary">
                Loading contact information...
              </p>
            ) : (
              <div className="space-y-3 flex flex-col items-center sm:items-start">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-neutral-300" />
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-text-secondary hover:text-white transition duration-300"
                  >
                    {contactInfo.email}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-neutral-300" />
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-text-secondary hover:text-white transition duration-300"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-neutral-300" />
                  <span className="text-text-secondary">
                    {contactInfo.address}
                  </span>
                </div>

                {/* Social Media Icons */}
                <div className="flex space-x-4 mt-4 social-icons justify-center sm:justify-start">
                  {socialMedia.facebook && (
                    <a
                      href={socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-white"
                      aria-label="Facebook"
                    >
                      <FaFacebook size={18} />
                    </a>
                  )}
                  {socialMedia.instagram && (
                    <a
                      href={socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-white"
                      aria-label="Instagram"
                    >
                      <FaInstagram size={18} />
                    </a>
                  )}
                  {socialMedia.linkedin && (
                    <a
                      href={socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-white"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedin size={18} />
                    </a>
                  )}
                  {socialMedia.youtube && (
                    <a
                      href={socialMedia.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-white"
                      aria-label="YouTube"
                    >
                      <FaYoutube size={18} />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar with copyright */}
        <div className="border-t border-primary-dark pt-6 mt-8 text-center">
          <p className="text-text-secondary">
            &copy; {currentYear} BloodCellBD. All rights reserved.
          </p>
          <div className="mt-2 text-sm text-text-secondary">
            <Link
              href="/privacy-policy"
              className="hover:text-white transition duration-300 mr-4"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-white transition duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
