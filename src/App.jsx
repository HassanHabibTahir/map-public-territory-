// // src/Map.js
// import React, { useState, useEffect } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   Polygon,
//   Rectangle,
//   useMap, 
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // Car icon configuration
// const carIcon = new L.Icon({
//   iconUrl:
//     "flatbedNorthWest.svg",
//   iconSize: [62, 62],
//   iconAnchor: [26, 26],
// });

// // Incident icon (e.g. tire change or accident)
// const incidentIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
//   iconSize: [28, 28],
//   iconAnchor: [14, 14],
// });

// // Simulated route for the vehicle
// const routeCoordinates = [
//   [37.7749, -122.4194],
//   [37.7757, -122.4218],
//   [37.7768, -122.4239],
//   [37.778, -122.4263],
//   [37.7792, -122.4287],
//   [37.7804, -122.431],
//   [37.7816, -122.4334],
//   [37.7828, -122.4358],
//   [37.784, -122.4382],
//   [37.7852, -122.4406],
// ];

// // Sample polygon (Territory)
// const bayAreaSouthPolygon = [
//   [37.773, -122.445],
//   [37.788, -122.445],
//   [37.788, -122.418],
//   [37.773, -122.418],
// ];

// // Example rectangle (square)
// const squareBounds = [
//   [37.779, -122.431],
//   [37.783, -122.437],
// ];

// // Component to freeze zoom level when a territory is selected
// function FreezeZoom({ freeze }) {
//   const map = useMap();
//   useEffect(() => {
//     if (freeze) {
//       map.dragging.disable();
//       map.scrollWheelZoom.disable();
//       map.doubleClickZoom.disable();
//     } else {
//       map.dragging.enable();
//       map.scrollWheelZoom.enable();
//       map.doubleClickZoom.enable();
//     }
//   }, [freeze, map]);
//   return null;
// }

// const Map = () => {
//   const [currentPosition, setCurrentPosition] = useState(routeCoordinates[0]);
//   const [routeIndex, setRouteIndex] = useState(0);
//   const [isMoving, setIsMoving] = useState(false);
//   const [freezeZoom, setFreezeZoom] = useState(false);
//   const [incidentResolved, setIncidentResolved] = useState(false);

//   const startSimulation = () => {
//     setRouteIndex(0);
//     setCurrentPosition(routeCoordinates[0]);
//     setIsMoving(true);
//     setIncidentResolved(false);
//   };

//   useEffect(() => {
//     if (isMoving) {
//       const intervalId = setInterval(() => {
//         setRouteIndex((prev) => {
//           const nextIndex = prev + 1;
//           if (nextIndex < routeCoordinates.length) {
//             setCurrentPosition(routeCoordinates[nextIndex]);
//             return nextIndex;
//           } else {
//             clearInterval(intervalId);
//             setIsMoving(false);
//             setIncidentResolved(true); // incident resolved
//             return prev;
//           }
//         });
//       }, 1000);
//       return () => clearInterval(intervalId);
//     }
//   }, [isMoving]);

//   return (
//     <div>
//       <MapContainer
//         center={routeCoordinates[0]}
//         zoom={14}
//         style={{ height: "800px", width: "100%" }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//         />

//         {/* Freeze Zoom when active */}
//         <FreezeZoom freeze={freezeZoom} />

//         {/* Territory Polygon */}
//         <Polygon
//           positions={bayAreaSouthPolygon}
//           pathOptions={{ color: "blue", weight: 2 }}
//           eventHandlers={{
//             click: () => setFreezeZoom(!freezeZoom),
//           }}
//         />

//         {/* Square example */}
//         <Rectangle bounds={squareBounds} pathOptions={{ color: "green" }} />

//         {/* Route Path */}
//         <Polyline positions={routeCoordinates} color="red" />

//         {/* Incident Marker (will disappear when resolved) */}
//         {!incidentResolved && (
//           <Marker position={routeCoordinates[4]} icon={incidentIcon} />
//         )}

//         {/* Truck Marker */}
//         <Marker position={currentPosition} icon={carIcon} />
//       </MapContainer>

//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           marginTop: "10px",
//           gap: "10px",
//         }}
//       >
//         <button
//           onClick={startSimulation}
//           style={{
//             padding: "10px 20px",
//             fontSize: "16px",
//             backgroundColor: "blue",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           Start Simulation
//         </button>

//         <button
//           onClick={() => setFreezeZoom(!freezeZoom)}
//           style={{
//             padding: "10px 20px",
//             fontSize: "16px",
//             backgroundColor: freezeZoom ? "darkred" : "gray",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           {freezeZoom ? "Unfreeze Zoom" : "Freeze Zoom"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Map;
// src/Map.js

// import React, { useState } from 'react';
// import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';


// // Car icon configuration
// const carIcon = new L.Icon({
//   iconUrl: 'https://images.vexels.com/media/users/3/154573/isolated/preview/bd08e000a449288c914d851cb9dae110-hatchback-car-top-view-silhouette-by-vexels.png', // Replace with your car icon URL
//   iconSize: [32, 32],
//   iconAnchor: [16, 16],
// });


