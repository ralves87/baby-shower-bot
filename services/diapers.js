export function distributeDiapers(guests, diapers) {
  const result = [];
  const sizes = Object.keys(diapers);
  let sizeIndex = 0;

  for (let i = 0; i < guests.length; i++) {
    let attempts = 0;

    while (diapers[sizes[sizeIndex]] === 0 && attempts < sizes.length) {
      sizeIndex = (sizeIndex + 1) % sizes.length;
      attempts++;
    }

    if (diapers[sizes[sizeIndex]] === 0) {
      console.warn("Not enough diapers for all guests!");
      break;
    }

    const assignedSize = sizes[sizeIndex];
    result.push({ 
      ...guests[i], 
      diaper: assignedSize, 
      status: "pending", 
      sent: false 
    });

    diapers[assignedSize]--;
    sizeIndex = (sizeIndex + 1) % sizes.length;
  }

  return result;
}