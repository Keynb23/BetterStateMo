import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import "./ComponentStyles.css";
import Map from "./Map.jsx";

import facebook from "../assets/socials/facebook.png";
import instagram from "../assets/socials/instagram.png";
import linkedin from '../assets/linkedin.png';
import Github from '../assets/Github.png';
import swimmingpool from "../assets/3d/swimming_pool.glb";

// PoolScene Component
const PoolScene = ({ scrollProgress }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#87CEEB'); // Sky blue

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    let divingBoardModel;

    loader.load(
      swimmingpool,
      (gltf) => {
        divingBoardModel = gltf.scene;
        divingBoardModel.position.set(0, -1.25, 0);
        divingBoardModel.scale.set(1.5, 1.5, 1.5);
        scene.add(divingBoardModel);
      },
      undefined,
      (error) => console.error("GLTF load error:", error)
    );

    const animate = () => {
      requestAnimationFrame(animate);

      // Scroll-based camera movement
      camera.position.y = 2 - 3.5 * scrollProgress;
      camera.position.z = 4 - 2.5 * scrollProgress;
      camera.lookAt(0, 0, 0);

      if (divingBoardModel) {
        divingBoardModel.rotation.x = -Math.PI / 8 * scrollProgress;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.traverse((object) => {
        if (object.isMesh) {
          object.geometry.dispose();
          object.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, [scrollProgress]);

  return <div ref={mountRef} className="pool-scene-canvas" />;
};

// Footer Component
export default function Footer() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const footerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (footerRef.current) {
        const scrollY = window.scrollY;
        const offsetTop = footerRef.current.offsetTop;
        const height = footerRef.current.clientHeight;
        const viewportHeight = window.innerHeight;

        const start = offsetTop - viewportHeight + height * 0.3;
        const end = offsetTop + height * 0.5;

        let progress = 0;
        if (scrollY > start) {
          progress = (scrollY - start) / (end - start);
          progress = Math.min(Math.max(progress, 0), 1);
        }

        setScrollProgress(progress);

        const above = footerRef.current.querySelector('.above-water-content');
        const under = footerRef.current.querySelector('.underwater-content');

        if (progress < 0.5) {
          above.classList.add('is-active-content');
          above.classList.remove('is-inactive-content');
          under.classList.add('is-inactive-content');
          under.classList.remove('is-active-content');
        } else {
          above.classList.add('is-inactive-content');
          above.classList.remove('is-active-content');
          under.classList.add('is-active-content');
          under.classList.remove('is-inactive-content');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // run on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="footer-container">
      <div className="footer-intro">
        <div>
          <h1 className="footer-heading">Better State LLC</h1>
          <p className="footer-description">All rights reserved. 2025. Better State LLC.</p>
        </div>
      </div>

      <footer ref={footerRef} className="footer-section">
        <PoolScene scrollProgress={scrollProgress} />

        <div className="above-water-content">
          <div className="footer-content-top">
            <div className="footer-social-media">
              <a href="https://www.facebook.com/betterstatemo" target="_blank" rel="noopener noreferrer">
                <img src={facebook} alt="facebook" />
              </a>
              <a href="https://www.instagram.com/betterstatellc/" target="_blank" rel="noopener noreferrer">
                <img src={instagram} alt="instagram" />
              </a>
            </div>

            <div className="footer-contact">Tel: 573-826-9529</div>
            <div className="footer-hours">
              <p>8am - 7pm</p>
              <p>Monday - Friday</p>
            </div>

            <div className="footer-coverage">
              <Map />
            </div>
          </div>
        </div>

        <div className="underwater-content">
          <h2 className="underwater-title">Our Valued Partners</h2>
          <div className="Devby">
            A Key'nB Production
            <div className="Devby-links">
              <a href="https://www.linkedin.com/in/key-n-brosdahl-5320b3353/" target="_blank" rel="noopener noreferrer">
                <img src={linkedin} alt="LinkedIn" />
              </a>
              <a href="https://github.com/Keynb23" target="_blank" rel="noopener noreferrer">
                <img src={Github} alt="GitHub" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
