// Fish class for creating and managing fish
class Fish {
    constructor(container) {
        this.container = container;
        this.element = null;
        this.x = Math.random() * (window.innerWidth - 100);
        this.y = Math.random() * (window.innerHeight * 0.6);
        this.speed = 1 + Math.random() * 2;
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.size = 30 + Math.random() * 40;
        this.colorClass = this.getRandomColor();
        this.swimAngle = 0;
        
        this.createFish();
    }
    
    getRandomColor() {
        const colors = [
            'fish-orange', 'fish-blue', 'fish-yellow', 
            'fish-purple', 'fish-pink', 'fish-green', 
            'fish-red', 'fish-teal'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    createFish() {
        this.element = document.createElement('div');
        this.element.className = 'fish';
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size * 0.6}px`;
        
        // Fish body
        const body = document.createElement('div');
        body.className = `fish-body ${this.colorClass}`;
        body.style.width = '100%';
        body.style.height = '100%';
        
        // Fish eye
        const eye = document.createElement('div');
        eye.style.position = 'absolute';
        eye.style.width = `${this.size * 0.15}px`;
        eye.style.height = `${this.size * 0.15}px`;
        eye.style.background = 'white';
        eye.style.borderRadius = '50%';
        eye.style.top = '15%';
        eye.style.left = this.direction > 0 ? '75%' : '10%';
        eye.style.boxShadow = 'inset 2px 2px 5px rgba(0,0,0,0.3)';
        
        const pupil = document.createElement('div');
        pupil.style.position = 'absolute';
        pupil.style.width = '40%';
        pupil.style.height = '40%';
        pupil.style.background = 'black';
        pupil.style.borderRadius = '50%';
        pupil.style.top = '30%';
        pupil.style.left = '30%';
        eye.appendChild(pupil);
        
        // Fish tail
        const tail = document.createElement('div');
        tail.className = 'fish-tail';
        tail.style.width = `${this.size * 0.4}px`;
        tail.style.height = `${this.size * 0.5}px`;
        tail.style.background = `linear-gradient(135deg, 
            ${this.getColorFromClass()} 0%, 
            ${this.lightenColor(this.getColorFromClass())} 100%)`;
        tail.style.top = '25%';
        tail.style.left = this.direction > 0 ? '-35%' : '95%';
        
        // Fish fin
        const fin = document.createElement('div');
        fin.className = 'fish-fin';
        fin.style.width = `${this.size * 0.3}px`;
        fin.style.height = `${this.size * 0.2}px`;
        fin.style.background = `linear-gradient(135deg, 
            ${this.getColorFromClass()} 0%, 
            ${this.lightenColor(this.getColorFromClass())} 100%)`;
        fin.style.top = '-20%';
        fin.style.left = '35%';
        
        body.appendChild(eye);
        body.appendChild(tail);
        body.appendChild(fin);
        this.element.appendChild(body);
        
        this.container.appendChild(this.element);
        this.updatePosition();
    }
    
    getColorFromClass() {
        const colorMap = {
            'fish-orange': '#ff6b35',
            'fish-blue': '#0066cc',
            'fish-yellow': '#ffd700',
            'fish-purple': '#8b00ff',
            'fish-pink': '#ff1493',
            'fish-green': '#00ff7f',
            'fish-red': '#dc143c',
            'fish-teal': '#008080'
        };
        return colorMap[this.colorClass] || '#ff6b35';
    }
    
    lightenColor(color) {
        // Simple color lightening
        const hex = color.replace('#', '');
        const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + 40);
        const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + 40);
        const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + 40);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.transform = `scaleX(${this.direction}) rotate(${Math.sin(this.swimAngle) * 10}deg)`;
    }
    
    swim() {
        this.x += this.speed * this.direction;
        this.swimAngle += 0.05;
        
        // Add some vertical movement
        this.y += Math.sin(this.swimAngle) * 0.5;
        
        // Boundary checking with smooth turning
        if (this.x > window.innerWidth - this.size) {
            this.direction = -1;
        } else if (this.x < 0) {
            this.direction = 1;
        }
        
        // Keep fish in upper 80% of screen
        const maxY = window.innerHeight * 0.7;
        const minY = 50;
        if (this.y > maxY) {
            this.y = maxY;
        } else if (this.y < minY) {
            this.y = minY;
        }
        
        this.updatePosition();
    }
    
    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// Bubble class
class Bubble {
    constructor(container) {
        this.container = container;
        this.element = null;
        this.x = Math.random() * window.innerWidth;
        this.y = window.innerHeight + Math.random() * 100;
        this.size = 5 + Math.random() * 15;
        this.speed = 1 + Math.random() * 2;
        this.wobble = Math.random() * Math.PI * 2;
        
        this.createBubble();
    }
    
    createBubble() {
        this.element = document.createElement('div');
        this.element.className = 'bubble';
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        this.element.style.left = `${this.x}px`;
        this.element.style.animationDuration = `${8 + Math.random() * 4}s`;
        
        this.container.appendChild(this.element);
    }
    
    rise() {
        this.y -= this.speed;
        this.wobble += 0.05;
        this.x += Math.sin(this.wobble) * 0.5;
        
        this.element.style.top = `${this.y}px`;
        this.element.style.left = `${this.x}px`;
        
        // Reset bubble when it reaches top
        if (this.y < -50) {
            this.y = window.innerHeight + Math.random() * 100;
            this.x = Math.random() * window.innerWidth;
        }
    }
    
    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// Plant class
class Plant {
    constructor(container, x) {
        this.container = container;
        this.element = null;
        this.x = x;
        this.height = 40 + Math.random() * 60;
        this.width = 10 + Math.random() * 15;
        this.delay = Math.random() * 2;
        
        this.createPlant();
    }
    
    createPlant() {
        this.element = document.createElement('div');
        this.element.className = 'plant';
        this.element.style.left = `${this.x}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.width = `${this.width}px`;
        this.element.style.animationDelay = `${this.delay}s`;
        
        // Add multiple segments for more natural look
        const segments = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < segments; i++) {
            const segment = document.createElement('div');
            segment.style.position = 'absolute';
            segment.style.bottom = `${i * 15}px`;
            segment.style.width = `${this.width * (1 - i * 0.1)}px`;
            segment.style.height = '20px';
            segment.style.background = 'linear-gradient(0deg, #2d5016 0%, #4a8024 100%)';
            segment.style.borderRadius = '50% 50% 0 0';
            segment.style.left = '50%';
            segment.style.transform = 'translateX(-50%)';
            this.element.appendChild(segment);
        }
        
        this.container.appendChild(this.element);
    }
    
    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// Rock class
class Rock {
    constructor(container, x) {
        this.container = container;
        this.element = null;
        this.x = x;
        this.width = 30 + Math.random() * 50;
        this.height = 20 + Math.random() * 30;
        
        this.createRock();
    }
    
