// This route has been moved to /[slug]-alternatives (e.g. /topstep-alternatives)
// This file is intentionally empty to prevent the old route from rendering.
import { notFound } from 'next/navigation';
export default function DeprecatedAlternativesPage() {
  notFound();
}
