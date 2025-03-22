type QueueItem = {
	value: number;
	steps: number;
	parent: QueueItem | null;
	operator: string | null;
	operand: number | null;
};

export function leastSteps(target: number, max_src: number, allowedOperators: string[]) {
	const allowedNumbers = Array.from({ length: max_src }, (_, i) => i + 1).filter(
		(num) => num !== 10
	);

	const forwardVisited = new Map<number, QueueItem>();
	const backwardVisited = new Map<number, QueueItem>();

	const forwardQueue: QueueItem[] = [
		{ value: 0, steps: 0, parent: null, operator: null, operand: null }
	];
	forwardVisited.set(0, forwardQueue[0]);

	const backwardQueue: QueueItem[] = [
		{ value: target, steps: 0, parent: null, operator: null, operand: null }
	];
	backwardVisited.set(target, backwardQueue[0]);

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
				return currentValue % num === 0 ? currentValue / num : null;
			case '^':
				const root = Math.pow(currentValue, 1 / num);
				return Number.isInteger(root) && root >= 1 && root <= max_src && root !== 10 ? root : null;
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

	function reconstructPath(
		meetNode: QueueItem,
		isForward: boolean
	): [number, number, string, number][] {
		const path: [number, number, string, number][] = [];
		let current: QueueItem | null = meetNode;
		while (current && current.parent) {
			path.push([current.parent.value, current.operand!, current.operator!, current.value]);
			current = current.parent;
		}
		return isForward ? path.reverse() : path;
	}

	while (forwardQueue.length > 0 && backwardQueue.length > 0) {
		// Process forward queue
		let forwardSize = forwardQueue.length;
		for (let i = 0; i < forwardSize; i++) {
			const current = forwardQueue.shift()!;
			for (const num of allowedNumbers) {
				for (const op of allowedOperators) {
					if (skipForward(current.value, op, num)) continue;
					const newValue = applyOperator(current.value, num, op);
					calc_count++;
					if (newValue === null || newValue < 0 || newValue > target + max_src) continue;
					if (forwardVisited.has(newValue)) continue;

					const newNode: QueueItem = {
						value: newValue,
						steps: current.steps + 1,
						parent: current,
						operator: op,
						operand: num
					};
					forwardVisited.set(newValue, newNode);
					forwardQueue.push(newNode);

					if (backwardVisited.has(newValue)) {
						const forwardPath = reconstructPath(newNode, true);
						const backwardNode = backwardVisited.get(newValue)!;
						const backwardPath = reconstructPath(backwardNode, false).reverse();
						console.log('Calculation count: ' + calc_count);
						return forwardPath.concat(backwardPath);
					}
				}
			}
		}

		// Process backward queue
		let backwardSize = backwardQueue.length;
		for (let i = 0; i < backwardSize; i++) {
			const current = backwardQueue.shift()!;
			for (const num of allowedNumbers) {
				for (const op of allowedOperators) {
					if (skipBackward(current.value, op, num)) continue;
					const prevValue = reverseOperator(current.value, num, op);
					calc_count++;
					if (prevValue === null || prevValue < 0) continue;
					if (backwardVisited.has(prevValue)) continue;

					const newNode: QueueItem = {
						value: prevValue,
						steps: current.steps + 1,
						parent: current,
						operator: op,
						operand: num
					};
					backwardVisited.set(prevValue, newNode);
					backwardQueue.push(newNode);

					if (forwardVisited.has(prevValue)) {
						const backwardPath = reconstructPath(newNode, false).reverse();
						const forwardNode = forwardVisited.get(prevValue)!;
						const forwardPath = reconstructPath(forwardNode, true);
						console.log('Calculation count: ' + calc_count);
						return forwardPath.concat(backwardPath);
					}
				}
			}
		}
	}

	return [];
}
