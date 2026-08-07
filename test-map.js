try {
  const map = new Map(undefined);
  console.log("SUCCESS:", map.size);
} catch (e) {
  console.log("ERROR map undefined:", e.message);
}

try {
  let profile = null;
  const map2 = new Map(profile?.inventory.map(i => [i.bloodGroup, i.units]));
  console.log("SUCCESS2");
} catch (e) {
  console.log("ERROR profile null:", e.message);
}
