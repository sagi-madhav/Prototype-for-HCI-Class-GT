import { timeStringToMinutes, minutesToTimeString12 } from './time';
import { WALKING_PACE_CONFIG, HEAVY_ITEMS_EXTRA_MINUTES } from '../data/finalDemoData';

/**
 * Calculates detailed metrics for a route based on preferences and active disruption scenario
 */
export function calculateRouteMetrics(route, preferences, disruption = { trainDelay: 0, walkDelay: 0, busAdvance: 0 }) {
  const paceConfig = WALKING_PACE_CONFIG[preferences.walkingPace] || WALKING_PACE_CONFIG.standard;
  const heavyExtra = preferences.heavyItems ? HEAVY_ITEMS_EXTRA_MINUTES : 0;

  const leg1 = route.legs[0];
  const transfer = route.legs[1];
  const leg2 = route.legs[2];

  const leg1DepMins = timeStringToMinutes(leg1.departureTime);
  const leg1BaseArrMins = timeStringToMinutes(leg1.arrivalTime);
  const leg1ActualArrMins = leg1BaseArrMins + (disruption.trainDelay || 0);

  const baseWalk = transfer.baseWalkMinutes || 4;
  const estimatedWalk = Math.round(baseWalk * paceConfig.multiplier) + heavyExtra + (disruption.walkDelay || 0);

  const leg2BaseDepMins = timeStringToMinutes(leg2.departureTime);
  const leg2ActualDepMins = leg2BaseDepMins - (disruption.busAdvance || 0);
  const leg2ArrMins = timeStringToMinutes(leg2.arrivalTime);

  // Scheduled connection gap (between timetable arrival and next vehicle departure)
  const scheduledConnectionGap = leg2BaseDepMins - leg1BaseArrMins;

  // Actual available connection gap under disruption
  const effectiveConnectionGap = leg2ActualDepMins - leg1ActualArrMins;

  // Usable transfer cushion = effective gap minus estimated walk time
  const usableCushion = effectiveConnectionGap - estimatedWalk;

  // Total journey time
  const totalDurationMinutes = leg2ArrMins - leg1DepMins;

  // Deadline margin relative to user's latest arrival
  const latestArrivalMins = timeStringToMinutes(preferences.latestArrival);
  const deadlineMarginMinutes = latestArrivalMins - leg2ArrMins;

  return {
    firstDepartureTime: leg1.departureTime,
    firstDepartureMinutes: leg1DepMins,
    finalArrivalTime: leg2.arrivalTime,
    finalArrivalMinutes: leg2ArrMins,
    leg1ActualArrivalTime: leg1ActualArrMins,
    leg2ActualDepartureTime: leg2ActualDepMins,
    scheduledConnectionGap,
    estimatedWalk,
    usableCushion,
    totalDurationMinutes,
    deadlineMarginMinutes,
    isPhysicallyInfeasible: usableCushion < 0,
    disruptionImpact: (disruption.trainDelay || 0) + (disruption.walkDelay || 0) + (disruption.busAdvance || 0)
  };
}
