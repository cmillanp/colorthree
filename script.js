import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

// Configuración del estilo del body para overflow hidden
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.body.style.height = '100vh';
document.documentElement.style.height = '100vh';

// Configuración básica de la escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x121212); // Color de fondo

// Configuración de la cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15; // Alejamos un poco la cámara para ver todo el triángulo

// Configuración del renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Definimos la longitud del lado del triángulo
const a = 6; // Puedes ajustar esta distancia según lo desees
const h = Math.sqrt(3) * a / 2;

// Configuración de la esfera blue (centro del triángulo)
const geometry = new THREE.SphereGeometry(1, 32, 32); // Cambiado a esfera
const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x0000ff,
    emissiveIntensity: 9,
    metalness: 0,
    roughness: 1,
});
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(0, h / 2, 0); // Vértice superior
scene.add(sphere);

// Configuración de la esfera green (izquierda)
const geometry2 = new THREE.SphereGeometry(1, 32, 32); // Cambiado a esfera
const material2 = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x00ff00,
    emissiveIntensity: 7,
    metalness: 0,
    roughness: 1,
});
const sphere2 = new THREE.Mesh(geometry2, material2);
sphere2.position.set(-a / 2, -h / 2, 0); // Vértice inferior izquierdo
scene.add(sphere2);

// Configuración de la esfera red (derecha)
const geometry3 = new THREE.SphereGeometry(1, 32, 32); // Cambiado a esfera
const material3 = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xff0000,
    emissiveIntensity: 7,
    metalness: 0,
    roughness: 1,
});
const sphere3 = new THREE.Mesh(geometry3, material3);
sphere3.position.set(a / 2, -h / 2, 0); // Vértice inferior derecho
scene.add(sphere3);

// Añadir una luz ambiental y direccional para que la escena esté bien iluminada
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(0, 5, 10); // Posiciona la luz para que ilumine uniformemente
scene.add(directionalLight);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, // Intensidad del bloom (strength)
    1.1, // Radio del bloom (radius)
    0.85 // Umbral del bloom (threshold)
);
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(bloomPass);

// Configuración de los controles de la cámara
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Habilitar el damping para un movimiento más suave
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI; // Permite la rotación completa
controls.minPolarAngle = 0; // Permite la rotación completa hacia abajo
controls.minDistance = 2; // Ajusta la distancia mínima
controls.maxDistance = 20; // Ajusta la distancia máxima

// Función de animación
let scaleFactor = 1;
let growthSpeed = 0.01;

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Rotar toda la escena lentamente
    scene.rotation.y += 0.01; // Rotación lenta en el eje Y
    scene.rotation.x += 0.01; // Rotación lenta en el eje X (opcional)

    // Calcular el nuevo tamaño basado en una función senoidal
    const newScale = 2 + Math.sin(scaleFactor) * 0.1; // El tamaño oscilará entre 0.5 y 1.5

    // Aplicar el nuevo tamaño a cada esfera
    sphere.scale.set(newScale, newScale, newScale);
    sphere2.scale.set(newScale, newScale, newScale);
    sphere3.scale.set(newScale, newScale, newScale);

    // Incrementar el factor de escala para la próxima animación
    scaleFactor += growthSpeed;

    controls.update(); // Actualizar los controles

    composer.render();
}

animate();


// Ajustar el tamaño del renderizador al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
