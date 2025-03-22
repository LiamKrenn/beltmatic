type QueueItem = {
	value: number;
	steps: number;
	stepsList: [number, number, string, number][];
};

export function leastSteps(
	target: number,
	max_src: number,
	allowedOperators: string[],
	reuse_generated_values: boolean = false
) {
	const allowedNumbers = Array.from({ length: max_src }, (_, i) => i + 1).filter(
		(num) => num !== 10
	);

	const forwardVisited = new Map<number, QueueItem>();
	const backwardVisited = new Map<number, QueueItem>();

	const forwardQueue: QueueItem[] = [{ value: 0, steps: 0, stepsList: [] }];
	forwardVisited.set(0, { value: 0, steps: 0, stepsList: [] });

	const backwardQueue: QueueItem[] = [{ value: target, steps: 0, stepsList: [] }];
	backwardVisited.set(target, { value: target, steps: 0, stepsList: [] });

	let calc_count = 0;

	function applyOperator(a: number, b: number, operator: string): number | null {
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

	function reverseOperator(currentValue: number, num: number, operator: string): number | null {
		switch (operator) {
			case '+':
				return currentValue - num;
			case '-':
				return currentValue + num;
			case '*':
				if (currentValue % num !== 0) return null;
				return currentValue / num;
			case '^':
				const root = Math.pow(currentValue, 1 / num);
				if (Number.isInteger(root) && root >= 1 && root <= max_src && root !== 10) {
					return root;
				}
				return null;
			default:
				return null;
		}
	}

	function skipForward(value: number, operator: string, num: number): boolean {
		if (operator === '+' && (value > target || num > target - value)) return true;
		if (operator === '*' && (value > target || num > target / value)) return true;
		if (operator === '^' && (value > target || num > Math.log(target) / Math.log(value)))
			return true;
		if ((operator === '-' || operator === '/') && value < target) return true;
		if (num === 1 && (operator === '*' || operator === '^')) return true; // Skip no-ops
		return false;
	}

	function skipBackward(value: number, operator: string, num: number): boolean {
		if (operator === '-' && value < 0) return true;
		if (operator === '/' && num === 1) return true; // Skip division by 1
		if (operator === '^' && (value < 1 || num < 1)) return true;
		return false;
	}

	while (forwardQueue.length > 0 && backwardQueue.length > 0) {
		// Process forward queue
		let forwardSize = forwardQueue.length;
		for (let i = 0; i < forwardSize; i++) {
			const element = forwardQueue.shift()!;

			const numbers = reuse_generated_values
				? element.stepsList.map((step) => step[3]).concat(allowedNumbers)
				: allowedNumbers;

			for (const num of numbers) {
				for (const operator of allowedOperators) {
					if (skipForward(element.value, operator, num)) continue;
					const newValue = applyOperator(element.value, num, operator);
					calc_count++;
					if (newValue === null || newValue < 0 || newValue > target + max_src) continue;
					if (forwardVisited.has(newValue)) continue;

					const newStepsList = [
						...element.stepsList,
						[element.value, num, operator, newValue] as [number, number, string, number]
					];
					const newItem = { value: newValue, steps: element.steps + 1, stepsList: newStepsList };
					forwardVisited.set(newValue, newItem);
					forwardQueue.push(newItem);

					if (backwardVisited.has(newValue)) {
						const forwardPath = newItem.stepsList;
						const backwardItem = backwardVisited.get(newValue)!;
						const backwardPath = backwardItem.stepsList;

						const convertedBackwardPath = backwardPath
							.slice()
							.reverse()
							.map((step) => {
								const [current, n, op, prev] = step;
								return [prev, n, op, current] as [number, number, string, number];
							});

						const fullPath = forwardPath.concat(convertedBackwardPath);
						console.log('Calculation count: ' + calc_count);
						return fullPath;
					}
				}
			}
		}

		// Process backward queue
		let backwardSize = backwardQueue.length;
		for (let i = 0; i < backwardSize; i++) {
			const element = backwardQueue.shift()!;

			for (const num of allowedNumbers) {
				for (const operator of allowedOperators) {
					if (skipBackward(element.value, operator, num)) continue;
					const previousValue = reverseOperator(element.value, num, operator);
					calc_count++;
					if (previousValue === null || previousValue < 0) continue;
					if (backwardVisited.has(previousValue)) continue;

					const newStepsList = [
						...element.stepsList,
						[element.value, num, operator, previousValue] as [number, number, string, number]
					];
					const newItem = {
						value: previousValue,
						steps: element.steps + 1,
						stepsList: newStepsList
					};
					backwardVisited.set(previousValue, newItem);
					backwardQueue.push(newItem);

					if (forwardVisited.has(previousValue)) {
						const forwardItem = forwardVisited.get(previousValue)!;
						const forwardPath = forwardItem.stepsList;
						const backwardPath = newItem.stepsList;

						const convertedBackwardPath = backwardPath
							.slice()
							.reverse()
							.map((step) => {
								const [current, n, op, prev] = step;
								return [prev, n, op, current] as [number, number, string, number];
							});

						const fullPath = forwardPath.concat(convertedBackwardPath);
						console.log('Calculation count: ' + calc_count);
						return fullPath;
					}
				}
			}
		}
	}

	return [];
}
