// Using a basic A* algorithm to find the least amount of steps to reach a target number

// Performance test values: 4682 - 15 - ['+', '-', '*', '^']
// Current performance - Operation Count = 8.8k

import { PriorityQueue } from '@datastructures-js/priority-queue';

type QueueItem = {
	value: number;
	steps: number;
	operator: string;
	stepsList: [number, number, string, number][];
};

export function leastSteps(
	target: number,
	max_src: number,
	allowedOperators: string[],
	reuse_generated_values: boolean = false
) {
	// Allowed numbers are 1 to max_src, excluding 10, as it can't spawn
	const allowedNumbers = Array.from({ length: max_src }, (_, i) => i + 1).filter(
		(num) => num !== 10
	);

	function fValueEvalution(a: QueueItem, b: QueueItem) {
		// TODO: Optimize
		// The idea is to prioritize the values that are closer to the target
		// 2 is a magic number that seems to work well, with lower values (0-50k)
		// But with higher values (200k) it seems like 1.5 is better
		let a_dif = (1 - Math.abs(target - a.value) / target) * 2;
		let b_dif = (1 - Math.abs(target - b.value) / target) * 2;
		return a.steps - a_dif - (b.steps - b_dif);
	}

	const visited = new Set();
	let queue = new PriorityQueue<QueueItem>(fValueEvalution);
	queue.enqueue({ value: 0, steps: 0, operator: '', stepsList: [] });
	let calc_count = 0;

	function applyOperator(a: number, b: number, operator: string) {
		switch (operator) {
			case '+':
				return a + b;
			case '-':
				return a - b;
			case '*':
				return a * b;
			case '/':
				return b !== 0 ? a / b : null;
			case '^':
				return Math.pow(a, b);
			default:
				return null;
		}
	}

	function skipUnnecessaryOperators(value: number, currentValue: number, operator: string) {
		// TODO: This could also be optimized, but there are bigger performance improvements in fValueEvalution()
		// Skip if the value is larger than the target and the operator is +, *, or ^
		if (
			(operator === '+' || operator === '*' || operator === '^') &&
			(currentValue > target || value > target)
		) {
			return true;
		}

		// Skip if the value is smaller than the target and the operator is - or /
		if ((operator === '-' || operator === '/') && currentValue < target) {
			return true;
		}

		// Skip if the value is negative
		if (value < 0 || currentValue < 0) {
			return true;
		}

		// Skip if the value is 1 and the operator is *, /, or ^
		if (value === 1 && (operator === '*' || operator === '/' || operator === '^')) {
			return true;
		}
	}

	while (queue.size() > 0) {
		let element = queue.dequeue();

		const numbers = reuse_generated_values
			? element.stepsList.map((step) => step[3]).concat(allowedNumbers)
			: allowedNumbers;

		for (let num of numbers) {
			// element.value is the current value
			// num will be applied to the current value with the operator
			// example: element.value - num = newValue
			for (let operator of allowedOperators) {
				// Skip unnecessary calculations
				if (skipUnnecessaryOperators(num, element.value, operator)) {
					continue;
				}

				let newValue = applyOperator(element.value, num, operator) || -1;
				calc_count++;

				// if the value is way overshooting, skip it (happens quite often with ^)
				// or if the value is negative, or if the value has already been visited
				//
				// target + max_src is to ensure minus is viable, and ensures performance
				// but this makes division useless
				if (newValue > target + max_src || newValue < 0 || visited.has(newValue)) {
					continue;
				}

				visited.add(newValue);
				let newStepsList = element.stepsList.concat([[element.value, num, operator, newValue]]);

				// If the new value is the target, return the steps list
				if (newValue === target) {
					console.log('Calculation count: ' + calc_count);
					return newStepsList;
				}

				// Add the new value to the queue
				queue.enqueue({
					value: newValue,
					steps: element.steps + 1,
					operator: operator,
					stepsList: newStepsList
				});
			}
		}
	}
	return [];
}
