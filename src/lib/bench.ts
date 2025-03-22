// Import both the original and optimized implementations
import { leastSteps as originalLeastSteps } from './calc';
import { leastSteps as optimized1LeastSteps } from './calc_opt';
import { leastSteps as optimized2LeastSteps } from './calc_opt2';
import { leastSteps as optimized3LeastSteps } from './calc_opt3';

// Define test cases with varying complexity
const testCases = [
	// {
	// 	name: 'Small Target',
	// 	target: 42,
	// 	max_src: 10,
	// 	operators: ['+', '-', '*', '^'] as const,
	// 	reuse: false
	// },
	// {
	// 	name: 'Medium Target',
	// 	target: 1337,
	// 	max_src: 12,
	// 	operators: ['+', '-', '*', '^'] as const,
	// 	reuse: false
	// },
	// {
	// 	name: 'Large Target',
	// 	target: 4682,
	// 	max_src: 15,
	// 	operators: ['+', '-', '*', '^'] as const,
	// 	reuse: false
	// },
	// {
	// 	name: 'Reuse Values',
	// 	target: 999,
	// 	max_src: 9,
	// 	operators: ['+', '*'] as const,
	// 	reuse: true
	// },
	// {
	// 	name: 'Division Focused',
	// 	target: 123,
	// 	max_src: 20,
	// 	operators: ['/', '-', '+'] as const,
	// 	reuse: false
	// },
	{
		name: 'Huge',
		target: 123456789,
		max_src: 11,
		operators: ['+', '-', '*', '^'] as const,
		reuse: false
	}
];

// Benchmark function to test algorithm performance
function benchmark(
	algorithm: Function,
	testCase: any
): {
	time: number;
	steps: any[];
	calculationCount: number;
} {
	// Capture console.log for calculation count
	const originalLog = console.log;
	let calcCount = 0;

	console.log = function (message) {
		if (message && message.toString().includes('Calculation count:')) {
			calcCount = parseInt(message.toString().split(':')[1].trim());
		}
		// Uncomment to see logs during benchmark
		// originalLog(message);
	};

	const startTime = performance.now();

	// Run the algorithm
	const result = algorithm(testCase.target, testCase.max_src, testCase.operators, testCase.reuse);

	const endTime = performance.now();

	// Restore console.log
	console.log = originalLog;

	return {
		time: endTime - startTime,
		steps: result,
		calculationCount: calcCount
	};
}

// Run all benchmarks
async function runBenchmarks() {
	console.log('Running benchmarks...\n');
	console.log('| Test Case | Algorithm | Time (ms) | Steps Found | Calculations |');
	console.log('|-----------|-----------|-----------|-------------|--------------|');

	for (const testCase of testCases) {
		// Set a timeout to ensure UI responsiveness
		await new Promise((resolve) => setTimeout(resolve, 0));

		try {
			const optimized1Result = benchmark(optimized1LeastSteps, testCase);
			console.log(
				`| ${testCase.name.padEnd(9)} | Optimized1  | ${optimized1Result.time.toFixed(2).padEnd(9)} | ${(optimized1Result.steps.length || 'None').toString().padEnd(11)} | ${optimized1Result.calculationCount.toString().padEnd(12)} |`
			);

			const optimized2Result = benchmark(optimized2LeastSteps, testCase);
			console.log(
				`| ${testCase.name.padEnd(9)} | Optimized2  | ${optimized2Result.time.toFixed(2).padEnd(9)} | ${(optimized2Result.steps.length || 'None').toString().padEnd(11)} | ${optimized2Result.calculationCount.toString().padEnd(12)} |`
			);

			const optimized3Result = benchmark(optimized3LeastSteps, testCase);
			console.log(
				`| ${testCase.name.padEnd(9)} | Optimized3  | ${optimized3Result.time.toFixed(2).padEnd(9)} | ${(optimized3Result.steps.length || 'None').toString().padEnd(11)} | ${optimized3Result.calculationCount.toString().padEnd(12)} |`
			);

			// Run bidirectional algorithm for comparison
			// const bidirectionalResult = benchmark(bidirectionalLeastSteps, testCase);

			// console.log(
			// 	`| ${testCase.name.padEnd(9)} | Bidir      | ${bidirectionalResult.time.toFixed(2).padEnd(9)} | ${(bidirectionalResult.steps.length || 'None').toString().padEnd(11)} | ${bidirectionalResult.calculationCount.toString().padEnd(12)} |`
			// );

			// Calculate improvement
			const timeImprovement =
				optimized1Result.time > 0
					? (
							((optimized1Result.time - optimized2Result.time) / optimized1Result.time) *
							100
						).toFixed(1)
					: 'N/A';

			const calcImprovement =
				optimized1Result.calculationCount > 0
					? (
							((optimized1Result.calculationCount - optimized2Result.calculationCount) /
								optimized1Result.calculationCount) *
							100
						).toFixed(1)
					: 'N/A';

			console.log(
				`\n| ${testCase.name.padEnd(9)} | v1-v2 Improvement| ${timeImprovement}% time, ${calcImprovement}% calculations |`
			);

			const time3Improvement =
				optimized2Result.time > 0
					? (
							((optimized2Result.time - optimized3Result.time) / optimized2Result.time) *
							100
						).toFixed(1)
					: 'N/A';

			const calc3Improvement =
				optimized3Result.calculationCount > 0
					? (
							((optimized2Result.calculationCount - optimized3Result.calculationCount) /
								optimized2Result.calculationCount) *
							100
						).toFixed(1)
					: 'N/A';

			console.log(
				`| ${testCase.name.padEnd(9)} | v2-v3 Improvement| ${time3Improvement}% time, ${calc3Improvement}% calculations |\n`
			);
		} catch (error) {
			console.error(`Error benchmarking ${testCase.name}:`, error);
		}
	}

	console.log('\nBenchmark complete!');
}

// Export functions for use
export { runBenchmarks, testCases };

// Main execution - run benchmarks when file is executed directly
if (require.main === module) {
	runBenchmarks();
}
