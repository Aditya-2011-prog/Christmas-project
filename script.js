
// Logic for interaction and snow

document.addEventListener('DOMContentLoaded', () => {
    const giftContainer = document.getElementById('gift-container');
    const wishContent = document.getElementById('wish-content');
    const treeContainer = document.getElementById('tree-container');
    const treePath = document.getElementById('tree-path');
    const starPath = document.getElementById('star-path');
    const treeLights = document.getElementById('tree-lights');
    const bgMusic = document.getElementById('bg-music');

    // Interaction
    giftContainer.addEventListener('click', () => {
        // Explode gift
        giftContainer.classList.add('exploded');

        // Play Music
        bgMusic.volume = 0.5;
        bgMusic.play().catch(e => console.log('Audio autoplay prevented:', e));

        // Start Tree Animation Sequence
        setTimeout(() => {
            giftContainer.classList.add('hidden');
            treeContainer.classList.remove('hidden');
            treePath.classList.remove('opacity-0');
            treePath.classList.add('draw-path');

            // Show Star after tree draws
            setTimeout(() => {
                starPath.classList.add('pop-in');
            }, 2500);

            // Show Lights
            setTimeout(() => {
                treeLights.classList.remove('opacity-0');
            }, 3000);

            // Show Wish Content overlaying tree
            setTimeout(() => {
                wishContent.classList.remove('hidden');
                // Trigger reflow
                void wishContent.offsetWidth;
                wishContent.classList.remove('opacity-0', 'scale-95');
                wishContent.classList.add('opacity-100', 'scale-100');

                // Blur the tree slightly for focus
                treeContainer.classList.add('blur-sm', 'opacity-80');
            }, 3500); // Delayed slightly more to let lights shine first

        }, 600);
    });

    // Snow System
    initSnow();
});

function initSnow() {
    const canvas = document.getElementById('snowCanvas');
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const flakes = [];
    const maxFlakes = 150;
    const emojis = ['❄️', '🍬', '🎁', '🍪', '✨'];

    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });

    class Flake {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 20 + 10; // Bigger for emojis
            this.speedY = Math.random() * 1 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.3;
            // 20% chance to be an emoji, else a snow dot
            this.isEmoji = Math.random() > 0.8;
            this.emoji = emojis[Math.floor(Math.random() * emojis.length)];
            // Snow dot size override
            if (!this.isEmoji) this.size = Math.random() * 3 + 1;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;

            if (this.y > height) {
                this.y = -20;
                this.x = Math.random() * width;
            }
            if (this.x > width) this.x = 0;
            if (this.x < 0) this.x = width;
        }

        draw() {
            if (this.isEmoji) {
                ctx.font = `${this.size}px serif`;
                ctx.globalAlpha = this.opacity;
                ctx.fillText(this.emoji, this.x, this.y);
                ctx.globalAlpha = 1;
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Init flakes
    for (let i = 0; i < maxFlakes; i++) {
        flakes.push(new Flake());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        flakes.forEach(flake => {
            flake.update();
            flake.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

