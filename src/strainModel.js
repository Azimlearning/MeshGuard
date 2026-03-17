/**
 * MeshGuard Hospital Strain Prediction Model
 * Tracks active SOS load per hospital and predicts time-to-overload.
 * Satisfies the competition's predictive model requirement (Data Challenge 5.0).
 */

const { HOSPITALS } = require('./data/hospitals');

// In-memory state for live strain tracking
const hospitalState = {};

// Initialize state for each hospital
HOSPITALS.forEach((h) => {
  hospitalState[h.id] = {
    activeLoad: 0,
    admissionTimestamps: [], // rolling window for velocity calc
  };
});

// Exponential decay: each SOS load unit decays over time (60s half-life)
const DECAY_HALF_LIFE_MS = 60000;

/**
 * Calculate the effective current load for a hospital, applying time-decay.
 * @param {string} hospitalId
 * @returns {number} effective load (float)
 */
function getEffectiveLoad(hospitalId) {
  const state = hospitalState[hospitalId];
  const now = Date.now();
  // Filter to events within the last 5 minutes; apply exponential decay
  const recentTimestamps = state.admissionTimestamps.filter(
    (ts) => now - ts < 5 * 60 * 1000
  );
  state.admissionTimestamps = recentTimestamps;

  return recentTimestamps.reduce((sum, ts) => {
    const ageMs = now - ts;
    const decayFactor = Math.exp((-Math.LN2 * ageMs) / DECAY_HALF_LIFE_MS);
    return sum + decayFactor;
  }, 0);
}

/**
 * Register an SOS admission to a hospital.
 * @param {string} hospitalId
 */
function admitSos(hospitalId) {
  if (!hospitalState[hospitalId]) return;
  hospitalState[hospitalId].admissionTimestamps.push(Date.now());
}

/**
 * Get the strain status of a single hospital.
 * @param {Object} hospital
 * @returns {Object} strain data
 */
function getHospitalStrainStatus(hospital) {
  const effectiveLoad = getEffectiveLoad(hospital.id);
  const strainRatio = effectiveLoad / hospital.capacity;

  let status = 'NORMAL';
  if (strainRatio >= 0.9) status = 'CRITICAL';
  else if (strainRatio >= 0.6) status = 'WARNING';

  // Predict time-to-critical: how many more SOS events until strain > 0.9?
  const remainingCapacity = hospital.capacity * 0.9 - effectiveLoad;
  // Estimate velocity: events per minute over last 2 mins
  const state = hospitalState[hospital.id];
  const now = Date.now();
  const recentEvents = state.admissionTimestamps.filter((ts) => now - ts < 120000).length;
  const velocityPerMin = recentEvents / 2;
  const minutesToCritical =
    remainingCapacity <= 0
      ? 0
      : velocityPerMin > 0
      ? Math.round(remainingCapacity / velocityPerMin)
      : null;

  return {
    id: hospital.id,
    label: hospital.label,
    lat: hospital.lat,
    lng: hospital.lng,
    capacity: hospital.capacity,
    effectiveLoad: parseFloat(effectiveLoad.toFixed(2)),
    strainRatio: parseFloat(Math.min(strainRatio, 1).toFixed(3)),
    status,
    minutesToCritical,
    isBase: true,
    isHospital: true,
  };
}

/**
 * Get strain status for ALL hospitals.
 * @returns {Array} array of hospital strain objects
 */
function getAllHospitalStrains() {
  return HOSPITALS.map((h) => getHospitalStrainStatus(h));
}

/**
 * Find the best (least strained, nearest) hospital to route an SOS to.
 * @param {Object} origin - { lat, lng }
 * @returns {Object} best hospital strain object
 */
function findBestHospital(origin) {
  const strains = getAllHospitalStrains();

  // Filter to non-critical hospitals first
  const available = strains.filter((h) => h.status !== 'CRITICAL');
  const pool = available.length > 0 ? available : strains; // fallback to all if all critical

  // Among available, pick nearest to origin
  return pool.reduce((best, h) => {
    const distH = Math.hypot(h.lat - origin.lat, h.lng - origin.lng);
    const distBest = Math.hypot(best.lat - origin.lat, best.lng - origin.lng);
    return distH < distBest ? h : best;
  });
}

module.exports = { admitSos, getAllHospitalStrains, findBestHospital, getEffectiveLoad };
