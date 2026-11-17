<script lang="ts">
    import * as config from '$lib/config';
    // import Orb from '$lib/components/Orb.svelte';
    // import Wizard from '$lib/components/Wizard.svelte';

    // import { Canvas } from '@threlte/core';
    // import * as THREE from 'three';

    export let data;
</script>

<svelte:head>
    <title>{config.siteName}</title>
    <meta name="description" content={config.siteDescription} />
    
    <meta property="og:locale" content="en_AU" />

    <meta name="og:type" content="website" />
	<meta name="og:site_name" content={config.siteName} />

	<meta name="og:title" content={config.siteName} />
	<meta name="og:description" content={config.siteDescription} />
	<meta name="og:url" content={config.siteUrl} />
</svelte:head>

<div id="container" class="w-full h-full fixed top-0 left-0 overflow-hidden">
    <!-- <Wizard />
    <Canvas toneMapping={THREE.NoToneMapping}>
        <Orb />
    </Canvas> -->

<ul>
	{#each data.posts as post}
		<li>
			<a href={`/blog/${post.slug}`}>
				{post.slug.replaceAll('-', ' ')}
			</a>
		</li>
	{/each}
</ul>
</div>

<style>
    #container {
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
        -moz-user-select: -moz-none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
</style>