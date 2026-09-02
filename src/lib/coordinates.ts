export function normalizePointer(
  rect: Pick<DOMRect, "left" | "top" | "width" | "height">,
  clientX: number,
  clientY: number
) {
  return { x: (clientX - rect.left) / rect.width, y: (clientY - rect.top) / rect.height }
}