// // Simulated route for the vehicle
// const routeCoordinates = [
//   [37.7749, -122.4194],
//   [37.7757, -122.4218],
//   [37.7768, -122.4239],
//   [37.7780, -122.4263],
//   [37.7792, -122.4287],
//   [37.7804, -122.4310],
//   [37.7816, -122.4334],
//   [37.7828, -122.4358],
//   [37.7840, -122.4382],
//   [37.7852, -122.4406],
// ];

// const Map = () => {
//   const [currentPosition, setCurrentPosition] = useState(routeCoordinates[0]);
//   const [routeIndex, setRouteIndex] = useState(0);
//   const [isMoving, setIsMoving] = useState(false);

//   const startSimulation = () => {
//     setRouteIndex(0);
//     setCurrentPosition(routeCoordinates[0]);
//     setIsMoving(true);
//   };

//   React.useEffect(() => {
//     if (isMoving) {
//       const intervalId = setInterval(() => {
//         if (routeIndex < routeCoordinates.length - 1) {
//           setRouteIndex((prevIndex) => prevIndex + 1);
//           setCurrentPosition(routeCoordinates[routeIndex + 1]);
//         } else {
//           clearInterval(intervalId); // Stop the interval when the destination is reached
//           setIsMoving(false); // Reset the movement state
//         }
//       }, 1000); // Move the car every second

//       return () => clearInterval(intervalId);
//     }
//   }, [isMoving, routeIndex]);

//   return (
//     <div>

//       <MapContainer
//         center={routeCoordinates[0]}
//         zoom={14}
//         style={{ height: '500px', width: '100%' }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//         />
//         {/* Draw the complete route */}
//         <Polyline positions={routeCoordinates} color="red" />
//         {/* Car icon that moves along the route */}
//         <Marker position={currentPosition} icon={carIcon} />
//       </MapContainer>

//       {/* Button to start the simulation */}
//       <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
//         <button onClick={startSimulation} style={{ padding: '10px 20px', fontSize: '16px' , backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
//           Start Simulation
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Map;
// Map.jsx

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Rectangle, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Icons
const truckIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/color/48/tow-truck.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const incidentIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/emoji/48/tire.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Click Handler Component
function MapClickHandler({ onClick }) {
  useMapEvents({
    click: (e) => onClick([e.latlng.lat, e.latlng.lng]),
  });
  return null;
}

