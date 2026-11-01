import { timeStringToMinutes, minutesToTimeString12 } from './time';

/**
 * Validates a route against all user constraints and returns qualification status with human-readable explanations
 */
export function validateRoute(metrics, preferences) {
  const earliestMins = timeStringToMinutes(preferences.earliestDeparture);
  const latestMins = timeStringToMinutes(preferences.latestArrival);
  const minCushion = Number(preferences.minimumUsableCushionMinutes);

  const meetsEarliest = metrics.firstDepartureMinutes >= earliestMins;
  const meetsLatest = metrics.finalArrivalMinutes <= latestMins;
  const meetsCushion = metrics.usableCushion >= minCushion;
  const isPhysicallyFeasible = !metrics.isPhysicallyInfeasible;

  const qualifies = meetsEarliest && meetsLatest && meetsCushion && isPhysicallyFeasible;

  const failureReasons = [];
  if (!isPhysicallyFeasible) {
    failureReasons.push(`Physically infeasible connection: estimated walking time (${metrics.estimatedWalk} min) exceeds connection gap.`);
  } else if (!meetsCushion) {
    failureReasons.push(`Only ${metrics.usableCushion} min usable cushion after walking (selected minimum: ${minCushion} min).`);
  }

  if (!meetsEarliest) {
    failureReasons.push(`Departs at ${minutesToTimeString12(metrics.firstDepartureMinutes)}, which is earlier than your ${minutesToTimeString12(earliestMins)} departure window.`);
  }

  if (!meetsLatest) {
    failureReasons.push(`Arrives at ${minutesToTimeString12(metrics.finalArrivalMinutes)}, which is past your ${minutesToTimeString12(latestMins)} deadline.`);
  }

  let statusTag = 'Qualifies';
  let statusBadgeType = 'success'; // 'success' | 'warning' | 'danger'
  let explanationText = '';

  if (qualifies) {
    statusTag = 'Meets Preferences';
    statusBadgeType = 'success';
    explanationText = `${metrics.usableCushion} min cushion remaining after a ${metrics.estimatedWalk}-min transfer walk. Arrives ${metrics.deadlineMarginMinutes} min before deadline.`;
  } else if (!isPhysicallyFeasible) {
    statusTag = 'Missed Transfer';
    statusBadgeType = 'danger';
    explanationText = failureReasons.join(' ');
  } else if (!meetsCushion) {
    statusTag = 'Tight Transfer';
    statusBadgeType = 'warning';
    explanationText = failureReasons.join(' ');
  } else {
    statusTag = 'Schedule Conflict';
    statusBadgeType = 'danger';
    explanationText = failureReasons.join(' ');
  }

  return {
    qualifies,
    meetsEarliest,
    meetsLatest,
    meetsCushion,
    isPhysicallyFeasible,
    failureReasons,
    statusTag,
    statusBadgeType,
    explanationText,
    minCushionRequested: minCushion
  };
}
