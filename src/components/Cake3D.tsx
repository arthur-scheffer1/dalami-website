"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Bolo 3D modelado por código (sem asset externo): camadas de massa e recheio,
 * cobertura com pingos escorrendo pela borda e morangos no topo.
 *
 * O bolo "olha" para o cursor — a rotação persegue a posição do ponteiro com
 * amortecimento, em vez de saltar para ela. Fundo transparente, para o canvas
 * poder ficar entre as duas camadas de texto do hero.
 */
export default function Cake3D({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 1.9, 8.4);
    camera.lookAt(0, 0.1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth || 1, mount.clientHeight || 1, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    // ---- materiais, nas cores da marca ------------------------------------
    const massa = new THREE.MeshStandardMaterial({ color: 0x3a2318, roughness: 0.95 });
    const recheio = new THREE.MeshStandardMaterial({ color: 0xf6ecd8, roughness: 0.75 });
    const ganache = new THREE.MeshStandardMaterial({
      color: 0x2b1710,
      roughness: 0.22,
      metalness: 0.06,
    });
    const morango = new THREE.MeshStandardMaterial({ color: 0xc9322b, roughness: 0.38 });
    const folha = new THREE.MeshStandardMaterial({ color: 0x58763e, roughness: 0.8 });

    const materiais = [massa, recheio, ganache, morango, folha];

    // ---- montagem do bolo --------------------------------------------------
    const cake = new THREE.Group();
    const R = 2;

    /** Empilha as camadas de baixo para cima, devolvendo o topo alcançado. */
    let y = -1.45;
    const camadas: Array<[THREE.Material, number, number]> = [
      [massa, 0.62, R],
      [recheio, 0.2, R * 1.008],
      [massa, 0.62, R],
      [recheio, 0.2, R * 1.008],
      [massa, 0.62, R],
    ];

    for (const [mat, altura, raio] of camadas) {
      const geo = new THREE.CylinderGeometry(raio, raio, altura, 64);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = y + altura / 2;
      cake.add(mesh);
      y += altura;
    }

    // Cobertura no topo, ligeiramente mais larga que o bolo
    const topoAltura = 0.3;
    const topo = new THREE.Mesh(
      new THREE.CylinderGeometry(R * 1.035, R * 1.035, topoAltura, 64),
      ganache,
    );
    topo.position.y = y + topoAltura / 2;
    cake.add(topo);
    const yTopo = y + topoAltura;

    // Pingos escorrendo pela borda — comprimentos irregulares, como calda real
    const comprimentos = [0.9, 0.45, 1.25, 0.6, 1.0, 0.4, 0.8, 1.35, 0.55, 0.95, 0.7, 1.1, 0.5, 0.85];
    comprimentos.forEach((len, i) => {
      const ang = (i / comprimentos.length) * Math.PI * 2;
      const pingo = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, len, 6, 14), ganache);
      pingo.position.set(
        Math.cos(ang) * R * 1.02,
        yTopo - topoAltura / 2 - len / 2 - 0.05,
        Math.sin(ang) * R * 1.02,
      );
      cake.add(pingo);
    });

    // Morangos no topo
    const nMorangos = 6;
    for (let i = 0; i < nMorangos; i++) {
      const ang = (i / nMorangos) * Math.PI * 2 + 0.3;
      const raio = 1.15;
      const grupo = new THREE.Group();

      const fruta = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.62, 20), morango);
      fruta.rotation.x = Math.PI; // ponta para baixo
      fruta.position.y = 0.31;
      grupo.add(fruta);

      const cabinho = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.14, 8), folha);
      cabinho.position.y = 0.63;
      grupo.add(cabinho);

      grupo.position.set(Math.cos(ang) * raio, yTopo, Math.sin(ang) * raio);
      grupo.rotation.y = ang;
      cake.add(grupo);
    }

    // Centraliza o conjunto na origem para girar em torno do próprio eixo
    cake.position.y = -((yTopo + -1.45) / 2) * 0.35;
    scene.add(cake);

    // ---- luzes -------------------------------------------------------------
    scene.add(new THREE.AmbientLight(0xffffff, 1.15));

    const principal = new THREE.DirectionalLight(0xfff4e0, 2.3);
    principal.position.set(4, 6, 5);
    scene.add(principal);

    const contra = new THREE.DirectionalLight(0xe4c579, 1.1);
    contra.position.set(-5, 2.5, -3.5);
    scene.add(contra);

    const brilho = new THREE.PointLight(0xffffff, 18, 22);
    brilho.position.set(-1.6, 3.4, 3.4);
    scene.add(brilho);

    // ---- o bolo olha para o cursor ----------------------------------------
    const alvo = { x: 0, y: 0 };
    const atual = { x: 0, y: 0 };

    const onPointerMove = (e: PointerEvent) => {
      // -1..1 em relação ao centro da janela
      alvo.x = (e.clientX / window.innerWidth) * 2 - 1;
      alvo.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let raf = 0;
    const relogio = new THREE.Clock();

    const animar = () => {
      raf = requestAnimationFrame(animar);

      // Amortecimento: persegue o alvo em vez de saltar até ele
      atual.x += (alvo.x - atual.x) * 0.055;
      atual.y += (alvo.y - atual.y) * 0.055;

      const t = relogio.getElapsedTime();

      // Giro horizontal segue o cursor; vertical inclina de leve, com limite
      cake.rotation.y = atual.x * 0.85 + (prefersReduced ? 0 : Math.sin(t * 0.25) * 0.06);
      cake.rotation.x = THREE.MathUtils.clamp(atual.y * 0.32, -0.28, 0.34);
      cake.rotation.z = -atual.x * 0.05;

      // Flutuação sutil, desligada para quem pediu menos movimento
      cake.position.y = (prefersReduced ? 0 : Math.sin(t * 0.7) * 0.07) - 0.1;

      renderer.render(scene, camera);
    };
    animar();

    // ---- redimensionamento -------------------------------------------------
    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      });
      materiais.forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} aria-hidden="true" className={className} />;
}
