'use client';

import { useState, useCallback } from 'react';
import type { FAQItem, FAQCategory } from '@/lib/faq-data';

/* ─────────────────────────────────────────────
   Single accordion item
   ───────────────────────────────────────────── */

function AccordionItem({
  faq,
  isOpen,
  onToggle,
  index,
}: {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div
      className="group relative"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Left accent bar — visible when open */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-[2px] rounded-full transition-all duration-300 ${
          isOpen
            ? 'bg-profit opacity-100'
            : 'bg-transparent opacity-0 group-hover:bg-profit/30 group-hover:opacity-100'
        }`}
      />

      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 pl-4 pr-1 text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <span
          className={`text-[15px] font-medium leading-snug transition-colors duration-200 ${
            isOpen
              ? 'text-profit'
              : 'text-terminal-text group-hover:text-profit/80'
          }`}
        >
          {faq.question}
        </span>

        {/* Toggle indicator */}
        <span
          className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-sm font-mono transition-all duration-300 mt-0.5 ${
            isOpen
              ? 'bg-profit/10 text-profit rotate-45'
              : 'bg-terminal-card-hover text-terminal-muted group-hover:text-profit/60'
          }`}
        >
          +
        </span>
      </button>

      {/* Expandable content — CSS grid trick for smooth height animation */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="pl-4 pr-8 pb-5 text-sm text-terminal-muted leading-relaxed">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Accordion: renders a flat list of FAQ items
   ───────────────────────────────────────────── */

export function FAQAccordion({
  faqs,
  allowMultiple = false,
}: {
  faqs: FAQItem[];
  allowMultiple?: boolean;
}) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  const toggle = useCallback(
    (index: number) => {
      setOpenIndices((prev) => {
        const next = new Set(allowMultiple ? prev : []);
        if (prev.has(index)) {
          next.delete(index);
        } else {
          next.add(index);
        }
        return next;
      });
    },
    [allowMultiple]
  );

  return (
    <div className="divide-y divide-terminal-border/60 border-y border-terminal-border/60">
      {faqs.map((faq, i) => (
        <AccordionItem
          key={i}
          faq={faq}
          isOpen={openIndices.has(i)}
          onToggle={() => toggle(i)}
          index={i}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Categorized FAQ: renders categories with
   section headers (used on the full FAQ page)
   ───────────────────────────────────────────── */

export function FAQCategorized({
  categories,
}: {
  categories: FAQCategory[];
}) {
  // Each category manages its own open state independently
  return (
    <div className="space-y-14">
      {categories.map((cat, catIndex) => (
        <div key={catIndex}>
          {/* Category header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-mono font-semibold tracking-widest uppercase text-profit">
              {cat.category}
            </span>
            <div className="flex-1 h-px bg-profit/15" />
          </div>

          <FAQAccordion faqs={cat.faqs} allowMultiple />
        </div>
      ))}
    </div>
  );
}
