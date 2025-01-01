"use client"; // Add this line at the very top

import React, { useState } from "react";

const faqData = [
  {
    question: "What is BARK?",
    answer:
      "BARK is a platform designed for creators to receive donations, sell products, and offer memberships to their supporters, all in one place.",
  },
  {
    question: "How does BARK work?",
    answer:
      "With BARK, fans can easily support their favorite creators by sending tips, purchasing products, or subscribing to membership tiers for ongoing support.",
  },
  {
    question: "Does BARK charge fees?",
    answer:
      "BARK offers a free plan with no platform fees on donations. For additional features, you can upgrade to BARK Gold for a small subscription fee.",
  },
  {
    question: "Is BARK suitable for new creators?",
    answer:
      "Absolutely! Whether you're just starting out or already have a following, BARK is a great platform to help you grow and engage with your community.",
  },
  {
    question: "How do I get paid on BARK?",
    answer:
      "Creators get paid directly through Solana Blinks, ensuring fast and secure payments with no delays.",
  },
  {
    question: "How is BARK different from Patreon?",
    answer:
      "Unlike Patreon, BARK doesn't take a percentage of donations on the free plan, making it easier for creators to keep more of their earnings. It also offers a simpler way for fans to make one-time donations.",
  },
];

export default function ContentSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <section className="py-10 bg-white text-center">
      <div className="separator"></div>
      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mt-2">
        <h2 className="text-3xl font-bold mb-6 text-sand">FAQ</h2>
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden transition-all duration-300"
            >
              <button
                role="button"
                aria-expanded={activeIndex === index ? "true" : "false"}
                aria-controls={`faq-answer-${index}`}
                className={`w-full text-left text-lg font-semibold py-4 px-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white flex justify-between items-center hover:text-black hover:scale-95 active:scale-90 transition-all duration-300 ${
                  activeIndex === index ? "rounded-t-lg" : "rounded-lg"
                }`}
                onClick={() => toggleFAQ(index)}
              >
                <span className="hover:text-black">{item.question}</span>
                <span className="text-2xl hover:text-black">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </button>
              <div
                id={`faq-answer-${index}`}
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  activeIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {activeIndex === index && (
                  <div className="bg-gray-100 p-6 text-gray-800 hover:scale-95 active:scale-90 transition-all duration-300 text-sm">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
