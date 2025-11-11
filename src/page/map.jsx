import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// Initial dummy data for trucks
const initialTrucks = [
  { id: 1, name: "Truck-001", lat: 37.7749, lng: -122.4194, status: "available", speed: 0.0002 },
  { id: 2, name: "Truck-002", lat: 37.7849, lng: -122.4094, status: "busy", speed: 0.0003 },
  { id: 3, name: "Truck-003", lat: 37.7649, lng: -122.4294, status: "available", speed: 0.00025 },
  { id: 4, name: "Truck-004", lat: 37.8044, lng: -122.2712, status: "available", speed: 0.0002 },
  { id: 5, name: "Truck-005", lat: 37.8715, lng: -122.2727, status: "busy", speed: 0.00025 },
  { id: 6, name: "Truck-006", lat: 37.9358, lng: -122.3477, status: "available", speed: 0.0003 },
  { id: 7, name: "Truck-007", lat: 37.7249, lng: -122.1565, status: "available", speed: 0.0002 },
]

// Initial dummy data for incidents
const initialIncidents = [
  { id: 1, type: "Tire Change", lat: 37.7799, lng: -122.4144, status: "pending" },
  { id: 2, type: "Gas Delivery", lat: 37.7699, lng: -122.4244, status: "pending" },
  { id: 3, type: "Accident", lat: 37.7899, lng: -122.4044, status: "active" },
]

// Initial dummy data for cities
const initialCities = [
  { id: 1, name: "San Francisco", lat: 37.7749, lng: -122.4194 },
  { id: 2, name: "Oakland", lat: 37.8044, lng: -122.2712 },
  { id: 3, name: "Berkeley", lat: 37.8715, lng: -122.2727 },
  { id: 4, name: "Richmond", lat: 37.9358, lng: -122.3477 },
  { id: 5, name: "Vallejo", lat: 38.1041, lng: -122.2708 },
  { id: 6, name: "Hayward", lat: 37.6688, lng: -122.0808 },
  { id: 7, name: "Fremont", lat: 37.5485, lng: -121.9886 },
  { id: 8, name: "San Leandro", lat: 37.7249, lng: -122.1565 },
]

// Initial tabs data (empty by default)
const initialTabs = []

// Point in polygon check
const isPointInPolygon = (point, polygon) => {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0],
      yi = polygon[i][1]
    const xj = polygon[j][0],
      yj = polygon[j][1]

    const intersect = yi > point[1] !== yj > point[1] && point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

