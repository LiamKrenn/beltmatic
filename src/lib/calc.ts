// Using a basic A* algorithm to find the least amount of steps to reach a target number

// Performance test values: 4682 - 15 - ['+', '-', '*', '^']
// Current performance - Operation Count = 48k

import { PriorityQueue } from '@datastructures-js/priority-queue';

type QueueItem = {
	value: number;
	steps: number;
	operator: string;
	stepsList: [number, number, string, number][];
};

export function leastSteps(target: number, max_src: number, allowedOperators: string[]) {
	const allowedNumbers = Array.from({ length: max_src }, (_, i) => i + 1).filter(
		(num) => num !== 10 // 10 can't spawn afaik
	);
	const visited = new Set();

	function fValueEvalution(a: QueueItem, b: QueueItem) {
		// TODO: Optimize
		return a.steps - b.steps;
	}

	let queue = new PriorityQueue<QueueItem>(fValueEvalution);
	queue.enqueue({ value: 0, steps: 0, operator: '', stepsList: [] });

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

	let calc_count = 0;

	while (queue.size() > 0) {
		let element = queue.dequeue();
		for (let num of allowedNumbers) {
			for (let operator of allowedOperators) {
        // Skip unnecessary calculations
				if (skipUnnecessaryOperators(num, element.value, operator)) {
					continue;
				}

				let newValue = applyOperator(element.value, num, operator) || -1;
				calc_count++;

        // if the value is way overshooting, skip it (happens quite often with ^)
				if (newValue > target * 1.2 + max_src || newValue === null || visited.has(newValue)) {
					continue;
				}
				visited.add(newValue);
				let newStepsList = element.stepsList.concat([[element.value, num, operator, newValue]]);
				if (newValue === target) {
					console.log('Calculation count: ' + calc_count);
					return newStepsList.slice(1);
				}
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
