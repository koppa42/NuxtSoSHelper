export const calDistance = (p1_longitude: number, p1_latitude: number, p2_longitude: number, p2_latitude: number): number => {
    const Deg2Rad = Math.PI / 180;
    let a = 6378137.0;
    let b = 6356752.314245;
    let f = 1 / 298.257223563;

    let L = p1_longitude * Deg2Rad - p2_longitude * Deg2Rad;
    let U1 = Math.atan((1 - f) * Math.tan(p1_latitude * Deg2Rad));
    let U2 = Math.atan((1 - f) * Math.tan(p2_latitude * Deg2Rad));
    let sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
    let sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);
    let lambda = L, lambdaP = Math.PI;
    let cosSqAlpha = 0, sinSigma = 0, cos2SigmaM = 0, cosSigma = 0, sigma = 0;
    let circle = 40;

    while (Math.abs(lambda - lambdaP) > 1e-12 && circle-- > 0) {
        let sinLambda = Math.sin(lambda), cosLambda = Math.cos(lambda);
        sinSigma = Math.sqrt((cosU2 * sinLambda) * (cosU2 * sinLambda) + (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));

        if (sinSigma == 0) {
            return 0;
        }
        cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
        sigma = Math.atan2(sinSigma, cosSigma);
        let alpha = Math.asin(cosU1 * cosU2 * sinLambda / sinSigma);
        cosSqAlpha = Math.cos(alpha) * Math.cos(alpha);
        cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;
        let C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
        lambdaP = lambda;
        lambda = L + (1 - C) * f * Math.sin(alpha) * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
    }

    if (circle == 0) {
        return 0;
    }

    let uSq = cosSqAlpha * (a * a - b * b) / (b * b);
    let A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    let B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    let deltaSigma = (B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM))));
    return (b * A * (sigma - deltaSigma) / 1000);
}