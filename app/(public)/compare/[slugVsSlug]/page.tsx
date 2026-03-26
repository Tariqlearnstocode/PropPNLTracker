// This route has been moved to /[slug1]-vs-[slug2] (e.g. /topstep-vs-lucid-trading)
// This file is intentionally a redirect to prevent the old route from rendering.
import { notFound } from 'next/navigation';
export default function DeprecatedComparisonPage() {
  notFound();
}
