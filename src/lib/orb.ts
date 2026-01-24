import * as THREE from 'three';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';

export function generateCanvasMaterial(face: number, faces: number): THREE.Material {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

    const gradient: CanvasGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height); // Diagonal gradient

    gradient.addColorStop(0.3, '#FF0000');   // Red at the start
    gradient.addColorStop(0.5, '#FFFF00'); // Yellow in the middle
    gradient.addColorStop(0.7, '#00FF00');   // Blue at the end
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = `black`;
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Face ${face + 1}`, canvas.width / 2, canvas.height / 2);


    const texture: THREE.CanvasTexture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
}

export function generateMaterials(faceCount: number): THREE.Material[] {
	const materials: THREE.Material[] = [];
	for (let i: number = 0; i < faceCount; i++) {
		materials.push(generateCanvasMaterial(i, faceCount));
	}
	return materials;
}

export function fibonacciSpherePoints(faceCount: number): THREE.Vector3[] {
	const points: THREE.Vector3[] = [];
	const goldenAngle: number = Math.PI * (3 - Math.sqrt(5));

	for (let i: number = 0; i < faceCount; i++) {
		const y: number = 1 - (i / (faceCount - 1)) * 2;
		const r: number = Math.sqrt(1 - y * y);
		const theta: number = goldenAngle * i;

		const x: number = Math.cos(theta) * r;
		const z: number = Math.sin(theta) * r;

		points.push(new THREE.Vector3(x, y, z));
	}

	return points;
}

export function triangleCircumcenter(
	a: THREE.Vector3,
	b: THREE.Vector3,
	c: THREE.Vector3
): THREE.Vector3 {
	const ac: THREE.Vector3 = c.clone().sub(a);
	const ab: THREE.Vector3 = b.clone().sub(a);

	const abXac: THREE.Vector3 = new THREE.Vector3().crossVectors(ab, ac);
	const denominator: number = 2 * abXac.lengthSq();
	const ab2: number = ab.lengthSq();
	const ac2: number = ac.lengthSq();

	const term1: THREE.Vector3 = ac.clone().multiplyScalar(ab2).cross(abXac);
	const term2: THREE.Vector3 = ab.clone().multiplyScalar(ac2).cross(abXac);

	return a.clone().add(term1.sub(term2).divideScalar(denominator));
}

export function createPolyhedron(faceCount: number) {
	const sites: THREE.Vector3[] = fibonacciSpherePoints(faceCount);
	const hull: ConvexGeometry = new ConvexGeometry(sites);

	const cellMap: Map<number, THREE.Vector3[]> = new Map();
	sites.forEach((_, index) => cellMap.set(index, []));

	const pos: THREE.BufferAttribute = hull.attributes.position;
	const faces: number = pos.count / 3;

	for (let i: number = 0; i < faces; i++) {
		const a: THREE.Vector3 = new THREE.Vector3().fromBufferAttribute(pos, i * 3);
		const b: THREE.Vector3 = new THREE.Vector3().fromBufferAttribute(pos, i * 3 + 1);
		const c: THREE.Vector3 = new THREE.Vector3().fromBufferAttribute(pos, i * 3 + 2);

		const center: THREE.Vector3 = triangleCircumcenter(a, b, c).normalize();

		[a, b, c].forEach((v) => {
			let best: number = 0;
			let bestDot: number = -Infinity;
			sites.forEach((s, idx) => {
				const d: number = s.clone().normalize().dot(v.clone().normalize());
				if (d > bestDot) {
					bestDot = d;
					best = idx;
				}
			});
			cellMap.get(best).push(center);
		});
	}

	const root: THREE.Group = new THREE.Group();
	const materials: THREE.Material[] = generateMaterials(faceCount);

	cellMap.forEach((points, idx) => {
		if (points.length < 3) return;

		const site: THREE.Vector3 = sites[idx].clone().normalize();

		const refVector: THREE.Vector3 = Math.abs(site.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
		const axisX: THREE.Vector3 = refVector.cross(site).normalize();
		const axisY: THREE.Vector3 = site.clone().cross(axisX);
		points.sort((p1, p2) => {
			const a1: number = Math.atan2(p1.dot(axisY), p1.dot(axisX));
			const a2: number = Math.atan2(p2.dot(axisY), p2.dot(axisX));
			return a1 - a2;
		});

		const geom: THREE.BufferGeometry = new THREE.BufferGeometry();
		const verts: number[] = [];
		const uvs: number[] = [];

		// Project points onto a 2D plane for UV mapping
		for (let i = 0; i < points.length; i++) {
			const u: number = (points[i].dot(axisX) + 1) / 2;
			const v: number = (points[i].dot(axisY) + 1) / 2;
			
			if (i === 0) continue;
			if (i === points.length - 1) continue;
			
			// Triangle fan from first point
			uvs.push(
				(points[0].dot(axisX) + 1) / 2, (points[0].dot(axisY) + 1) / 2,
				(points[i].dot(axisX) + 1) / 2, (points[i].dot(axisY) + 1) / 2,
				(points[i + 1].dot(axisX) + 1) / 2, (points[i + 1].dot(axisY) + 1) / 2
			);
			
			verts.push(
				points[0].x,
				points[0].y,
				points[0].z,
				points[i].x,
				points[i].y,
				points[i].z,
				points[i + 1].x,
				points[i + 1].y,
				points[i + 1].z
			);
		}

		geom.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
		geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
		geom.computeVertexNormals();
		const mesh: THREE.Mesh = new THREE.Mesh(geom, materials[idx]);

		const faceGroup: THREE.Group = new THREE.Group();
		faceGroup.userData.siteIndex = idx;
		faceGroup.add(mesh);

		root.add(faceGroup);
	});

	return root;
}