    createRock() {
        this.element = document.createElement('div');
        this.element.className = 'rock';
        this.element.style.left = `${this.x}px`;
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        
        this.container.appendChild(this.element);
    }
    
    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// Main Aquarium Manager
class Aquarium {
    constructor() {
        this.fishContainer = document.getElementById('fish-container');
        this.bubblesContainer = document.getElementById('bubbles');
        this.plantsContainer = document.getElementById('plants');
        this.rocksContainer = document.getElementById('rocks');
        
        this.fishes = [];
        this.bubbles = [];
        this.plants = [];
        this.rocks = [];
        
        this.init();
    }
    
    init() {
        this.createFishes(12);
        this.createBubbles(30);
        this.createPlants(8);
        this.createRocks(5);
        
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Add click interaction to add fish
        document.addEventListener('click', (e) => {
            if (e.target.closest('.fish')) {
                this.addFishAtPosition(e.clientX, e.clientY);
            }
        });
    }
    
    createFishes(count) {
        for (let i = 0; i < count; i++) {
            this.fishes.push(new Fish(this.fishContainer));
        }
    }
    
    createBubbles(count) {
        for (let i = 0; i < count; i++) {
            const bubble = new Bubble(this.bubblesContainer);
            // Stagger initial positions
            bubble.y = Math.random() * window.innerHeight;
            bubble.element.style.top = `${bubble.y}px`;
            this.bubbles.push(bubble);
        }
    }
    
    createPlants(count) {
        const spacing = window.innerWidth / count;
        for (let i = 0; i < count; i++) {
            const x = spacing * i + Math.random() * 50;
            this.plants.push(new Plant(this.plantsContainer, x));
        }
    }
    
    createRocks(count) {
        for (let i = 0; i < count; i++) {
            const x = Math.random() * (window.innerWidth - 100);
            this.rocks.push(new Rock(this.rocksContainer, x));
        }
    }
    
    addFishAtPosition(x, y) {
        const fish = new Fish(this.fishContainer);
        fish.x = x;
        fish.y = y;
        fish.updatePosition();
        this.fishes.push(fish);
        
        // Limit total fish count
        if (this.fishes.length > 20) {
            const oldFish = this.fishes.shift();
            oldFish.remove();
        }
    }
    
    handleResize() {
        // Remove elements that are out of bounds
        this.fishes.forEach(fish => {
            if (fish.x > window.innerWidth) {
                fish.x = window.innerWidth - 100;
            }
        });
        
        this.bubbles.forEach(bubble => {
            if (bubble.x > window.innerWidth) {
                bubble.x = window.innerWidth - 50;
            }
        });
    }
    
    animate() {
        // Update all fishes
        this.fishes.forEach(fish => {
            fish.swim();
        });
        
        // Update all bubbles
        this.bubbles.forEach(bubble => {
            bubble.rise();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize aquarium when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Aquarium();
});
