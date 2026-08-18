// Nearby farms lookup for map view.
// Public endpoint: returns APPROVED farmer profiles with GPS coordinates.

const supabase = require('../utils/supabaseClient');

function toRadians(deg) {
  return (Number(deg) * Math.PI) / 180;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

exports.getNearbyFarms = async (req, res) => {
  try {
    const lat = req.query.lat != null ? Number(req.query.lat) : null;
    const lng = req.query.lng != null ? Number(req.query.lng) : null;
    const radiusKm = Math.max(1, Number(req.query.radius || 250));
    const limit = Math.min(200, Math.max(1, Number(req.query.limit || 100)));

    const { data, error } = await supabase
      .from('farmer_profiles')
      .select(`
        id,
        user_id,
        farm_name,
        farm_location,
        farm_state,
        farm_lga,
        crops_produced,
        years_experience,
        gps_latitude,
        gps_longitude,
        profiles:user_id (
          id,
          full_name,
          email,
          phone_number,
          role,
          state,
          lga,
          city,
          trust_score,
          verification_status,
          is_suspended
        )
      `)
      .not('gps_latitude', 'is', null)
      .not('gps_longitude', 'is', null)
      .limit(limit);

    if (error) throw error;

    const farms = (data || [])
      .filter((row) => {
        const p = row.profiles || {};
        return String(p.role || '').toUpperCase() === 'FARMER'
          && String(p.verification_status || '').toUpperCase() === 'APPROVED'
          && !p.is_suspended;
      })
      .map((row) => {
        const farmLat = Number(row.gps_latitude);
        const farmLng = Number(row.gps_longitude);
        const distanceKm = (Number.isFinite(lat) && Number.isFinite(lng))
          ? haversineKm(lat, lng, farmLat, farmLng)
          : null;

        return {
          id: row.id,
          user_id: row.user_id,
          farm_name: row.farm_name || row.profiles?.full_name || 'Agrein Verified Farm',
          farmer_name: row.profiles?.full_name || 'Verified Farmer',
          farm_location: row.farm_location || '',
          farm_state: row.farm_state || row.profiles?.state || '',
          farm_lga: row.farm_lga || row.profiles?.lga || '',
          crops_produced: Array.isArray(row.crops_produced) ? row.crops_produced : [],
          years_experience: Number(row.years_experience || 0),
          trust_score: Number(row.profiles?.trust_score || 50),
          gps_latitude: farmLat,
          gps_longitude: farmLng,
          distance_km: distanceKm == null ? null : Math.round(distanceKm * 10) / 10
        };
      })
      .filter((farm) => farm.distance_km == null || farm.distance_km <= radiusKm)
      .sort((a, b) => {
        if (a.distance_km == null && b.distance_km == null) return 0;
        if (a.distance_km == null) return 1;
        if (b.distance_km == null) return -1;
        return a.distance_km - b.distance_km;
      });

    return res.json({
      success: true,
      count: farms.length,
      radius_km: radiusKm,
      data: farms
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
