import React from 'react';
import { Phone } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { siteConfig } from '../config/siteConfig';

export function StickyContactBar() {
  return (
    <>
      <div className="sticky-bar">
        {/* WhatsApp Floating Action Button */}
        <a
          href={siteConfig.getGeneralWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-btn floating-wa"
          title="WhatsApp Danışma Hattı"
        >
          <WhatsAppIcon size={22} />
        </a>

        {/* Phone Call Floating Action Button */}
        <a
          href={`tel:${siteConfig.phoneRaw}`}
          className="floating-btn floating-phone"
          title="Telefon ile Müşteri Hizmetleri"
        >
          <Phone size={20} />
        </a>
      </div>

      <style>{`
        .sticky-bar {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 99;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .floating-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          color: #FFF;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          cursor: pointer;
        }
        .floating-btn:hover {
          transform: scale(1.1);
        }
        .floating-wa {
          background-color: #25D366;
          box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4);
        }
        .floating-phone {
          background-color: #0284C7;
          box-shadow: 0 4px 16px rgba(2, 132, 199, 0.4);
        }

        @media (max-width: 640px) {
          .sticky-bar {
            bottom: 12px;
            right: 12px;
            gap: 0.5rem;
          }
          .floating-btn {
            width: 42px;
            height: 42px;
          }
          .floating-btn svg {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
    </>
  );
}
