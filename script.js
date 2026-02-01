 
    const navLinks = document.querySelectorAll('.sidebar nav a');
    const sections = Array.from(document.querySelectorAll('section'));

    function updateActiveLink(){
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
          current = section.id;
        }
      });
      navLinks.forEach(a => a.classList.remove('active'));
      if (current) {
        const activeLink = document.querySelector('.sidebar nav a[href="#' + current + '"]');
        if(activeLink) activeLink.classList.add('active');
      }
    }
    updateActiveLink();
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    window.addEventListener('load', () => setTimeout(updateActiveLink, 100));

    
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06 });

    document.querySelectorAll('section').forEach(s => io.observe(s));

   
    document.querySelectorAll('.sidebar nav a').forEach(a=>{
      a.addEventListener('click', (e)=>{
        e.preventDefault();
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if(!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
        navLinks.forEach(x => x.classList.remove('active'));
        a.classList.add('active');
      });
    });

    
    const toggle = document.getElementById('theme-toggle');

    function setToggleIcon(isDark) {
      toggle.textContent = isDark ? '☀️' : '🌙';
      toggle.setAttribute('aria-pressed', String(isDark));
    }

    
    (function initTheme(){
      const saved = localStorage.getItem('theme');
      if(saved === 'dark'){
        document.body.classList.add('dark');
        setToggleIcon(true);
      } else if(saved === 'light') {
        document.body.classList.remove('dark');
        setToggleIcon(false);
      } else {
      
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if(prefersDark){
          document.body.classList.add('dark');
          setToggleIcon(true);
        } else {
          document.body.classList.remove('dark');
          setToggleIcon(false);
        }
      }
    })();

    toggle.addEventListener('click', ()=>{
      const isDark = document.body.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      setToggleIcon(isDark);
      
      announceThemeChange(isDark ? 'Dark mode enabled' : 'Light mode enabled');
    });

    
    function announceThemeChange(message) {
      let el = document.getElementById('a11y-live');
      if(!el) {
        el = document.createElement('div');
        el.id = 'a11y-live';
        el.setAttribute('aria-live', 'polite');
        el.setAttribute('role', 'status');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.top = 'auto';
        document.body.appendChild(el);
      }
      el.textContent = message;
    }
    
    window.addEventListener('keydown', (e) => {
      if (e.key && e.key.toLowerCase() === '') {
        toggle.click();
      }
    });

    
    const aboutMeSection = document.getElementById('aboutme');
    const projectCountElement = document.getElementById('project-count');

    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(1, 10, 2000); 
        }
      });
    }, { threshold: 0.5 });

    countObserver.observe(aboutMeSection);

    function animateCount(start, end, duration) {
      const startTime = performance.now();
      const difference = end - start;

      function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(start + difference * progress);
        projectCountElement.textContent = currentValue;

      }
      requestAnimationFrame(updateCount);
    }