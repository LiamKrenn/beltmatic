// Using a basic A* algorithm to find the least amount of steps to reach a target number

// Performance test values: 4682 - 15 - ['+', '-', '*', '^']
// Current performance - Operation Count = 142.9k

import { PriorityQueue } from '@datastructures-js/priority-queue';

export function leastSteps(target: number, max_src: number, allowedOperators: string[]) {
	const allowedNumbers = Array.from({ length: max_src }, (_, i) => i + 1).filter(
		(num) => num !== 10 // 10 can't spawn afaik
	);
	const visited = new Set();
	let queue = new PriorityQueue<{
		value: number;
		steps: number;
		operator: string;
		stepsList: any[];
	}>((a, b) => a.steps - b.steps);

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

	let calc_count = 0;

	queue.enqueue({ value: 0, steps: 0, operator: '', stepsList: [] });
	console.log('init');

	while (queue.size() > 0) {
		let queue_el = queue.dequeue();
		console.log(queue_el);

		if (queue_el.value === target) {
			console.log('Calculation count: ' + calc_count);
			return queue_el.stepsList.slice(1);
		}
		for (let num of allowedNumbers) {
			for (let operator of allowedOperators) {
				if (
					(operator === '+' || operator === '*' || operator === '^') &&
					(queue_el.value > target || num > target)
				) {
					continue;
				}

				if ((operator === '-' || operator === '/') && queue_el.value < target) {
					continue;
				}

				if (num < 0 || queue_el.value < 0) {
					continue;
				}

				if (num === 1 && (operator === '*' || operator === '/' || operator === '^')) {
					continue;
				}

				let newValue = applyOperator(queue_el.value, num, operator) || -1;
				calc_count++;

				if (newValue > target * 1.2 + max_src || newValue === null || visited.has(newValue)) {
					continue;
				}
				visited.add(newValue);
				let newStepsList = queue_el.stepsList.concat([[queue_el.value, num, operator, newValue]]);
				queue.enqueue({
					value: newValue,
					steps: queue_el.steps + 1,
					operator: operator,
					stepsList: newStepsList
				});
			}
		}
	}
	return [];
}
