<script lang="ts">
	import * as THREE from 'three';
	import { T } from '@threlte/core';
	import { OrbitControls, Outlines } from '@threlte/extras';

    import { createPolyhedron } from '$lib/orb';

	const faceCount: number = 10;

    const polyhedron = createPolyhedron(faceCount);

</script>

<T.PerspectiveCamera
	makeDefault
	position={[0, 1, 2.5]}
	fov={70}
	oncreate={(cameraRef) => {
		cameraRef.lookAt(0, 0, 0);
	}}
>
    <OrbitControls enablePan={false} maxDistance={5}/>
</T.PerspectiveCamera>

<T is={polyhedron} rotation={[0, 0, 0]} position={[0, 0, 0]}>
</T>