const Map = () => {
  const [center] = useState([37.7749, -122.4194]);
  const [territories, setTerritories] = useState([]);
  const [activeTerritory, setActiveTerritory] = useState(null);
  const [drawingMode, setDrawingMode] = useState(null); // 'polygon' | 'square' | null
  const [tempPoints, setTempPoints] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [incidents, setIncidents] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('territories');
    if (saved) setTerritories(JSON.parse(saved));
  }, []);

  // Save territories
  useEffect(() => {
    localStorage.setItem('territories', JSON.stringify(territories));
  }, [territories]);

  // Handle map click for drawing
  const handleMapClick = (point) => {
    if (!drawingMode) return;
    setTempPoints(prev => [...prev, point]);
  };

  // Finish drawing territory
  const finishDrawing = () => {
    if (drawingMode === 'polygon' && tempPoints.length < 3) {
      alert('کم از کم 3 پوائنٹس درکار ہیں');
      return;
    }
    if (drawingMode === 'square' && tempPoints.length !== 2) {
      alert('مربع کے لیے 2 کونے منتخب کریں');
      return;
    }

    const name = prompt('علاقے کا نام:');
    if (!name) return;

    let points = tempPoints;
    if (drawingMode === 'square' && tempPoints.length === 2) {
      const [[lat1, lng1], [lat2, lng2]] = tempPoints;
      points = [[lat1, lng1], [lat1, lng2], [lat2, lng2], [lat2, lng1]];
    }

    const newTerritory = { id: Date.now(), name, points, type: drawingMode };
    setTerritories(prev => [...prev, newTerritory]);
    setActiveTerritory(newTerritory.id);
    setDrawingMode(null);
    setTempPoints([]);
  };

  // Create Call
  const createCall = () => {
    if (!activeTerritory) return alert('پہلے کوئی علاقہ منتخب کریں');

    const territory = territories.find(t => t.id === activeTerritory);
    const bounds = L.polygon(territory.points).getBounds();

    const lat = bounds.getSouth() + Math.random() * (bounds.getNorth() - bounds.getSouth());
    const lng = bounds.getWest() + Math.random() * (bounds.getEast() - bounds.getWest());

    // Add Incident
    const newIncident = { id: Date.now(), position: [lat, lng] };
    setIncidents(prev => [...prev, newIncident]);

    // Add Truck (near incident)
    const truckStart = [lat + 0.008, lng + 0.008];
    const route = [
      truckStart,
      [lat + 0.004, lng + 0.004],
      [lat, lng]
    ];

    const newTruck = {
      id: Date.now(),
      position: truckStart,
      route,
      index: 0
    };

    setTrucks(prev => [...prev, newTruck]);
  };

  // Move trucks every 1.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTrucks(prev => prev.map(truck => {
        if (truck.index < truck.route.length - 1) {
          const nextPos = truck.route[truck.index + 1];

          // Check if truck reached incident
          setIncidents(prevInc => {
            const closeIncident = prevInc.find(inc => 
              L.latLng(nextPos).distanceTo(L.latLng(inc.position)) < 50
            );
            if (closeIncident) {
              return prevInc.filter(i => i.id !== closeIncident.id);
            }
            return prevInc;
          });

          return { ...truck, position: nextPos, index: truck.index + 1 };
        }
        return truck; // Stop moving
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Filter visible items
  const activeTerritoryData = territories.find(t => t.id === activeTerritory);
  const bounds = activeTerritoryData ? L.polygon(activeTerritoryData.points).getBounds() : null;

  const visibleTrucks = bounds
    ? trucks.filter(t => bounds.contains(t.position))
    : trucks;

  const visibleIncidents = bounds
    ? incidents.filter(i => bounds.contains(i.position))
    : incidents;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Tabs */}
      <div style={{ padding: 10, background: '#f0f0f0', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => setActiveTerritory(null)} style={{ fontWeight: !activeTerritory ? 'bold' : 'normal' }}>
          All
        </button>
        {territories.map(t => (
          <div
            key={t.id}
            style={{
              padding: '6px 12px',
              background: activeTerritory === t.id ? '#007bff' : '#ddd',
              color: activeTerritory === t.id ? 'white' : 'black',
              borderRadius: 20,
              cursor: 'pointer',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 5
            }}
          >
            <span onClick={() => setActiveTerritory(t.id)}>{t.name}</span>
            <span
              onClick={() => setTerritories(prev => prev.filter(x => x.id !== t.id))}
              style={{ cursor: 'pointer', fontWeight: 'bold' }}
            >
              ×
            </span>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 5 }}>
          <button
            onClick={() => { setDrawingMode('polygon'); setTempPoints([]); }}
            style={{ background: drawingMode === 'polygon' ? '#007bff' : '#fff', color: drawingMode === 'polygon' ? 'white' : 'black' }}
          >
            Polygon
          </button>
          <button
            onClick={() => { setDrawingMode('square'); setTempPoints([]); }}
            style={{ background: drawingMode === 'square' ? '#007bff' : '#fff', color: drawingMode === 'square' ? 'white' : 'black' }}
          >
            Square
          </button>
          <button onClick={createCall} style={{ background: 'green', color: 'white' }}>
            Create Call
          </button>
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          <MapClickHandler onClick={handleMapClick} />

          {/* Territories */}
          {territories.map(t => {
            const Component = t.type === 'square' ? Rectangle : Polygon;
            return (
              <Component
                key={t.id}
                positions={t.points}
                pathOptions={{
                  color: activeTerritory === t.id ? 'blue' : 'gray',
                  weight: activeTerritory === t.id ? 4 : 2,
                  fillOpacity: 0.15
                }}
              />
            );
          })}

          {/* Temp Drawing */}
          {drawingMode && tempPoints.length > 0 && (
            drawingMode === 'polygon' ? (
              <Polyline positions={tempPoints} color="red" weight={3} dashArray="5" />
            ) : (
              tempPoints.length === 2 && (
                <Rectangle
                  bounds={tempPoints}
                  pathOptions={{ color: 'red', weight: 3, dashArray: '5' }}
                />
              )
            )
          )}

          {/* Trucks */}
          {visibleTrucks.map(truck => (
            <Marker key={truck.id} position={truck.position} icon={truckIcon} />
          ))}

          {/* Incidents */}
          {visibleIncidents.map(inc => (
            <Marker key={inc.id} position={inc.position} icon={incidentIcon} />
          ))}
        </MapContainer>

        {/* Drawing Panel */}
        {drawingMode && (
          <div style={{
            position: 'absolute',
            top: 80,
            left: 10,
            background: 'white',
            padding: 12,
            borderRadius: 8,
            boxShadow: '0 0 15px rgba(0,0,0,0.3)',
            zIndex: 1000,
            fontSize: 14
          }}>
            <p style={{ margin: '0 0 8px', fontWeight: 'bold' }}>
              {drawingMode === 'polygon' ? 'Polygon' : 'Square'} بنا رہے ہیں
            </p>
            <button onClick={finishDrawing} style={{ marginRight: 5, padding: '5px 10px' }}>
              Save
            </button>
            <button
              onClick={() => { setDrawingMode(null); setTempPoints([]); }}
              style={{ padding: '5px 10px' }}
            >
              Cancel
            </button>
            <p style={{ margin: '8px 0 0', fontSize: 12 }}>Points: {tempPoints.length}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;