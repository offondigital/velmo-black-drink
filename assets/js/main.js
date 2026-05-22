/* ============================================
   VELMO BLACK - JAVASCRIPT COMPLETO
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // 1. PARTÍCULAS DO HERO
    // ==========================================
    (function() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.opacitySpeed = (Math.random() - 0.5) * 0.01;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.opacity += this.opacitySpeed;
                if (this.opacity <= 0.05 || this.opacity >= 0.5) this.opacitySpeed *= -1;
                if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        function createParticles(count) {
            particles = [];
            for (let i = 0; i < count; i++) particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 * (1 - distance / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }

        resizeCanvas();
        createParticles(100);
        animate();
        window.addEventListener('resize', () => { resizeCanvas(); createParticles(100); });
    })();

    // ==========================================
    // 2. PRODUTO 3D (THREE.JS)
    // ==========================================
    (function() {
        const container = document.getElementById('productCanvas');
        const parentContainer = document.getElementById('product3D');
        if (!container || !parentContainer || typeof THREE === 'undefined') return;

        const width = parentContainer.clientWidth;
        const height = parentContainer.clientHeight;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 5;
        const renderer = new THREE.WebGLRenderer({ canvas: container, alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const ambientLight = new THREE.AmbientLight(0x222244, 1.5);
        scene.add(ambientLight);
        const mainLight = new THREE.DirectionalLight(0x00F0FF, 2);
        mainLight.position.set(5, 5, 5);
        scene.add(mainLight);

        const productGroup = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 2.5, 32), new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.3, roughness: 0.2, clearcoat: 0.5, clearcoatRoughness: 0.2 }));
        productGroup.add(body);
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.48, 0.4, 32), new THREE.MeshPhysicalMaterial({ color: 0x00F0FF, metalness: 0.5, roughness: 0.1, emissive: 0x00F0FF, emissiveIntensity: 0.5 }));
        cap.position.y = 1.45;
        productGroup.add(cap);
        const band = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.05, 16, 32), new THREE.MeshStandardMaterial({ color: 0x00F0FF, metalness: 0.8, roughness: 0.2, emissive: 0x00F0FF, emissiveIntensity: 0.8 }));
        band.position.y = 0.5;
        band.rotation.x = Math.PI / 2;
        productGroup.add(band);

        const orbitParticles = new THREE.Group();
        for (let i = 0; i < 40; i++) {
            const particle = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00F0FF }));
            const angle = (i / 40) * Math.PI * 2;
            particle.position.set(Math.cos(angle) * 1.2, (Math.random() - 0.5) * 3, Math.sin(angle) * 1.2);
            orbitParticles.add(particle);
        }
        productGroup.add(orbitParticles);
        scene.add(productGroup);

        let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
        document.addEventListener('mousemove', (e) => { mouseX = (e.clientX / window.innerWidth) * 2 - 1; mouseY = -(e.clientY / window.innerHeight) * 2 + 1; });
        document.addEventListener('touchmove', (e) => { mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1; mouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1; }, { passive: true });

        function animate3D() {
            requestAnimationFrame(animate3D);
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;
            productGroup.rotation.y += 0.005;
            productGroup.rotation.x += (targetY * 0.3 - productGroup.rotation.x) * 0.05;
            productGroup.rotation.y += (targetX * 0.5 - productGroup.rotation.y) * 0.05;
            orbitParticles.rotation.y += 0.01;
            orbitParticles.rotation.x += 0.005;
            renderer.render(scene, camera);
        }
        animate3D();

        window.addEventListener('resize', () => {
            const newWidth = parentContainer.clientWidth;
            const newHeight = parentContainer.clientHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        });
    })();

    // ==========================================
    // 3. EFEITO TILT NOS CARDS
    // ==========================================
    function initTilt() {
        document.querySelectorAll('[data-tilt]').forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = (y - rect.height / 2) / (rect.height / 2) * -8;
                const rotateY = (x - rect.width / 2) / (rect.width / 2) * 8;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            card.addEventListener('mouseleave', function() {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }
    initTilt();

    // ==========================================
    // 4. CRONÔMETRO DE URGÊNCIA
    // ==========================================
    (function() {
        const endTime = new Date();
        endTime.setHours(endTime.getHours() + 2);
        endTime.setMinutes(endTime.getMinutes() + 9);
        endTime.setSeconds(endTime.getSeconds() + 9);
        const totalSeconds = 2 * 3600 + 9 * 60 + 9;

        function updateCountdown() {
            const now = new Date();
            let diff = Math.floor((endTime - now) / 1000);
            if (diff <= 0) { endTime.setHours(now.getHours() + 2); endTime.setMinutes(now.getMinutes() + 9); endTime.setSeconds(now.getSeconds() + 9); diff = Math.floor((endTime - now) / 1000); }
            document.getElementById('countdownHours').textContent = String(Math.floor(diff / 3600)).padStart(2, '0');
            document.getElementById('countdownMinutes').textContent = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
            document.getElementById('countdownSeconds').textContent = String(diff % 60).padStart(2, '0');
            const progressFill = document.getElementById('urgencyFill');
            if (progressFill) progressFill.style.width = Math.min(((totalSeconds - diff) / totalSeconds) * 100, 100) + '%';
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);
    })();

    // ==========================================
    // 5. CONTADOR DE UNIDADES RESTANTES
    // ==========================================
    (function() {
        const counterElement = document.getElementById('remainingUnits');
        if (!counterElement) return;
        const numberEl = counterElement.querySelector('.counter-number');
        let remaining = 47;
        function decreaseRandomly() {
            if (remaining > 3) { remaining -= Math.floor(Math.random() * 3) + 1; }
            else { remaining = Math.floor(Math.random() * 20) + 10; }
            numberEl.textContent = remaining;
            setTimeout(decreaseRandomly, Math.floor(Math.random() * 60000) + 30000);
        }
        setTimeout(decreaseRandomly, 45000);
    })();

    // ==========================================
    // 6. ABAS DE SABOR (DRINK)
    // ==========================================
    (function() {
        document.querySelectorAll('.flavor-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const flavor = this.getAttribute('data-flavor');
                document.querySelectorAll('.flavor-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.flavor-panel').forEach(p => p.classList.remove('active'));
                this.classList.add('active');
                document.getElementById('panel' + flavor.charAt(0).toUpperCase() + flavor.slice(1)).classList.add('active');
            });
        });
    })();

    // ==========================================
    // 7. SLIDER ANTES/DEPOIS
    // ==========================================
    function initBeforeAfterSlider(dividerId) {
        const divider = document.getElementById(dividerId);
        if (!divider) return;
        const container = divider.parentElement;
        const afterImage = container.querySelector('.ba-image-after');
        let isDragging = false;

        function updateSlider(clientX) {
            const rect = container.getBoundingClientRect();
            let percent = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
            divider.style.left = percent + '%';
            afterImage.style.clipPath = `inset(0 0 0 ${percent}%)`;
        }
        divider.addEventListener('mousedown', (e) => { isDragging = true; e.preventDefault(); });
        container.addEventListener('mousemove', (e) => { if (!isDragging) return; updateSlider(e.clientX); });
        document.addEventListener('mouseup', () => { isDragging = false; });
        divider.addEventListener('touchstart', (e) => { isDragging = true; e.preventDefault(); });
        container.addEventListener('touchmove', (e) => { if (!isDragging) return; updateSlider(e.touches[0].clientX); });
        document.addEventListener('touchend', () => { isDragging = false; });
        container.addEventListener('mousemove', (e) => {
            if (isDragging) return;
            const rect = container.getBoundingClientRect();
            let percent = Math.max(10, Math.min(90, ((e.clientX - rect.left) / rect.width) * 100));
            divider.style.transition = 'left 0.3s ease-out';
            divider.style.left = percent + '%';
            afterImage.style.clipPath = `inset(0 0 0 ${percent}%)`;
        });
    }
    initBeforeAfterSlider('baDivider1');
    initBeforeAfterSlider('baDivider2');

    // ==========================================
    // 8. VÍDEO DEPOIMENTOS (MODAL SIMULADO)
    // ==========================================
    document.querySelectorAll('.video-thumbnail').forEach(card => {
        card.addEventListener('click', function() {
            const modal = document.createElement('div');
            modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:pointer;';
            const content = document.createElement('div');
            content.style.cssText = 'text-align:center;color:white;max-width:600px;padding:40px;';
            content.innerHTML = '<div style="font-size:80px;margin-bottom:20px;">🎬</div><h3 style="font-size:24px;margin-bottom:12px;color:#00F0FF;">Depoimento Real</h3><p style="color:#CCC;">Configure aqui o embed do YouTube/Vimeo.</p><p style="color:#666;margin-top:20px;">Clique para fechar</p>';
            modal.appendChild(content);
            document.body.appendChild(modal);
            modal.addEventListener('click', () => modal.remove());
        });
    });

    // ==========================================
    // 9. LINHA DO TEMPO (INTERSECTION OBSERVER)
    // ==========================================
    (function() {
        const steps = document.querySelectorAll('.timeline-step');
        const progressBar = document.getElementById('timelineProgress');
        let activatedSteps = new Set();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const step = entry.target;
                    step.classList.add('active');
                    activatedSteps.add(parseInt(step.getAttribute('data-step')));
                    if (progressBar) progressBar.style.width = ((Math.max(...activatedSteps) - 1) / (steps.length - 1)) * 100 + '%';
                }
            });
        }, { threshold: 0.4 });
        steps.forEach(step => observer.observe(step));
    })();

    // ==========================================
    // 10. GRÁFICO DE EFICÁCIA
    // ==========================================
    (function() {
        const canvas = document.getElementById('efficacyChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationProgress = 0;
        const labels = ['Queima de\nGordura', 'Controle de\nApetite', 'Redução de\nMedidas', 'Celulite e\nEstrias', 'Disposição\ne Energia'];
        const velmoData = [97, 85, 92, 88, 95];
        const conventionalData = [45, 40, 38, 25, 50];

        function resize() { const rect = canvas.parentElement.getBoundingClientRect(); canvas.width = rect.width; canvas.height = 300; }
        resize();
        window.addEventListener('resize', resize);
        const observer = new IntersectionObserver((entries) => { if (entries[0].isIntersecting) { animateChart(); observer.unobserve(canvas); } }, { threshold: 0.3 });
        observer.observe(canvas);

        function animateChart() {
            if (animationProgress < 1) animationProgress += 0.02;
            const w = canvas.width, h = canvas.height;
            const padding = { top: 30, right: 30, bottom: 50, left: 40 };
            const chartW = w - padding.left - padding.right;
            const chartH = h - padding.top - padding.bottom;
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i <= 5; i++) {
                const y = padding.top + (chartH / 5) * i;
                ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(w - padding.right, y);
                ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.stroke();
            }
            labels.forEach((label, i) => {
                const x = padding.left + (chartW / labels.length) * i + (chartW / labels.length) / 2;
                const convH = (conventionalData[i] / 100) * chartH * animationProgress;
                ctx.fillStyle = '#444';
                ctx.fillRect(x - (chartW / labels.length * 0.15) - (chartW / labels.length * 0.1), padding.top + chartH - convH, chartW / labels.length * 0.3, convH);
                const velmoH = (velmoData[i] / 100) * chartH * animationProgress;
                const velmoX = x + (chartW / labels.length * 0.1);
                const velmoY = padding.top + chartH - velmoH;
                const gradient = ctx.createLinearGradient(velmoX, velmoY, velmoX, padding.top + chartH);
                gradient.addColorStop(0, '#00F0FF'); gradient.addColorStop(1, '#008080');
                ctx.fillStyle = gradient;
                ctx.fillRect(velmoX, velmoY, chartW / labels.length * 0.3, velmoH);
                ctx.fillStyle = '#FFF'; ctx.font = 'bold 11px Sora, sans-serif'; ctx.textAlign = 'center';
                ctx.fillText(velmoData[i] + '%', velmoX + (chartW / labels.length * 0.15), velmoY - 6);
                ctx.fillStyle = '#999'; ctx.font = '10px Sora, sans-serif';
                label.split('\n').forEach((line, li) => ctx.fillText(line, x, padding.top + chartH + 16 + li * 14));
            });
            if (animationProgress < 1) requestAnimationFrame(animateChart);
        }
    })();

    // ==========================================
    // 11. NEWSLETTER
    // ==========================================
    document.getElementById('newsletterForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const input = this.querySelector('.newsletter-input');
        const btn = this.querySelector('.newsletter-btn');
        const success = document.getElementById('newsletterSuccess');
        if (input.value && input.value.includes('@')) {
            input.disabled = true; btn.disabled = true;
            setTimeout(() => {
                success.style.display = 'block'; input.value = ''; input.disabled = false; btn.disabled = false;
                setTimeout(() => success.style.display = 'none', 5000);
            }, 800);
        }
    });

    // ==========================================
    // 12. ÍCONES DE INGREDIENTES (CANVAS)
    // ==========================================
    function drawMoleculeIcon(canvasId, count) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height, cx = w/2, cy = h/2;
        let time = 0;
        function animate() {
            time += 0.02; ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2 + time, radius = 18 + Math.sin(time * 2 + i) * 3;
                const x = cx + Math.cos(angle) * radius, y = cy + Math.sin(angle) * radius;
                for (let j = i + 1; j < count; j++) {
                    const aJ = (j / count) * Math.PI * 2 + time, rJ = 18 + Math.sin(time * 2 + j) * 3;
                    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(cx + Math.cos(aJ) * rJ, cy + Math.sin(aJ) * rJ);
                    ctx.strokeStyle = 'rgba(0,240,255,0.15)'; ctx.lineWidth = 0.5; ctx.stroke();
                }
                ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,240,255,0.8)'; ctx.fill();
            }
            ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,240,255,0.6)'; ctx.fill();
            requestAnimationFrame(animate);
        }
        animate();
    }
    ['canvasCafeina','canvasPsyllium','canvasCromo','canvasColageno','canvasVitaminaD'].forEach(id => drawMoleculeIcon(id, 6));

    // ==========================================
    // 13. INTERAÇÃO COM NODES DE INGREDIENTES
    // ==========================================
    document.querySelectorAll('.ingredient-node').forEach(node => {
        node.addEventListener('click', function() {
            document.querySelectorAll('.ingredient-node').forEach(n => { n.style.opacity = '0.5'; n.style.transform = 'scale(1)'; });
            this.style.opacity = '1'; this.style.transform = 'scale(1.1)';
            setTimeout(() => document.querySelectorAll('.ingredient-node').forEach(n => { n.style.opacity = '1'; n.style.transform = 'scale(1)'; }), 2000);
        });
    });

});