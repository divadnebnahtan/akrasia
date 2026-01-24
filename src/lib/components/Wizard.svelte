<script lang="ts">
    import { onMount } from 'svelte';
	import * as config from '$lib/config';

    const EYEBALL_RADIUS = config.wizardEyeballRadius;
    
    let eyesElement: HTMLImageElement;
    let eyeOffsetX = 0;
    let eyeOffsetY = 0;

    onMount(() => {
        const updateEyePosition = (clientX: number, clientY: number) => {
            if (!eyesElement) return;

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const deltaX = clientX - centerX;
            const deltaY = clientY - centerY;

            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            const distanceMapped = (distance / Math.sqrt((centerX * centerX) + (centerY * centerY))) * EYEBALL_RADIUS;

            const angle = Math.atan2(deltaY, deltaX);
            eyeOffsetX = Math.cos(angle) * distanceMapped;
            eyeOffsetY = Math.sin(angle) * distanceMapped;

        };

        const handleMouseMove = (e: MouseEvent) => {
            updateEyePosition(e.clientX, e.clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                updateEyePosition(touch.clientX, touch.clientY);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    });
</script>

<div id="wizard-background">
    <img 
        src="/2eyes.png" 
        alt="Eyes" 
        id="eyes" 
        bind:this={eyesElement}
        style="transform: translate({eyeOffsetX}px, {eyeOffsetY}px);"
    />
</div>

<style>
    #wizard-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('/wizard2.png'), url('/stars.png');
        background-size: cover, contain;
        background-position: center, center;
        pointer-events: none;
    }

    #eyes {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        pointer-events: none;
        user-select: none;
        transition: transform 0.2s linear;
    }
</style>
