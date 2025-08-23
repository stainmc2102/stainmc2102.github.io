(function(){
  const canvas = document.getElementById('matrix');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = canvas.width = innerWidth;
  let height = canvas.height = innerHeight;
  const letters = '01あいうえおかきくけこさしすせそたちつてとABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>/{}[]#@*+-=%$';
  let fontSize = Math.max(12, Math.floor(Math.min(width, height) / 48));
  let columns = Math.floor(width / fontSize);
  let drops = new Array(columns).fill(1);

  function draw(){
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0, 0, width, height);
    ctx.font = fontSize + "px 'JetBrains Mono', monospace";
    for(let i=0;i<columns;i++){
      const text = letters.charAt(Math.floor(Math.random() * letters.length));
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillStyle = "rgba(0,255,168,0.95)";
      ctx.fillText(text, x, y);
      ctx.fillStyle = "rgba(0,255,168,0.18)";
      ctx.fillText(text, x, y - fontSize);
      if(y > height && Math.random() > 0.975){ drops[i] = 0; }
      drops[i]++;
    }
  }
  let raf;
  (function loop(){ draw(); raf = requestAnimationFrame(loop); })();

  addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    width = canvas.width = innerWidth;
    height = canvas.height = innerHeight;
    fontSize = Math.max(12, Math.floor(Math.min(width, height) / 48));
    columns = Math.floor(width / fontSize);
    drops = new Array(columns).fill(1);
    (function loop(){ draw(); raf = requestAnimationFrame(loop); })();
  });
})();

(function(){
  const path = (window.__ACTIVE_PAGE__) || location.pathname.split('/').pop() || 'home.html';
  document.querySelectorAll('nav.topbar a').forEach(a=>{
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === path);
  });
})();

(function(){
  const el = document.getElementById('year');
  if(el) el.textContent = new Date().getFullYear();
})();