// @ts-nocheck

// Based on https://info.otypes.de/beltmatic/
// a few improvements, if you have any suggestions, open a PR

// Performance test values 4682 - 15 - ['+', '-', '*', '^']

export function leastSteps(target, max_src, allowedOperators) {
	const allowedNumbers = Array.from({ length: max_src }, (_, i) => i + 1).filter(
		(num) => num !== 10 // 10 can't spawn afaik
	);
	const visited = new Set();
	let queue = [[0, 0, []]];

	function applyOperator(a, b, operator) {
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
				return a > 0 && b >= 0 ? Math.pow(a, b) : null;
			default:
				return null;
		}
	}
	let i = 0;

  let calc_count = 0;
	while (queue.length > 0) {
		i++;
		if (i > 9999999) {
			return stepsList.slice(1);
		}
		let [currentValue, steps, stepsList] = queue.shift();
		if (currentValue === target) {
      console.log(calc_count);
			return stepsList.slice(1);
		}
		for (let num of allowedNumbers) {
			for (let operator of allowedOperators) {
				if (
					(operator === '+' || operator === '*' || operator === '^') &&
					(currentValue > target || num > target)
				) {
					continue;
				}

        if ((operator === '-' || operator === '/') && (currentValue < target)) {
          continue;
        }

				if (num < 0 || currentValue < 0) {
					continue;
				}

        if (num === 1 && (operator === '*' || operator === '/' || operator === '^')) {
          continue;
        }

				let newValue = applyOperator(currentValue, num, operator);
        calc_count++;

				if (newValue > (target * 1.2 + max_src) || newValue === null || visited.has(newValue)) {
					continue;
				}
				if (newValue !== null && !visited.has(newValue)) {
					visited.add(newValue);
					let newStepsList = stepsList.concat([[currentValue, num, operator, newValue]]);
					queue.push([newValue, steps + 1, newStepsList]);
				}
			}
		}
	}
	return [];
}
