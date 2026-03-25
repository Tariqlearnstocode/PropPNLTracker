-- Fix Aqua Futures logo URL: was using mobile icon, now using full brand logo
UPDATE public.firms
SET logo_url = 'https://cdn.prod.website-files.com/691ed7af34e4c830258867d3/691ed7af34e4c830258867ed_49148b27e841c9f14ff5b8156505eb73_Brand%20TypeWhite.svg'
WHERE slug = 'aqua-futures';
