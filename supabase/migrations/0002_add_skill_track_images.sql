alter table public.skill_tracks
  add column if not exists image_url text;

update public.skill_tracks set image_url = case slug
  when 'web-development' then 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
  when 'python-programming' then 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80'
  when 'data-analysis' then 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
  when 'artificial-intelligence-machine-learning' then 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80'
  when 'cybersecurity' then 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80'
  when 'cloud-devops' then 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
  when 'mobile-development' then 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80'
  when 'ui-ux-design' then 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80'
  when 'blockchain-web3' then 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1200&q=80'
  when 'database-sql' then 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'
  when 'software-testing-qa' then 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'
  when 'programming-fundamentals' then 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'
  when 'digital-productivity' then 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80'
  when 'digital-marketing' then 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80'
end
where slug in (
  'web-development','python-programming','data-analysis','artificial-intelligence-machine-learning',
  'cybersecurity','cloud-devops','mobile-development','ui-ux-design','blockchain-web3',
  'database-sql','software-testing-qa','programming-fundamentals','digital-productivity','digital-marketing'
);