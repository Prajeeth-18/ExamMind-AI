export function shouldCapture({
  detected,
  sharp,
  lighting,
  stable,
}) {

  return detected && sharp && lighting && stable;

}