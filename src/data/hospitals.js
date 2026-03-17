/**
 * MeshGuard Hospital Data Layer
 * Real KL hospital data with DOSM-based capacity figures.
 * Source: KKMNow / OpenDOSM public health facility data.
 */

const HOSPITALS = [
  {
    id: 'hosp_hkl',
    label: 'Hospital Kuala Lumpur (HKL)',
    lat: 3.1596,
    lng: 101.6932,
    capacity: 30, // Emergency bed equivalents (simplified from DOSM data)
    isBase: true,
    isHospital: true,
  },
  {
    id: 'hosp_ampang',
    label: 'Hospital Ampang',
    lat: 3.1503,
    lng: 101.7624,
    capacity: 18,
    isBase: true,
    isHospital: true,
  },
  {
    id: 'hosp_sungai_buloh',
    label: 'Hospital Sungai Buloh',
    lat: 3.2028,
    lng: 101.5758,
    capacity: 22,
    isBase: true,
    isHospital: true,
  },
  {
    id: 'hosp_pudu',
    label: 'Hospital Kuala Lumpur Selatan (Pudu)',
    lat: 3.1268,
    lng: 101.7043,
    capacity: 15,
    isBase: true,
    isHospital: true,
  },
  {
    id: 'hosp_selayang',
    label: 'Hospital Selayang',
    lat: 3.2507,
    lng: 101.6326,
    capacity: 20,
    isBase: true,
    isHospital: true,
  },
];

module.exports = { HOSPITALS };
