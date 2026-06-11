        const canvas = document.getElementById('star-canvas');
        const ctx = canvas.getContext('2d');
        let stars = [];
        const maxStars = 45;

        class Star {
            constructor() {
                this.reset();
                this.alpha = Math.random(); 
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.blinkSpeed = Math.random() * 0.015 + 0.005;
                this.alpha = 0;
                this.factor = 1;
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = '#f0a7c5';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            update() {
                this.alpha += this.blinkSpeed * this.factor;
                if(this.alpha > 1) {
                    this.alpha = 1;
                    this.factor = -1;
                } else if(this.alpha < 0) {
                    this.alpha = 0;
                    this.factor = 1;
                    if(Math.random() > 0.8) {
                        this.x = Math.random() * canvas.width;
                        this.y = Math.random() * canvas.height;
                    }
                }
            }
        }

        function initStars() {
            stars = [];
            for(let i=0; i<maxStars; i++) stars.push(new Star());
        }

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars(); 
        }
        
        window.addEventListener('resize', resize);
        resize();

        function loop() {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            stars.forEach(s => { s.update(); s.draw(); });
            requestAnimationFrame(loop);
        }
        loop();

        const entryScreen = document.getElementById('entry-screen');
        const storyFlow = document.getElementById('story-flow');
        const audioWidget = document.getElementById('audio-widget');
        const audioCore = document.getElementById('audio-core');
        const playBtn = document.getElementById('play-btn');
        const waveVisual = document.getElementById('wave-visual');

        const svgPlay = '<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>';
        const svgPause = '<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

        function unsealDocument() {
            entryScreen.classList.add('open');
            setTimeout(() => {
                storyFlow.classList.add('visible');
                audioWidget.classList.add('active');

                audioCore.volume = 0.2;

                audioCore.play().then(() => {
                    playBtn.innerHTML = svgPause;
                    setWaveAnimation(true);
                }).catch((err) => {
                    console.log('Autoplay diblokir browser, menanti interaksi ketukan selanjutnya:', err);
                    playBtn.innerHTML = svgPlay;
                    setWaveAnimation(false);
                });
            }, 500);
        }

        function toggleAudio() {
            audioCore.volume = 0.2;

            if(audioCore.paused) {
                audioCore.play().then(() => {
                    playBtn.innerHTML = svgPause;
                    setWaveAnimation(true);
                }).catch(err => console.error("Error playing audio:", err));
            } else {
                audioCore.pause();
                playBtn.innerHTML = svgPlay;
                setWaveAnimation(false);
            }
        }

        function setWaveAnimation(status) {
            const bars = waveVisual.querySelectorAll('.wave-bar');
            bars.forEach(b => b.style.animationPlayState = status ? 'running' : 'paused');
        }