<script lang="ts">
	import { leastSteps } from '$lib/calc_opt3';
	import { RefreshCw } from 'lucide-svelte';

	let targetNumber: any;
	let highestExtractionSource: any;
	let operators = {
		plus: true,
		minus: true,
		multiply: true,
		divide: false,
		exponentiate: true
	};
	let calculating = false;

	let result: any[] = [];

	async function calculate() {
		result = [];
		calculating = true;
		let operator_array = [];
		if (operators.plus) operator_array.push('+');
		if (operators.minus) operator_array.push('-');
		if (operators.multiply) operator_array.push('*');
		if (operators.divide) operator_array.push('/');
		if (operators.exponentiate) operator_array.push('^');

		result = leastSteps(targetNumber, highestExtractionSource, operator_array);
		calculating = false;
	}
</script>

<title>Beltmatic Calculator</title>
<div class="container h-full mx-auto flex flex-col justify-start pt-16 items-center">
	<div>
		<h1 class="h1">Beltmatic Calculator</h1>
		<p class=" mt-1 mb-4">
			by <a class="underline" target="_blank" href="https://github.com/LiamKrenn">Liam Krenn</a>
		</p>
		<div class="flex items-center mt-4 w-[70%]">
			<p class=" mb-1 mr-2 grow flex-1">Target Number:</p>
			<input
				bind:value={targetNumber}
				class="input h-10 grow-[0.7] flex-1"
				type="number"
				placeholder="69"
			/>
		</div>
		<div class="flex items-center mt-1 w-[70%]">
			<p class=" mb-1 mr-2 grow flex-1">Highest Extraction Source:</p>
			<input
				bind:value={highestExtractionSource}
				class="input h-10 grow-[0.7] flex-1"
				type="number"
				placeholder="9"
			/>
		</div>
		<p class="mt-4 grow flex-1">Operators:</p>
		<div class="flex items-center mt-1 w-[70%]">
			<input
				bind:checked={operators.plus}
				class="input h-4 w-4 rounded-sm"
				type="checkbox"
				disabled
				placeholder="9"
			/>
			<p class=" ml-2 grow flex-1">Plus</p>
		</div>
		<div class="flex items-center mt-1 w-[70%]">
			<input
				bind:checked={operators.minus}
				class="input h-4 w-4 rounded-sm"
				type="checkbox"
				placeholder="9"
			/>
			<p class=" ml-2 grow flex-1">Minus</p>
		</div>
		<div class="flex items-center mt-1 w-[70%]">
			<input
				bind:checked={operators.multiply}
				class="input h-4 w-4 rounded-sm"
				type="checkbox"
				placeholder="9"
			/>
			<p class=" ml-2 grow flex-1">Multiply</p>
		</div>
		<div class="flex items-center mt-1 w-[70%]">
			<input
				bind:checked={operators.exponentiate}
				class="input h-4 w-4 rounded-sm"
				type="checkbox"
				placeholder="9"
			/>
			<p class=" ml-2 grow flex-1">Exponentiate</p>
		</div>
		<div class="flex items-center mt-1 w-[70%]">
			<input
				bind:checked={operators.divide}
				class="input h-4 w-4 rounded-sm"
				type="checkbox"
				disabled
				placeholder="9"
			/>
			<p class=" ml-2 grow flex-1">Divide</p>
		</div>
		<p class="opacity-60">
			(Divide is slow, and useless in the game and due to<br /> the way the algorithm works, will never
			be used)
		</p>

		<button on:click={calculate} class="btn variant-ghost-primary mt-4 w-full">Calculate</button>
		<p class="opacity-60 text-sm mt-1">Can be laggy, with very very large numbers.</p>
		<p class="opacity-60 text-sm">
			If you have performance suggestions, feel free to <a
				class="underline"
				target="_blank"
				href="https://github.com/LiamKrenn/beltmatic/pulls">open a PR.</a
			>
		</p>

		{#if result.length > 0}
			<h3 class="h3 mt-4 mb-1">Result:</h3>
			<h4 class="h4 !font-normal">Extractors Needed:</h4>
			<div class="card variant-glass-primary p-2 my-1 flex items-center justify-center">
				{result.map((subArray) => subArray[1]).join(' - ')}
			</div>
			<h4 class="h4 !font-normal">Steps:</h4>
			{#each result.length == 1 ? result : result.slice(1) as step}
				<div class="card p-2 my-1 flex items-center justify-center">
					<p>{step[0]} {step[2]} {step[1]} = {step[3]}</p>
				</div>
			{/each}
		{:else if calculating}
			<div class="flex items-center mt-2">
				<RefreshCw class="animate-spin h-6 w-6 mr-2" />
				<p>calculating.. be patient</p>
			</div>
		{/if}
	</div>
</div>
