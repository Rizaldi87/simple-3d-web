import gsap from "gsap";
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { HemisphereLight } from "three/webgpu";

const scene = new THREE.Scene();

const w = window.innerWidth;
const h = window.innerHeight;

const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 10);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  antialias: true,
});
document.body.appendChild(renderer.domElement);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(w, h);
renderer.setPixelRatio(1);
camera.position.setZ(10);

const control = new OrbitControls(camera, renderer.domElement);
control.enableDamping = true;
control.dampingFactor = 0.05;
control.enablePan = false;
control.enableZoom = false;
console.log(camera.position);
const geo = new THREE.SphereGeometry(2, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.2,
});
const mesh = new THREE.Mesh(geo, material);
scene.add(mesh);

const hemLigth = new THREE.PointLight(0xffffff, 50, 100);
hemLigth.position.set(0, 0, 5);
scene.add(hemLigth);

function animate(t = 0) {
  requestAnimationFrame(animate);
  // control.update();
  renderer.render(scene, camera);
}

animate();

//resize window
function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);

const t1 = gsap.timeline({ defaults: { duration: 0.5 } });
t1.fromTo(mesh.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 });
t1.fromTo("nav", { y: "-100%" }, { y: "0%" });
t1.fromTo(".title", { opacity: 0 }, { opacity: 1 });

let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [Math.round(e.pageX / window.innerWidth) * 255, Math.round(e.pageY / window.innerHeight) * 255, 150];
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, { r: newColor.r, g: newColor.g, b: newColor.b });
  }
});

//mobile touches
window.addEventListener("touchstart", () => (mouseDown = true));
window.addEventListener("touchmove", (e) => {
  if (mouseDown) {
    const xRatio = e.touches[0].pageX / innerWidth;
    const yRatio = e.touches[0].pageY / innerHeight;
    rgb = [Math.floor(xRatio * 255), Math.floor(yRatio), 150];
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, { r: newColor.r, g: newColor.g, b: newColor.b });
  }
});

window.addEventListener("touchend", () => (mouseDown = false));
