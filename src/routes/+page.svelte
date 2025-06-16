<script lang="ts">
	import { onMount } from 'svelte';
	import { Settings } from 'lucide-svelte';
	import { base } from '$app/paths';

	let pyodide: any;
	let imgFile: File | null = null;
	let detail = 0.5;
	let thickness = 4;
	let loading = false;
	let showSettings = false;
	let pyodideReady = false;

	let outputs = {
		cleaned: '',
		outer: '',
		full: ''
	};

	onMount(async () => {
		pyodide = await (window as any).loadPyodide({
			indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/',
		});

		await pyodide.loadPackage(['opencv-python']);
		pyodideReady = true;
	});

	async function processImage() {
		if (!imgFile || !pyodide) return;

		loading = true;

		const data = await imgFile.arrayBuffer();
		pyodide.FS.writeFile('in.png', new Uint8Array(data));

		const script = `
import cv2
import numpy as np

image = cv2.imread('in.png')
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

_, mask = cv2.threshold(gray, 250, 255, cv2.THRESH_BINARY)
mask_inv = cv2.bitwise_not(mask)
white_bg = np.full(image.shape, 255, dtype=np.uint8)
fg = cv2.bitwise_and(image, image, mask=mask_inv)
cleaned = cv2.add(fg, cv2.bitwise_and(white_bg, white_bg, mask=mask))
_, buf_cleaned = cv2.imencode('.png', cleaned)
with open('out_cleaned.png', 'wb') as f: f.write(buf_cleaned)

_, bw = cv2.threshold(gray, int(${detail} * 255), 255, cv2.THRESH_BINARY_INV)
contours_ext, _ = cv2.findContours(bw, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
contours_all, _ = cv2.findContours(bw, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

def draw(contours, thickness):
    scale = 3
    h, w = gray.shape
    canvas = np.ones((h*scale, w*scale), dtype=np.uint8) * 255
    scaled_contours = [c * scale for c in contours]
    cv2.drawContours(canvas, scaled_contours, -1, 0, max(1, int(thickness + 0.5)))
    canvas = cv2.resize(canvas, (w, h), interpolation=cv2.INTER_AREA)
    _, buf = cv2.imencode('.png', canvas)
    return buf.tobytes()

outer = draw(contours_ext, ${thickness})
full = draw(contours_all, ${thickness})

with open('out_outer.png', 'wb') as f: f.write(outer)
with open('out_full.png', 'wb') as f: f.write(full)
`;

		await pyodide.runPythonAsync(script);
		['cleaned', 'outer', 'full'].forEach((key) => {
			const buf = pyodide.FS.readFile(`out_${key}.png`);
			outputs[key] = URL.createObjectURL(new Blob([buf], { type: 'image/png' }));
		});

		loading = false;
	}
</script>

{#if pyodideReady}
<main class="min-h-screen bg-gray-800 text-white px-4 py-8">
	<div class="relative max-w-xl mx-auto">
		<button class="absolute top-0 right-0 p-2" on:click={() => (showSettings = !showSettings)}>
			<Settings class="w-6 h-6 text-pink-500 hover:text-pink-400" />
		</button>

		<div class="flex items-center mb-1">
			<img src="{base}/icon.png" alt="Inkerly logo" class="h-10 w-10 rounded-full border-2 border-white mr-2 p-1" />
			<h1 class="text-3xl font-bold text-pink-500">Inkerly</h1>
		</div>
		<p class="text-gray-300 mb-6">Your portable tattoo stencil studio</p>

		{#if showSettings}
		<div class="mb-4 p-4 rounded-md border border-gray-600 bg-gray-700">
			<label class="block text-sm mb-1">Stencil Detail: {Math.round(detail * 100)}%</label>
			<input type="range" min="0" max="1" step="0.01" bind:value={detail} class="w-full mb-3" />

			<label class="block text-sm mb-1">Line Thickness: {thickness.toFixed(1)}px</label>
			<input type="range" min="0.5" max="8" step="0.1" bind:value={thickness} class="w-full" />
		</div>
		{/if}

		<input
			type="file"
			accept="image/*"
			on:change={(e) => (imgFile = e.target.files?.[0] ?? null)}
			class="block w-full text-sm mb-4 text-white bg-gray-700 border border-gray-600 rounded-lg p-2 cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-500"
		/>

		<button
			on:click={processImage}
			disabled={!imgFile || loading}
			class="w-full text-white bg-pink-600 hover:bg-pink-500 font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{loading ? 'Processing...' : 'Generate Stencils'}
		</button>

		<div class="mt-8 space-y-8">
			{#if outputs.cleaned}
			<div>
				<h2 class="text-xl font-semibold mb-2 text-pink-400">Cleaned</h2>
				<img src={outputs.cleaned} alt="Cleaned" class="rounded border border-gray-500" />
				<a href={outputs.cleaned} download="cleaned.png" class="mt-2 inline-block text-pink-400 hover:underline">Download / Open In…</a>
			</div>
			{/if}

			{#if outputs.outer}
			<div>
				<h2 class="text-xl font-semibold mb-2 text-pink-400">Outer Outline</h2>
				<img src={outputs.outer} alt="Outer Outline" class="rounded border border-gray-500" />
				<a href={outputs.outer} download="outer.png" class="mt-2 inline-block text-pink-400 hover:underline">Download / Open In…</a>
			</div>
			{/if}

			{#if outputs.full}
			<div>
				<h2 class="text-xl font-semibold mb-2 text-pink-400">Full Detail</h2>
				<img src={outputs.full} alt="Full Detail" class="rounded border border-gray-500" />
				<a href={outputs.full} download="full.png" class="mt-2 inline-block text-pink-400 hover:underline">Download / Open In…</a>
			</div>
			{/if}
		</div>
	</div>
</main>
{:else}
<div class="flex items-center justify-center min-h-screen bg-gray-800 text-white">
	<div class="text-center">
		<svg class="animate-spin h-12 w-12 text-pink-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
			<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
		</svg>
		<p class="text-pink-400 font-medium">Loading Inkerly stencil engine…</p>
	</div>
</div>
{/if}
