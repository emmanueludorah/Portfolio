// Mobile nav toggle
const hamburger = document.querySelector('.hamburger');
const links = document.querySelector('.links');
hamburger.addEventListener('click', ()=>{
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', (!expanded).toString());
  links.classList.toggle('open');
});

// Smooth reveal on scroll
const revealEls = Array.from(document.querySelectorAll('.reveal'));
const io = new IntersectionObserver((entries)=>{
  for(const e of entries){ if(e.isIntersecting){ e.target.classList.add('revealed'); io.unobserve(e.target);} }
},{ threshold:.12 });
revealEls.forEach(el=> io.observe(el));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll for internal links
Array.from(document.querySelectorAll('a[href^="#"]')).forEach(a=>{
  a.addEventListener('click', (e)=>{
    const id = a.getAttribute('href');
    if(id.length > 1){
      const el = document.querySelector(id);
      if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); links.classList.remove('open'); hamburger.setAttribute('aria-expanded','false'); }
    }
  });
});

// Simple contact form validation + mock submit
const form = document.getElementById('contact-form');
const statusEl = document.querySelector('.form-status');
function setErr(input, msg){
  const field = input.closest('.field');
  field.querySelector('.error').textContent = msg || '';
  if(msg){ input.setAttribute('aria-invalid','true'); } else { input.removeAttribute('aria-invalid'); }
}
function isEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const whatsapp = document.getElementById('whatsapp');
  const message = document.getElementById('message');
  let ok = true;

  if(name.value.trim().length < 2){ setErr(name,'Please enter your name'); ok=false; } else setErr(name,'');
  if(!isEmail(email.value)){ setErr(email,'Please enter a valid email'); ok=false; } else setErr(email,'');
  if(!whatsapp.value.trim() || whatsapp.value.trim().length < 7){ setErr(whatsapp,'Please enter your WhatsApp number'); ok=false; } else setErr(whatsapp,'');
  if(message.value.trim().length < 10){ setErr(message,'Message should be at least 10 characters'); ok=false; } else setErr(message,'');
  if(!ok) return;

  statusEl.textContent = 'Sending…';

  try{
    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    });

    if(response.ok){
      statusEl.textContent = 'Thank you, your message was sent.';
      form.reset();
    }else{
      statusEl.textContent = 'Something went wrong. Please try again later.';
    }
  }catch(err){
    statusEl.textContent = 'Network error. Please check your connection and try again.';
  }
});

// Parallax tilt for hero card
const card3d = document.querySelector('.card3d');
if(card3d){
  card3d.addEventListener('mousemove', (e)=>{
    const r = card3d.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width/2)) / r.width;
    const y = (e.clientY - (r.top + r.height/2)) / r.height;
    card3d.style.transform = `perspective(1000px) rotateX(${y*-6}deg) rotateY(${x*6}deg)`;
  });
  card3d.addEventListener('mouseleave', ()=>{ card3d.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)'; });
}

// Looping typing effect for role under name
const roleTypingEl = document.getElementById('role-typing');
if(roleTypingEl){
  const text = 'Front-end Developer';
  let index = 0;
  let deleting = false;
  const typeSpeed = 95;      // typing speed (ms per char)
  const deleteSpeed = 55;    // deleting speed
  const holdTime = 1200;     // pause when full text is shown

  function tick(){
    if(!deleting){
      // typing forward
      index++;
      roleTypingEl.textContent = text.slice(0, index);

      if(index === text.length){
        deleting = true;
        setTimeout(tick, holdTime);
        return;
      }
      setTimeout(tick, typeSpeed);
    }else{
      // deleting backwards
      index--;
      roleTypingEl.textContent = text.slice(0, index);

      if(index === 0){
        deleting = false;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, deleteSpeed);
    }
  }

  setTimeout(tick, 500);
}
