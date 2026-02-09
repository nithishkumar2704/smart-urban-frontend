// Three.js Globe Animation with Space Background
// Creates a rotating 3D Earth globe with stars and space effects

let scene, camera, renderer, earth, stars, atmosphere;
let animationId;
let startTime = Date.now();

function initGlobe() {
    const container = document.getElementById('globe-container');

    // Scene setup
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 2.5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        alpha: false, // Changed to false for space background
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Add starfield background
    createStarfield();

    // Create Earth sphere
    const geometry = new THREE.SphereGeometry(1, 64, 64);

    // Load Earth texture
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load(
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
        () => {
            console.log('Earth texture loaded');
        },
        undefined,
        (error) => {
            console.error('Error loading texture:', error);
            // Fallback to blue material if texture fails
            earth.material = new THREE.MeshPhongMaterial({
                color: 0x2563eb,
                shininess: 10
            });
        }
    );

    // Material with texture
    const material = new THREE.MeshPhongMaterial({
        map: earthTexture,
        shininess: 5,
        bumpScale: 0.05
    });

    earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // Add atmospheric glow around Earth
    createAtmosphere();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.2);
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    // Add subtle rim light
    const rimLight = new THREE.PointLight(0x4a90e2, 0.6);
    rimLight.position.set(-5, 0, -5);
    scene.add(rimLight);

    // Add backlight for depth
    const backLight = new THREE.PointLight(0x88ccff, 0.3);
    backLight.position.set(0, 0, -5);
    scene.add(backLight);

    // Start animation
    animate();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

// Create starfield background
function createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;

        // Random positions in a sphere
        const radius = 50 + Math.random() * 450;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        // Random star colors (white to slight blue/yellow tint)
        const colorVariation = Math.random();
        if (colorVariation > 0.8) {
            // Blue-ish stars
            colors[i3] = 0.8 + Math.random() * 0.2;
            colors[i3 + 1] = 0.9 + Math.random() * 0.1;
            colors[i3 + 2] = 1.0;
        } else if (colorVariation > 0.6) {
            // Yellow-ish stars
            colors[i3] = 1.0;
            colors[i3 + 1] = 0.9 + Math.random() * 0.1;
            colors[i3 + 2] = 0.7 + Math.random() * 0.2;
        } else {
            // White stars
            colors[i3] = 1.0;
            colors[i3 + 1] = 1.0;
            colors[i3 + 2] = 1.0;
        }

        // Random sizes - much smaller for realistic stars
        sizes[i] = Math.random() * 0.8 + 0.2; // Range: 0.2 to 1.0
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const starMaterial = new THREE.PointsMaterial({
        size: 0.5,  // Changed from 2 to 0.5 for tiny dots
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true
    });

    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

// Create atmospheric glow around Earth
function createAtmosphere() {
    const atmosphereGeometry = new THREE.SphereGeometry(1.15, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
            }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true
    });

    atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);
}

function animate() {
    animationId = requestAnimationFrame(animate);

    const elapsed = (Date.now() - startTime) / 1000;

    // Rotate the globe
    earth.rotation.y += 0.002;

    // Rotate atmosphere slightly slower for depth
    if (atmosphere) {
        atmosphere.rotation.y += 0.001;
    }

    // Subtle star rotation for depth
    if (stars) {
        stars.rotation.y += 0.0001;
        stars.rotation.x += 0.00005;
    }

    // Gentle camera zoom effect during intro
    if (elapsed < 3) {
        camera.position.z = 2.5 + Math.sin(elapsed * 0.5) * 0.1;
    }

    // Render the scene
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function stopGlobe() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
}

// Initialize globe when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobe);
} else {
    initGlobe();
}
