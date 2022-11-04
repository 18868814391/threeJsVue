function getRotationMatrix(start, axis, theta) {
  // start, axis: THREE.Vector3
  // Theta: float
  var x = start.x;
  var y = start.y;
  var z = start.z;
  var uUn = axis.x;
  var vUn = axis.y;
  var wUn = axis.z;
  var l = Math.sqrt(uUn*uUn + vUn*vUn + wUn*wUn);
  // In this instance we normalize the direction vector.
  var u = uUn / l;
  var v = vUn / l;
  var w = wUn / l;
  // Set some intermediate values.
  var u2 = u * u;
  var v2 = v * v;
  var w2 = w * w;
  var cosT = Math.cos(theta);
  var oneMinusCosT = 1 - cosT;
  var sinT = Math.sin(theta);

  var rotationMatrix = new Array(16);

  rotationMatrix[0] = u2 + (v2 + w2) * cosT;
  rotationMatrix[1] = u * v * oneMinusCosT + w * sinT;
  rotationMatrix[2] = u * w * oneMinusCosT - v * sinT;
  rotationMatrix[3] = 0;

  rotationMatrix[4] = u * v * oneMinusCosT - w * sinT;
  rotationMatrix[5] = v2 + (u2 + w2) * cosT;
  rotationMatrix[6] = v * w * oneMinusCosT + u * sinT;
  rotationMatrix[7] = 0;

  rotationMatrix[8] = u * w * oneMinusCosT + v * sinT;
  rotationMatrix[9] = v * w * oneMinusCosT - u * sinT;
  rotationMatrix[10] = w2 + (u2 + v2) * cosT;
  rotationMatrix[11] = 0;

  rotationMatrix[12] = (x * (v2 + w2) - u * (y * v + z * w)) * oneMinusCosT + (y * w - z * v) * sinT;
  rotationMatrix[13] = (y * (u2 + w2) - v * (x * u + z * w)) * oneMinusCosT + (z * u - x * w) * sinT;
  rotationMatrix[14] = (z * (u2 + v2) - w * (x * u + y * v)) * oneMinusCosT + (x * v - y * u) * sinT;
  rotationMatrix[15] = 1;

  return rotationMatrix;
}
export{
  getRotationMatrix
}