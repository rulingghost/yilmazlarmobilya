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
          <WhatsAppIcon size={28} />
        </a>

        {/* Phone Call Floating Action Button */}
        <a
          href={`tel:${siteConfig.phoneRaw}`}
          className="floating-btn floating-phone"
          title="Telefon ile Müşteri Hizmetleri"
        >
          <Phone size={26} />
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
          gap: 0.75rem;
        }
        .floating-btn {
          width: 54px;
          height: 54px;
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
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
        }
        .floating-phone {
          background-color: #0284C7;
          box-shadow: 0 6px 20px rgba(2, 132, 199, 0.4);
        }

        @media (max-width: 640px) {
          .sticky-bar {
            bottom: 14px;
            right: 14px;
            gap: 0.6rem;
          }
          .floating-btn {
            width: 48px;
            height: 48px;
          }
          .floating-btn svg {
            width: 22px;
            height: 22px;
          }
        }
      `}</style>
    </>
  );
}
