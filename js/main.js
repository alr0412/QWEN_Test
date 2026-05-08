// 3D Aquarium using Three.js

class Aquarium3D {
    constructor() {
        this.container = document.getElementById('aquarium-container');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.fishes = [];
        this.bubbles = [];
        this.seaweeds = [];
        this.rocks = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        
        this.colors = [
            0xff6b35, // orange
            0x0066cc, // blue
            0xffd700, // yellow
            0x8b00ff, // purple
            0xff1493, // pink
            0x00ff7f, // green
            0xdc143c, // red
            0x008080  // teal
        ];
        
        this.init();
        this.animate();
        this.addEventListeners();
    }
    
    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x001a33);
        this.scene.fog = new THREE.FogExp2(0x001a33, 0.02);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 30;
        this.camera.position.y = 10;
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);
        
        // Lighting
        this.setupLighting();
        
        // Create environment
        this.createWaterBox();
        this.createSeabed();
        this.createFishes(15);
        this.createBubbles(50);
        this.createSeaweeds(12);
        this.createRocks(8);
        
        // Initial mouse position at center
        this.mouseX = 0;
        this.mouseY = 0;
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (sun from above)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 50, 20);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        // Point lights for underwater effect
        const pointLight1 = new THREE.PointLight(0x00d4ff, 0.5, 100);
        pointLight1.position.set(-20, 20, 10);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x00ff88, 0.3, 100);
        pointLight2.position.set(20, 15, -10);
        this.scene.add(pointLight2);
        
        // Hemisphere light for sky/ground color variation
        const hemisphereLight = new THREE.HemisphereLight(0x0066ff, 0x003300, 0.4);
        this.scene.add(hemisphereLight);
    }
    
    createWaterBox() {
        const geometry = new THREE.BoxGeometry(100, 60, 50);
        const material = new THREE.MeshPhongMaterial({
            color: 0x004d99,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const waterBox = new THREE.Mesh(geometry, material);
        waterBox.position.y = -10;
        this.scene.add(waterBox);
    }
    
    createSeabed() {
        // Sandy bottom
        const sandGeometry = new THREE.PlaneGeometry(120, 80, 32, 32);
        
        // Add some vertex displacement for uneven terrain
        const positions = sandGeometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 2] = Math.random() * 2; // Small height variation
        }
        sandGeometry.computeVertexNormals();
        
        const sandMaterial = new THREE.MeshPhongMaterial({
            color: 0xc4a574,
            side: THREE.DoubleSide,
            flatShading: true
        });
        const sand = new THREE.Mesh(sandGeometry, sandMaterial);
        sand.rotation.x = -Math.PI / 2;
        sand.position.y = -25;
        sand.receiveShadow = true;
        this.scene.add(sand);
    }
    
    createFishBody(color) {
        const fishGroup = new THREE.Group();
        
        // Body - elongated sphere
        const bodyGeometry = new THREE.SphereGeometry(1, 32, 32);
        bodyGeometry.scale(2, 0.8, 0.6);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 100,
            specular: 0x444444
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        fishGroup.add(body);
        
        // Tail fin
        const tailGeometry = new THREE.ConeGeometry(0.5, 1.5, 4);
        const tailMaterial = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 80
        });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.rotation.x = Math.PI / 2;
        tail.rotation.y = Math.PI;
        tail.position.set(-2, 0, 0);
        tail.castShadow = true;
        fishGroup.add(tail);
        
        // Dorsal fin
        const dorsalGeometry = new THREE.ConeGeometry(0.3, 1, 4);
        const dorsal = new THREE.Mesh(dorsalGeometry, tailMaterial);
        dorsal.position.set(0, 0.7, 0);
        dorsal.rotation.z = -Math.PI / 6;
        dorsal.castShadow = true;
        fishGroup.add(dorsal);
        
        // Side fins (left and right)
        const finGeometry = new THREE.ConeGeometry(0.25, 0.8, 4);
        
        const leftFin = new THREE.Mesh(finGeometry, tailMaterial);
        leftFin.position.set(0.5, -0.4, 0.5);
        leftFin.rotation.z = Math.PI / 4;
        leftFin.rotation.x = -Math.PI / 6;
        leftFin.castShadow = true;
        fishGroup.add(leftFin);
        
        const rightFin = new THREE.Mesh(finGeometry, tailMaterial);
        rightFin.position.set(0.5, -0.4, -0.5);
        rightFin.rotation.z = Math.PI / 4;
        rightFin.rotation.x = Math.PI / 6;
        rightFin.castShadow = true;
        fishGroup.add(rightFin);
        
        // Eye
        const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        eye.position.set(1.5, 0.2, 0.3);
        fishGroup.add(eye);
        
        // Pupil
        const pupilGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        pupil.position.set(1.6, 0.2, 0.35);
        fishGroup.add(pupil);
        
        return fishGroup;
    }
    
    createFishes(count) {
        for (let i = 0; i < count; i++) {
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            const fish = this.createFishBody(color);
            
            // Random position
            fish.position.x = (Math.random() - 0.5) * 60;
            fish.position.y = (Math.random() - 0.5) * 30;
            fish.position.z = (Math.random() - 0.5) * 30;
            
            // Random scale
            const scale = 0.8 + Math.random() * 0.8;
            fish.scale.set(scale, scale, scale);
            
            // Random direction
            fish.rotation.y = Math.random() * Math.PI * 2;
            
            // Store fish data
            const fishData = {
                mesh: fish,
                speed: 0.05 + Math.random() * 0.1,
                turnSpeed: 0.02 + Math.random() * 0.02,
                targetY: fish.position.y,
                swimPhase: Math.random() * Math.PI * 2,
                tailAngle: 0
            };
            
            this.fishes.push(fishData);
            this.scene.add(fish);
        }
    }
    
    createBubble() {
        const geometry = new THREE.SphereGeometry(0.3, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.6,
            shininess: 100
        });
        const bubble = new THREE.Mesh(geometry, material);
        
        bubble.position.x = (Math.random() - 0.5) * 80;
        bubble.position.y = -25;
        bubble.position.z = (Math.random() - 0.5) * 40;
        
        const scale = 0.5 + Math.random() * 1;
        bubble.scale.set(scale, scale, scale);
        
        const bubbleData = {
            mesh: bubble,
            speed: 0.05 + Math.random() * 0.1,
            wobblePhase: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.05 + Math.random() * 0.05
        };
        
        this.bubbles.push(bubbleData);
        this.scene.add(bubble);
    }
    
    createBubbles(count) {
        for (let i = 0; i < count; i++) {
            this.createBubble();
        }
    }
    
    createSeaweed() {
        const seaweedGroup = new THREE.Group();
        const segments = 5 + Math.floor(Math.random() * 3);
        const segmentHeight = 3;
        const baseColor = new THREE.Color().setHSL(0.3 + Math.random() * 0.1, 0.8, 0.3);
        
        let prevSegment = null;
        
        for (let i = 0; i < segments; i++) {
            const geometry = new THREE.CylinderGeometry(
                0.3 * (1 - i * 0.15),
                0.4 * (1 - i * 0.1),
                segmentHeight,
                8
            );
            const material = new THREE.MeshPhongMaterial({
                color: baseColor,
                shininess: 50
            });
            const segment = new THREE.Mesh(geometry, material);
            segment.position.y = i * segmentHeight * 0.8;
            segment.castShadow = true;
            
            if (prevSegment) {
                prevSegment.add(segment);
            } else {
                seaweedGroup.add(segment);
            }
            
            prevSegment = segment;
        }
        
        // Position on seabed
        seaweedGroup.position.x = (Math.random() - 0.5) * 100;
        seaweedGroup.position.z = (Math.random() - 0.5) * 60;
        seaweedGroup.position.y = -25;
        
        const seaweedData = {
            mesh: seaweedGroup,
            swayPhase: Math.random() * Math.PI * 2,
            swaySpeed: 0.02 + Math.random() * 0.02
        };
        
        this.seaweeds.push(seaweedData);
        this.scene.add(seaweedGroup);
    }
    
    createSeaweeds(count) {
        for (let i = 0; i < count; i++) {
            this.createSeaweed();
        }
    }
    
    createRock() {
        const geometry = new THREE.DodecahedronGeometry(
            2 + Math.random() * 3,
            0
        );
        
        // Deform vertices for more natural rock shape
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const noise = (Math.random() - 0.5) * 0.5;
            positions[i] += noise;
            positions[i + 1] += noise;
            positions[i + 2] += noise;
        }
        geometry.computeVertexNormals();
        
        const material = new THREE.MeshPhongMaterial({
            color: 0x696969,
            shininess: 20,
            flatShading: true
        });
        
        const rock = new THREE.Mesh(geometry, material);
        rock.position.x = (Math.random() - 0.5) * 90;
        rock.position.z = (Math.random() - 0.5) * 50;
        rock.position.y = -24;
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        rock.castShadow = true;
        rock.receiveShadow = true;
        
        this.rocks.push(rock);
        this.scene.add(rock);
    }
    
    createRocks(count) {
        for (let i = 0; i < count; i++) {
            this.createRock();
        }
    }
    
    addEventListeners() {
        // Mouse movement for camera rotation
        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Click to add fish
        document.addEventListener('click', (event) => {
            if (event.target.closest('#info')) return;
            
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            const fish = this.createFishBody(color);
            
            // Convert screen coordinates to world coordinates
            const vector = new THREE.Vector3(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1,
                0.5
            );
            vector.unproject(this.camera);
            
            const dir = vector.sub(this.camera.position).normalize();
            const distance = -this.camera.position.z / dir.z;
            const pos = this.camera.position.clone().add(dir.multiplyScalar(distance * 0.5));
            
            fish.position.copy(pos);
            fish.scale.set(1, 1, 1);
            fish.rotation.y = Math.random() * Math.PI * 2;
            
            const fishData = {
                mesh: fish,
                speed: 0.05 + Math.random() * 0.1,
                turnSpeed: 0.02 + Math.random() * 0.02,
                targetY: fish.position.y,
                swimPhase: Math.random() * Math.PI * 2,
                tailAngle: 0
            };
            
            this.fishes.push(fishData);
            this.scene.add(fish);
            
            // Limit fish count
            if (this.fishes.length > 30) {
                const oldFish = this.fishes.shift();
                this.scene.remove(oldFish.mesh);
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    updateFishes() {
        this.fishes.forEach((fishData, index) => {
            const { mesh, speed, turnSpeed, swimPhase } = fishData;
            
            // Swimming motion
            fishData.swimPhase += 0.05;
            
            // Move forward
            mesh.translateX(speed);
            
            // Gentle up/down movement
            mesh.position.y += Math.sin(fishData.swimPhase) * 0.05;
            
            // Keep within bounds
            const boundX = 50;
            const boundY = 25;
            const boundZ = 40;
            
            if (mesh.position.x > boundX || mesh.position.x < -boundX) {
                mesh.rotation.y += Math.PI;
                mesh.position.x = Math.sign(mesh.position.x) * boundX * 0.95;
            }
            
            if (mesh.position.y > boundY || mesh.position.y < -boundY) {
                mesh.rotation.x = -Math.sign(mesh.position.y) * 0.5;
                mesh.position.y = Math.sign(mesh.position.y) * boundY * 0.95;
            }
            
            if (mesh.position.z > boundZ || mesh.position.z < -boundZ) {
                mesh.rotation.y += Math.PI;
                mesh.position.z = Math.sign(mesh.position.z) * boundZ * 0.95;
            }
            
            // Smooth rotation
            mesh.rotation.y += (Math.random() - 0.5) * turnSpeed;
            
            // Tail animation
            fishData.tailAngle = Math.sin(fishData.swimPhase * 2) * 0.3;
            if (mesh.children[1]) { // Tail is second child
                mesh.children[1].rotation.y = Math.PI + fishData.tailAngle;
            }
        });
    }
    
    updateBubbles() {
        this.bubbles.forEach((bubbleData) => {
            const { mesh, speed, wobblePhase, wobbleSpeed } = bubbleData;
            
            // Rise up
            mesh.position.y += speed;
            
            // Wobble side to side
            bubbleData.wobblePhase += wobbleSpeed;
            mesh.position.x += Math.sin(bubbleData.wobblePhase) * 0.05;
            
            // Reset when reaching top
            if (mesh.position.y > 30) {
                mesh.position.y = -25;
                mesh.position.x = (Math.random() - 0.5) * 80;
            }
        });
    }
    
    updateSeaweeds() {
        this.seaweeds.forEach((seaweedData) => {
            seaweedData.swayPhase += seaweedData.swaySpeed;
            const sway = Math.sin(seaweedData.swayPhase) * 0.1;
            
            // Apply sway to all segments
            seaweedData.mesh.children.forEach((segment, index) => {
                if (index > 0) {
                    segment.rotation.z = sway * (index * 0.3);
                    segment.rotation.x = Math.cos(seaweedData.swayPhase) * 0.05 * index;
                }
            });
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update camera based on mouse position
        this.targetRotationY = this.mouseX * 0.5;
        this.targetRotationX = this.mouseY * 0.3;
        
        // Smooth camera movement
        this.camera.rotation.y += (this.targetRotationY - this.camera.rotation.y) * 0.05;
        this.camera.rotation.x += (this.targetRotationX - this.camera.rotation.x) * 0.05;
        
        // Update all elements
        this.updateFishes();
        this.updateBubbles();
        this.updateSeaweeds();
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Aquarium3D();
});
