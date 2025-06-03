export function axialToPixel(hex : [number, number], size : number = 1) {
	const q = hex[0]
	const r = hex[1]
	return [(Math.sqrt(3) * q + Math.sqrt(3)/2 * r) , 3./2 * r]
}

export function modulo(dividend : number, divisor : number) {
	return ((dividend % divisor) + divisor) % divisor;
}