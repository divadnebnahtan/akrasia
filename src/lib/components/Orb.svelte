<script lang="ts">
	import * as THREE from 'three';
	import { T } from '@threlte/core';
	import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
	import { ConvexHull } from 'three/addons/math/ConvexHull.js';
	import { CameraControls, OrbitControls } from '@threlte/extras';

	const faceCount: number = 10;

	function createPolyhedron(faceCount: number): THREE.Mesh {
		const points = [];
		const goldenAngle = Math.PI * (3 - Math.sqrt(5));

		for (let i = 0; i < faceCount; i++) {
			const y = 1 - (i / (faceCount - 1)) * 2;
			const r = Math.sqrt(1 - y * y);
			const theta = goldenAngle * i;

            const x = Math.cos(theta) * r;
            const z = Math.sin(theta) * r;

			points.push(new THREE.Vector3(x, y, z));
		}
		const hull = new ConvexHull().setFromPoints(points);
        
        console.log(hull);

		const faces = hull.faces;
		const geometry = new ConvexGeometry(points);
		const materials = [];
		for (let i = 0; i < faces.length; i++) {
			geometry.addGroup(i * 3, 3, i);
		}
		for (let i = 0; i < faces.length; i++) {
			let color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
			materials.push(new THREE.MeshBasicMaterial({ color, wireframe: false }));
		}
		return new THREE.Mesh(geometry, materials);
	}

    const polyhedron = createPolyhedron(faceCount);

</script>

<T.PerspectiveCamera
	makeDefault
	position={[0, 1, 5]}
	fov={45}
	oncreate={(cameraRef) => {
		cameraRef.lookAt(0, 0, 0);
	}}
>
    <OrbitControls enablePan={false} minDistance={3} maxDistance={5}/>
</T.PerspectiveCamera>

<T is={polyhedron} rotation={[0, 0, 0]} position={[0, 0, 0]}>
</T>