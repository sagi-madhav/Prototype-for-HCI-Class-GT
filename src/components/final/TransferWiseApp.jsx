import React, { useState } from 'react';
import PlanTripScreen from './PlanTripScreen';
import RouteResultsScreen from './RouteResultsScreen';
import RouteDetailsScreen from './RouteDetailsScreen';
import TripReadyScreen from './TripReadyScreen';
import PreferencesSheet from './PreferencesSheet';
import RouteComparisonModal from './RouteComparisonModal';
import { DEMO_ROUTES, INITIAL_PREFERENCES } from '../../data/finalDemoData';

export default function TransferWiseApp({
  onTaskCompleted,
  onLogError,
  onStateChange,
}) {
  const [screen, setScreen] = useState('plan'); // 'plan' | 'results' | 'details' | 'ready'
  const [preferences, setPreferences] = useState(INITIAL_PREFERENCES);
  const [selectedRouteId, setSelectedRouteId] = useState('route-balanced');
  const [confirmedData, setConfirmedData] = useState(null);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [comparisonRouteIds, setComparisonRouteIds] = useState([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Preference change handler
  const handleUpdatePreferences = (updatedFields) => {
    setPreferences(prev => {
      const next = { ...prev, ...updatedFields };
      if (onStateChange) onStateChange(next);
      return next;
    });
  };

  const handleResetPreferences = () => {
    setPreferences(INITIAL_PREFERENCES);
    setIsPreferencesOpen(false);
  };

  // Find routes navigation
  const handleFindRoutes = () => {
    setScreen('results');
  };

  // Select route
  const handleSelectRoute = (routeId) => {
    setSelectedRouteId(routeId);
    setScreen('details');
  };

  // Trigger compare modal
  const handleCompareRoutes = (ids) => {
    setComparisonRouteIds(ids);
    setIsComparisonOpen(true);
  };

  // Confirm route
  const handleConfirmRoute = (route, metrics, validation) => {
    if (!validation.qualifies) {
      if (onLogError) {
        onLogError(`Selected non-qualifying route: ${validation.explanationText}`);
      }
    }

    setConfirmedData({
      route,
      metrics,
      validation,
      preferences,
    });

    setScreen('ready');

    if (onTaskCompleted) {
      onTaskCompleted({
        prototypeId: 'Final',
        routeName: route.title,
        departure: metrics.firstDepartureTime,
        arrival: metrics.finalArrivalTime,
        bufferMinutes: metrics.usableCushion,
        isValid: validation.qualifies,
      });
    }
  };

  const selectedRoute = DEMO_ROUTES.find(r => r.id === selectedRouteId) || DEMO_ROUTES[0];

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#f8f9fc]">
      {/* Active Screen rendering */}
      {screen === 'plan' && (
        <PlanTripScreen
          preferences={preferences}
          onChangePreferences={handleUpdatePreferences}
          onOpenPreferencesSheet={() => setIsPreferencesOpen(true)}
          onFindRoutes={handleFindRoutes}
        />
      )}

      {screen === 'results' && (
        <RouteResultsScreen
          routes={DEMO_ROUTES}
          preferences={preferences}
          onSelectRoute={handleSelectRoute}
          onBackToPlan={() => setScreen('plan')}
          onOpenPreferencesSheet={() => setIsPreferencesOpen(true)}
          onCompareRoutes={handleCompareRoutes}
        />
      )}

      {screen === 'details' && (
        <RouteDetailsScreen
          route={selectedRoute}
          preferences={preferences}
          onBackToResults={() => setScreen('results')}
          onConfirmRoute={handleConfirmRoute}
          onOpenPreferencesSheet={() => setIsPreferencesOpen(true)}
        />
      )}

      {screen === 'ready' && confirmedData && (
        <TripReadyScreen
          confirmedData={confirmedData}
          onEditTrip={() => setScreen('results')}
          onStartNewTrip={() => {
            setScreen('plan');
            setConfirmedData(null);
          }}
        />
      )}

      {/* Advanced Preferences Bottom Sheet */}
      <PreferencesSheet
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        preferences={preferences}
        onChangePreferences={handleUpdatePreferences}
        onResetPreferences={handleResetPreferences}
      />

      {/* Route Comparison Modal */}
      <RouteComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        routeIds={comparisonRouteIds}
        allRoutes={DEMO_ROUTES}
        preferences={preferences}
        onSelectRoute={handleSelectRoute}
      />
    </div>
  );
}