// Drawing Tool Component
const DrawingTool = ({ onComplete, drawingMode, setDrawingMode }) => {
  const [points, setPoints] = useState([])
  const [tempSquare, setTempSquare] = useState(null)

  useMapEvents({
    click(e) {
      if (drawingMode === "polygon") {
        setPoints([...points, [e.latlng.lat, e.latlng.lng]])
      } else if (drawingMode === "square") {
        if (points.length === 0) {
          setPoints([[e.latlng.lat, e.latlng.lng]])
        } else if (points.length === 1) {
          const start = points[0]
          const end = [e.latlng.lat, e.latlng.lng]

          const square = [start, [start[0], end[1]], end, [end[0], start[1]], start]

          onComplete(square)
          setPoints([])
          setTempSquare(null)
          setDrawingMode(null)
        }
      }
    },

    mousemove(e) {
      if (drawingMode === "square" && points.length === 1) {
        const start = points[0]
        const current = [e.latlng.lat, e.latlng.lng]

        const previewSquare = [start, [start[0], current[1]], current, [current[0], start[1]], start]

        setTempSquare(previewSquare)
      }
    },
  })

  const handleComplete = () => {
    if (points.length >= 3) {
      const closedPolygon = [...points, points[0]]
      onComplete(closedPolygon)
      setPoints([])
      setDrawingMode(null)
    }
  }

  const handleCancel = () => {
    setPoints([])
    setTempSquare(null)
    setDrawingMode(null)
  }

  if (!drawingMode) return null

  return (
    <>
      {tempSquare && (
        <Polygon
          positions={tempSquare}
          pathOptions={{ color: "orange", fillOpacity: 0.1, dashArray: "5, 5", weight: 2 }}
        />
      )}

      {points.length > 0 && drawingMode === "polygon" && (
        <Polygon positions={points} pathOptions={{ color: "orange", fillOpacity: 0.2, dashArray: "5, 5" }} />
      )}

      <div
        style={{
          position: "absolute",
          top: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          background: "white",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          minWidth: "250px",
        }}
      >
        {drawingMode === "polygon" && (
          <>
            <p style={{ fontSize: "14px", margin: "0 0 8px 0", textAlign: "center" }}>
              Click to add points ({points.length} added)
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              <button
                onClick={handleComplete}
                disabled={points.length < 3}
                style={{
                  padding: "8px 16px",
                  background: points.length < 3 ? "#9ca3af" : "#22c55e",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: points.length < 3 ? "not-allowed" : "pointer",
                  fontSize: "14px",
                }}
              >
                Complete Polygon
              </button>
              <button
                onClick={handleCancel}
                style={{
                  padding: "8px 16px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {drawingMode === "square" && (
          <>
            <p style={{ fontSize: "14px", margin: "0 0 8px 0", textAlign: "center" }}>
              {points.length === 0 ? "Click first corner of square" : "Click opposite corner to complete square"}
            </p>
            <button
              onClick={handleCancel}
              style={{
                padding: "8px 16px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                width: "100%",
              }}
            >
              Cancel Square
            </button>
          </>
        )}
      </div>
    </>
  )
}

const FoxtowMap = () => {
  const [trucks, setTrucks] = useState(initialTrucks)
  const [incidents, setIncidents] = useState(initialIncidents)
  const [tabs, setTabs] = useState(initialTabs)
  const [mapCenter] = useState([37.7749, -122.4194])
  const [drawingMode, setDrawingMode] = useState(null)
  const [newTerritoryCoords, setNewTerritoryCoords] = useState(null)
  const [showTerritoryModal, setShowTerritoryModal] = useState(false)
  const [newTerritoryName, setNewTerritoryName] = useState("")
  const [newTerritoryCities, setNewTerritoryCities] = useState("")
  const [activeTab, setActiveTab] = useState(null)
  const [showTabModal, setShowTabModal] = useState(false)
  const [newTabName, setNewTabName] = useState("")
  const [dragTabId, setDragTabId] = useState(null)

  // Load from localStorage on mount
  useEffect(() => {
    const savedTabs = localStorage.getItem("foxtowTabs")
    if (savedTabs) {
      const parsed = JSON.parse(savedTabs)
      setTabs(parsed)
      if (parsed.length > 0) {
        setActiveTab(parsed[0].id)
      }
    }
  }, [])

  // Save to localStorage whenever tabs change
  useEffect(() => {
    localStorage.setItem("foxtowTabs", JSON.stringify(tabs))
  }, [tabs])

  // Get active tab
  const activeTabData = tabs.find((tab) => tab.id === activeTab)

  // Check if truck reached incident
  useEffect(() => {
    setIncidents((prevIncidents) => {
      return prevIncidents.filter((incident) => {
        const nearbyTruck = trucks.find((truck) => {
          const distance = Math.sqrt(Math.pow(truck.lat - incident.lat, 2) + Math.pow(truck.lng - incident.lng, 2))
          return distance < 0.005
        })

        if (nearbyTruck) {
          console.log(`${nearbyTruck.name} reached ${incident.type}`)
          return false
        }
        return true
      })
    })
  }, [trucks])

  const addNewIncident = () => {
    const types = ["Tire Change", "Gas Delivery", "Accident"]
    const newIncident = {
      id: Date.now(),
      type: types[Math.floor(Math.random() * types.length)],
      lat: 37.7749 + (Math.random() - 0.5) * 0.05,
      lng: -122.4194 + (Math.random() - 0.5) * 0.05,
      status: "pending",
    }
    setIncidents([...incidents, newIncident])
  }

  const handleDrawingComplete = (coords) => {
    const citiesInTerritory = getCitiesInPolygon(coords)
    setNewTerritoryCoords(coords)
    setNewTerritoryCities(citiesInTerritory.join(", "))
    setShowTerritoryModal(true)
  }

  const handleSaveTerritory = () => {
    if (newTerritoryName.trim() && newTerritoryCoords) {
      let updatedTabs = [...tabs]
      let targetTab = activeTabData

      // اگر کوئی ٹیب نہیں ہے تو خود بخود بنائیں
      if (tabs.length === 0) {
        const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"]
        const newTab = {
          id: Date.now(),
          name: "Default Region",
          color: colors[0],
          active: true,
          territories: [],
        }
        updatedTabs = [newTab]
        targetTab = newTab
        setActiveTab(newTab.id)
      }

      const citiesArray = newTerritoryCities
        .split(",")
        .map((city) => city.trim())
        .filter((city) => city.length > 0)

      const newTerritory = {
        id: Date.now() + 1,
        name: newTerritoryName,
        coordinates: newTerritoryCoords,
        color: targetTab.color,
        active: true,
        cities: citiesArray,
      }

      const finalTabs = updatedTabs.map((tab) =>
        tab.id === targetTab.id
          ? { ...tab, territories: [...tab.territories, newTerritory] }
          : tab
      )

      setTabs(finalTabs)

      // Reset modal
      setShowTerritoryModal(false)
      setNewTerritoryName("")
      setNewTerritoryCities("")
      setNewTerritoryCoords(null)
    }
  }

  const toggleTerritory = (tabId, territoryId) => {
    const updatedTabs = tabs.map((tab) =>
      tab.id === tabId
        ? {
            ...tab,
            territories: tab.territories.map((territory) =>
              territory.id === territoryId ? { ...territory, active: !territory.active } : territory
            ),
          }
        : tab
    )
    setTabs(updatedTabs)
  }

  const deleteTerritory = (tabId, territoryId) => {
    const updatedTabs = tabs.map((tab) =>
      tab.id === tabId
        ? {
            ...tab,
            territories: tab.territories.filter((territory) => territory.id !== territoryId),
          }
        : tab
    )
    setTabs(updatedTabs)
  }

  const handleCreateTab = () => {
    if (newTabName.trim()) {
      const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"]
      const newTab = {
        id: Date.now(),
        name: newTabName,
        color: colors[tabs.length % colors.length],
        active: true,
        territories: [],
      }

      const updatedTabs = [...tabs, newTab]
      setTabs(updatedTabs)
      setActiveTab(newTab.id)
      setShowTabModal(false)
      setNewTabName("")
    }
  }

  const deleteTab = (tabId) => {
    if (tabs.length > 1) {
      const updatedTabs = tabs.filter((tab) => tab.id !== tabId)
      setTabs(updatedTabs)
      if (activeTab === tabId) {
        setActiveTab(updatedTabs[0].id)
      }
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e, tabId) => {
    setDragTabId(tabId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e, targetTabId) => {
    e.preventDefault()
    if (dragTabId && dragTabId !== targetTabId) {
      const draggedTab = tabs.find((tab) => tab.id === dragTabId)
      const targetTab = tabs.find((tab) => tab.id === targetTabId)

      if (draggedTab && targetTab) {
        const updatedTabs = tabs.map((tab) => {
          if (tab.id === dragTabId) {
            return { ...targetTab, id: dragTabId }
          }
          if (tab.id === targetTabId) {
            return { ...draggedTab, id: targetTabId }
          }
          return tab
        })

        setTabs(updatedTabs)
        if (activeTab === dragTabId) setActiveTab(targetTabId)
        else if (activeTab === targetTabId) setActiveTab(dragTabId)
      }
    }
    setDragTabId(null)
  }

  const getCitiesInPolygon = (coordinates) => {
    return initialCities
      .filter((city) => isPointInPolygon([city.lat, city.lng], coordinates))
      .map((city) => city.name)
  }

  // Inline styles
  const styles = {
    container: { height: "100vh", width: "100%", display: "flex", flexDirection: "column" },
    header: { background: "#2563eb", color: "white", padding: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
    headerTitle: { fontSize: "24px", fontWeight: "bold", margin: 0 },
    headerSubtitle: { fontSize: "14px", margin: "4px 0 0 0", opacity: 0.9 },
    tabsContainer: { background: "#f1f5f9", padding: "8px", display: "flex", gap: "4px", borderBottom: "1px solid #e2e8f0", alignItems: "center", overflowX: "auto" },
    tab: { padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 8, minWidth: 120, justifyContent: "space-between" },
    activeTab: { color: "white" },
    inactiveTab: { background: "white", color: "#64748b" },
    stats: { background: "#f8fafc", padding: "12px", display: "flex", gap: "24px", borderBottom: "1px solid #e2e8f0", alignItems: "center" },
    statItem: { display: "flex", alignItems: "center", gap: "8px" },
    statText: { fontSize: "12px", color: "#64748b", margin: 0 },
    statNumber: { fontWeight: "bold", margin: 0, color: "#1e293b" },
    controls: { marginLeft: "auto", display: "flex", gap: "8px", flexWrap: "wrap" },
    button: { padding: "8px 16px", borderRadius: "6px", fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s", fontSize: 14 },
    addButton: { background: "#f97316", color: "white" },
    polygonButton: { background: "#8b5cf6", color: "white" },
    squareButton: { background: "#ec4899", color: "white" },
    newTabButton: { background: "#06b6d4", color: "white", marginLeft: 8 },
    mapContainer: { flex: 1, position: "relative" },
    territoryPanel: { position: "absolute", top: "16px", left: "16px", background: "white", borderRadius: "8px", padding: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", zIndex: 1000, maxWidth: "300px" },
    legend: { position: "absolute", top: "16px", right: "16px", background: "white", borderRadius: "8px", padding: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", zIndex: 1000, maxWidth: "200px" },
    legendTitle: { fontWeight: "bold", fontSize: "14px", margin: "0 0 12px 0", color: "#1e293b" },
    legendItem: { display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", marginBottom: "6px", color: "#475569" },
    colorBox: { width: "16px", height: "16px", borderRadius: "4px", flexShrink: 0 },
    popup: { padding: "8px", minWidth: "180px" },
    popupTitle: { fontWeight: "bold", fontSize: "16px", margin: "0 0 8px 0" },
    popupText: { margin: "4px 0", fontSize: "14px" },
    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 },
    modal: { background: "white", padding: "24px", borderRadius: "8px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", maxWidth: "400px", width: "90%" },
    modalTitle: { fontSize: "20px", fontWeight: "bold", margin: "0 0 16px 0", color: "#1e293b" },
    modalInput: { width: "100%", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "16px", marginBottom: "16px", boxSizing: "border-box" },
    modalButtons: { display: "flex", gap: "8px" },
    modalButton: { flex: 1, padding: "12px", border: "none", borderRadius: "6px", fontSize: "16px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" },
    saveButton: { background: "#2563eb", color: "white" },
    cancelButton: { background: "#64748b", color: "white" },
    deleteButton: { background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "14px", padding: "4px" },
    footer: { background: "#1e293b", color: "white", padding: "8px", textAlign: "center", fontSize: "12px" },
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Foxtow Mapping System</h1>
        <p style={styles.headerSubtitle}>Multi-Tab Territory Management with Auto-Creation</p>
      </div>

      {/* Tabs Bar */}
      <div style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            draggable
            onDragStart={(e) => handleDragStart(e, tab.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, tab.id)}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.activeTab : styles.inactiveTab),
              backgroundColor: activeTab === tab.id ? tab.color : undefined,
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.name}</span>
            <span style={{ fontSize: "12px" }}>({tab.territories.length})</span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteTab(tab.id)
                }}
                style={styles.deleteButton}
              >
                ×
              </button>
            )}
          </button>
        ))}
        <button onClick={() => setShowTabModal(true)} style={{ ...styles.button, ...styles.newTabButton }}>
          + New Tab
        </button>
      </div>

      {/* Stats Bar */}
      <div style={styles.stats}>
        <div style={styles.statItem}>
          <span style={{ fontSize: "24px" }}>🚛</span>
          <div>
            <p style={styles.statText}>Total Trucks</p>
            <p style={styles.statNumber}>{trucks.length}</p>
          </div>
        </div>
        <div style={styles.statItem}>
          <span style={{ fontSize: "24px" }}>⚠️</span>
          <div>
            <p style={styles.statText}>Active Incidents</p>
            <p style={styles.statNumber}>{incidents.length}</p>
          </div>
        </div>
        <div style={styles.statItem}>
          <span style={{ fontSize: "24px" }}>📍</span>
          <div>
            <p style={styles.statText}>Active Territories</p>
            <p style={styles.statNumber}>
              {activeTabData ? activeTabData.territories.filter((t) => t.active).length : 0}
            </p>
          </div>
        </div>

        <div style={styles.controls}>
          <button onClick={addNewIncident} style={{ ...styles.button, ...styles.addButton }}>
            + Incident
          </button>
          <button
            onClick={() => setDrawingMode("polygon")}
            disabled={drawingMode !== null}
            style={{
              ...styles.button,
              ...styles.polygonButton,
              opacity: drawingMode !== null ? 0.6 : 1,
              cursor: drawingMode !== null ? "not-allowed" : "pointer",
            }}
          >
            Polygon
          </button>
          <button
            onClick={() => setDrawingMode("square")}
            disabled={drawingMode !== null}
            style={{
              ...styles.button,
              ...styles.squareButton,
              opacity: drawingMode !== null ? 0.6 : 1,
              cursor: drawingMode !== null ? "not-allowed" : "pointer",
            }}
          >
            Square
          </button>
        </div>
      </div>

      {/* Map */}
      <div style={styles.mapContainer}>
        <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <DrawingTool onComplete={handleDrawingComplete} drawingMode={drawingMode} setDrawingMode={setDrawingMode} />

          {/* Render Territories */}
          {activeTabData &&
            activeTabData.territories
              .filter((t) => t.active)
              .map((territory) => (
                <Polygon
                  key={territory.id}
                  positions={territory.coordinates}
                  pathOptions={{ color: territory.color, fillOpacity: 0.2, weight: 3 }}
                >
                  <Popup>
                    <div style={styles.popup}>
                      <h3 style={styles.popupTitle}>{territory.name}</h3>
                      <p style={styles.popupText}>Tab: {activeTabData.name}</p>
                      <p style={styles.popupText}>
                        Trucks inside: {trucks.filter((t) => isPointInPolygon([t.lat, t.lng], territory.coordinates)).length}
                      </p>
                    </div>
                  </Popup>
                </Polygon>
              ))}

          {/* Trucks, Incidents, Cities */}
          {trucks.map((truck) => (
            <Marker
              key={truck.id}
              position={[truck.lat, truck.lng]}
              icon={L.divIcon({
                className: "truck-marker",
                html: `<div style="width:50px;height:50px;"><svg width="50" height="50" viewBox="0 0 40 40"><rect x="8" y="15" width="20" height="12" fill="${truck.status === "available" ? "#22c55e" : "#f97316"}" stroke="#000" strokeWidth="1.5"/><rect x="20" y="10" width="8" height="5" fill="${truck.status === "available" ? "#22c55e" : "#f97316"}" stroke="#000" strokeWidth="1.5"/><circle cx="13" cy="28" r="3" fill="#333"/><circle cx="23" cy="28" r="3" fill="#333"/></svg></div>`,
                iconSize: [50, 50],
                iconAnchor: [25, 25],
              })}
            >
              <Popup>
                <div style={styles.popup}>
                  <h3 style={styles.popupTitle}>{truck.name}</h3>
                  <p style={styles.popupText}>Status: <strong style={{ color: truck.status === "available" ? "#16a34a" : "#ea580c" }}>{truck.status}</strong></p>
                </div>
              </Popup>
            </Marker>
          ))}

          {incidents.map((i) => {
            const config = {
              "Tire Change": { color: "#3b82f6", icon: "Wrench", bg: "#dbeafe" },
              "Gas Delivery": { color: "#eab308", icon: "Fuel", bg: "#fef9c3" },
              "Accident": { color: "#ef4444", icon: "Warning", bg: "#fee2e2" },
            }
            const { color, icon, bg } = config[i.type]
            return (
              <Marker
                key={i.id}
                position={[i.lat, i.lng]}
                icon={L.divIcon({
                  html: `<div style="width:45px;height:45px;"><svg width="45" height="45"><circle cx="22.5" cy="22.5" r="15" fill="${bg}" stroke="${color}" strokeWidth="2"/><text x="22.5" y="26" fontSize="18" text-anchor="middle">${icon}</text></svg></div>`,
                  iconSize: [45, 45],
                  iconAnchor: [22.5, 22.5],
                })}
              >
                <Popup>
                  <div style={styles.popup}>
                    <h3 style={styles.popupTitle}>{i.type}</h3>
                    <p style={styles.popupText}>Status: <strong style={{ color: i.status === "pending" ? "#ca8a04" : "#dc2626" }}>{i.status}</strong></p>
                  </div>
                </Popup>
              </Marker>
            )
          })}

          {initialCities.map((city) => (
            <Marker
              key={city.id}
              position={[city.lat, city.lng]}
              icon={L.divIcon({
                html: `<div style="width:40px;height:40px;"><svg width="40" height="40"><circle cx="20" cy="20" r="16" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2"/><text x="20" y="24" fontSize="16" text-anchor="middle" fontWeight="bold">City</text></svg></div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20],
              })}
            >
              <Popup>
                <div style={styles.popup}>
                  <h3 style={styles.popupTitle}>{city.name}</h3>
                  <p style={styles.popupText}>City Marker</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Territory Panel */}
        {activeTabData ? (
          <div style={styles.territoryPanel}>
            <h3 style={styles.legendTitle}>{activeTabData.name} Territories</h3>
            <div style={{ maxHeight: 340, overflowY: "auto" }}>
              {activeTabData.territories.map((terr) => (
                <div key={terr.id} style={{ marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <input type="checkbox" checked={terr.active} onChange={() => toggleTerritory(activeTab, terr.id)} style={{ width: 16, height: 16 }} />
                    <div style={{ ...styles.colorBox, backgroundColor: terr.color }} />
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{terr.name}</span>
                    <button onClick={() => deleteTerritory(activeTab, terr.id)} style={styles.deleteButton}>
                      Delete
                    </button>
                  </div>
                  {terr.cities?.length > 0 ? (
                    <div style={{ marginLeft: 24, display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {terr.cities.map((c, i) => (
                        <span key={i} style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: 4, fontSize: 11 }}>
                          {c}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ marginLeft: 24, fontSize: 11, color: "#9ca3af" }}>No cities</p>
                  )}
                </div>
              ))}
              {activeTabData.territories.length === 0 && (
                <p style={{ textAlign: "center", color: "#64748b", fontSize: 12 }}>Draw a territory!</p>
              )}
            </div>
          </div>
        ) : (
          <div style={styles.territoryPanel}>
            <h3 style={styles.legendTitle}>No Tab Yet</h3>
            <p style={{ fontSize: 12, color: "#64748b", textAlign: "center" }}>
              Draw a shape to create your first tab automatically!
            </p>
          </div>
        )}

        {/* Legend */}
        <div style={styles.legend}>
          <h3 style={styles.legendTitle}>Map Legend</h3>
          <div style={styles.legendItem}><div style={{ ...styles.colorBox, background: "#22c55e" }}></div><span>Available Truck</span></div>
          <div style={styles.legendItem}><div style={{ ...styles.colorBox, background: "#f97316" }}></div><span>Busy Truck</span></div>
          <div style={styles.legendItem}><span style={{ fontSize: "16px" }}>Wrench</span><span>Tire Change</span></div>
          <div style={styles.legendItem}><span style={{ fontSize: "16px" }}>Fuel</span><span>Gas Delivery</span></div>
          <div style={styles.legendItem}><span style={{ fontSize: "16px" }}>Warning</span><span>Accident</span></div>
          <div style={styles.legendItem}><div style={{ ...styles.colorBox, background: "#6366f1" }}></div><span>City</span></div>
        </div>
      </div>

      {/* Territory Modal */}
      {showTerritoryModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Name Your Territory</h2>
            <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 12px 0" }}>
              Adding to: <strong>{activeTabData?.name || "New Tab (Auto-Created)"}</strong>
            </p>
            <input type="text" value={newTerritoryName} onChange={(e) => setNewTerritoryName(e.target.value)} placeholder="Enter name..." style={styles.modalInput} autoFocus />
            <input type="text" value={newTerritoryCities} onChange={(e) => setNewTerritoryCities(e.target.value)} placeholder="Cities (auto-detected)" style={styles.modalInput} />
            <div style={styles.modalButtons}>
              <button onClick={handleSaveTerritory} disabled={!newTerritoryName.trim()} style={{ ...styles.modalButton, ...styles.saveButton, opacity: !newTerritoryName.trim() ? 0.6 : 1 }}>
                Save Territory
              </button>
              <button onClick={() => { setShowTerritoryModal(false); setNewTerritoryName(""); setNewTerritoryCities(""); setNewTerritoryCoords(null); }} style={{ ...styles.modalButton, ...styles.cancelButton }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Tab Modal */}
      {showTabModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Create New Tab</h2>
            <input type="text" value={newTabName} onChange={(e) => setNewTabName(e.target.value)} placeholder="Enter tab name..." style={styles.modalInput} autoFocus />
            <div style={styles.modalButtons}>
              <button onClick={handleCreateTab} disabled={!newTabName.trim()} style={{ ...styles.modalButton, ...styles.saveButton, opacity: !newTabName.trim() ? 0.6 : 1 }}>
                Create Tab
              </button>
              <button onClick={() => { setShowTabModal(false); setNewTabName(""); }} style={{ ...styles.modalButton, ...styles.cancelButton }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.footer}>
        <p style={{ margin: 0, opacity: 0.9 }}>Auto-create tab on first draw | Draw territories | Drag & drop tabs | Auto-saved</p>
      </div>
    </div>
  )
}

export default FoxtowMap