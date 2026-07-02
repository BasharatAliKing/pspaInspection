import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ArrowLeft, Layers, Search } from "lucide-react";

// ── Map themes ────────────────────────────────────────────────────────────────
const MAP_THEMES = [
  { id: "satellite", label: "Satellite", style: "mapbox://styles/mapbox/satellite-streets-v12" },
  { id: "streets",   label: "Streets",   style: "mapbox://styles/mapbox/streets-v12"           },
  { id: "light",     label: "Light",     style: "mapbox://styles/mapbox/light-v11"              },
  { id: "dark",      label: "Dark",      style: "mapbox://styles/mapbox/dark-v11"               },
];
export function useThemeSafe() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("pspa-theme");
    return saved === "light" ? "light" : "dark";
  });
  const isLight = theme === "light";
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    localStorage.setItem("pspa-theme", next);
    setTheme(next);
  };
  return { theme, isLight, toggleTheme };
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const MAPBOX_ACCESS_TOKEN =
  import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ||
  import.meta.env.VITE_MAPBOX_TOKEN ||
  "";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://127.0.0.1:8000";

const TYPE_COLORS = {
  RO: "#3b82f6",
  UF: "#22c55e",
  MF: "#f97316",
};

const TYPE_PALETTE = [
  "#3b82f6",
  "#22c55e",
  "#f97316",
];

const CATEGORY_COLORS = {
  Revamped: "#10b981",
  New: "#8b5cf6",
  Old: "#f59e0b",
  Functional: "#f97316",
  Dysfunctional: "#ef4444",
  Abondoned : "#6366f1"
};

const DISTRICT_COLORS = {
  Attock: "#3b82f6",
  Bahawalpur: "#22c55e",
  Chakwal: "#f59e0b",
  "D G Khan": "#ef4444",
  "D.G. Khan": "#ef4444",
  "Dera Ghazi Khan": "#ef4444",
  Muzaffargarh: "#a855f7",
  "Rahim Yar Khan": "#14b8a6",
  Rajanpur: "#f97316",
  Rawalpindi: "#6366f1",
  Lahore: "#3b82f6",
  Faisalabad: "#22c55e",
  Multan: "#f59e0b",
  Gujranwala: "#ef4444",
  Sargodha: "#a855f7",
  Sahiwal: "#14b8a6",
};

const DISTRICT_PALETTE = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#06b6d4",
  "#84cc16",
  "#ec4899",
  "#8b5cf6",
];

const MAP_SOURCE_ID = "pspa-assets-source";
const CLUSTER_LAYER_ID = "asset-clusters";
const CLUSTER_COUNT_LAYER_ID = "asset-cluster-count";
const UNCLUSTERED_LAYER_ID = "asset-unclustered-points";

function normalizeListResponse(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.results)) return result.results;
  if (Array.isArray(result?.data?.results)) return result.data.results;
  return [];
}

function toTitleCase(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function cleanValue(value, fallback = "—") {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  return text || fallback;
}

function getLabel(value, nameKeys = []) {
  if (value === null || value === undefined || value === "") return "—";

  if (typeof value === "object") {
    for (const key of nameKeys) {
      if (
        value?.[key] !== null &&
        value?.[key] !== undefined &&
        value?.[key] !== ""
      ) {
        return String(value[key]);
      }
    }

    return (
      value?.name ||
      value?.title ||
      value?.label ||
      value?.full_name ||
      value?.username ||
      value?.id ||
      "—"
    );
  }

  return String(value);
}

function getAssetCode(asset) {
  if (asset?.site_code) return asset.site_code;
  if (asset?.asset_code) return asset.asset_code;
  if (asset?.code) return asset.code;
  if (asset?.id) return `SITE-${String(asset.id).padStart(4, "0")}`;
  return "SITE-0000";
}

function parseCoordinate(value) {
  if (value === null || value === undefined || value === "") return null;

  const numericValue = Number(String(value).replace(/[° ,]/g, ""));
  return Number.isFinite(numericValue) ? numericValue : null;
}

function isValidCoordinate(lat, lon) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lon) <= 180 &&
    !(lat === 0 && lon === 0)
  );
}

function getLatitude(asset) {
  return parseCoordinate(
    asset?.latitude ??
      asset?.lat ??
      asset?.y ??
      asset?.location_latitude ??
      asset?.coordinates?.lat ??
      asset?.coordinates?.latitude ??
      asset?.geometry?.coordinates?.[1],
  );
}

function getLongitude(asset) {
  return parseCoordinate(
    asset?.longitude ??
      asset?.lon ??
      asset?.lng ??
      asset?.x ??
      asset?.location_longitude ??
      asset?.coordinates?.lon ??
      asset?.coordinates?.lng ??
      asset?.coordinates?.longitude ??
      asset?.geometry?.coordinates?.[0],
  );
}

function getDistrictLabel(asset) {
  return cleanValue(
    asset?.district_name ||
      getLabel(asset?.district, ["district_name", "name", "title"]),
    "Unassigned",
  );
}

function getDivisionLabel(asset) {
  return cleanValue(
    asset?.division_name ||
      getLabel(asset?.division, ["division_name", "name", "title"]),
    "—",
  );
}

function getTehsilLabel(asset) {
  return cleanValue(
    asset?.tehsil_name ||
      getLabel(asset?.tehsil, ["tehsil_name", "name", "title"]),
    "—",
  );
}

function getAreaLabel(asset) {
  return cleanValue(
    asset?.area_name || getLabel(asset?.area, ["area_name", "name", "title"]),
    "—",
  );
}

function getTypeLabel(asset) {
  return cleanValue(
    asset?.asset_type || asset?.type || asset?.category,
    "Asset",
  );
}

function normalizeSite(site, index) {
  const lat = getLatitude(site);
  const lon = getLongitude(site);

  return {
    id: site?.id ?? index + 1,
    dbId: site?.id,
    sr: index + 1,

    site: cleanValue(site?.site_name, "Unnamed Site"),
    name: cleanValue(site?.site_name, "Unnamed Site"),

    contractNo: cleanValue(site?.contract_no),
    zone: getLabel(site?.zone, ["name"]),
    division: getLabel(site?.division, ["name"]),
    district: getLabel(site?.district, ["name"]),
    tehsil: getLabel(site?.tehsil, ["name"]),

    type: cleanValue(site?.type),
    category: cleanValue(site?.category),

    lat,
    lon,
    hasCoordinates: isValidCoordinate(lat, lon),

    createdAt: cleanValue(site?.created_at),
    raw: site,
  };
}
function buildColorMap(items, fixedColors, palette) {
  return items.reduce((acc, item, index) => {
    acc[item] = fixedColors[item] || palette[index % palette.length];
    return acc;
  }, {});
}

function getMatchColorExpression(colorMap, fallback = "#3b82f6") {
  const entries = Object.entries(colorMap);

  if (!entries.length) return fallback;

  const expression = ["match", ["get", "type"]];

  entries.forEach(([label, color]) => {
    expression.push(label, color);
  });

  expression.push(fallback);
  return expression;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function sitesToGeoJSON(sites) {
  return {
    type: "FeatureCollection",
    features: sites.map((site) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [site.lon, site.lat],
      },
      properties: {
        id: site.id,
        site: site.site,
        district: site.district,
        division: site.division,
        tehsil: site.tehsil,
        type: site.type,
        category: site.category,
      },
    })),
  };
}

function getPopupHtml(asset, typeColor, categoryColor = "#8b5cf6", isLight = false) {
  const reportAssetId = encodeURIComponent(
    String(asset.dbId || asset.id || ""),
  );
  const bg = isLight ? "#ffffff" : "#1a2236";
  const textColor = isLight ? "#1e293b" : "#e8edf5";
  const subColor = isLight ? "#64748b" : "#aaa";
  const btnBg = isLight ? "#f1f5f9" : "#1a2236";
  const btnBorder = isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)";

  return `
    <div style="min-width:170px;font-family:DM Sans,Arial,sans-serif;color:${textColor};background:${bg};">
      <b>${escapeHtml(asset.site)}</b><br />
      <span style="font-size:10px;color:${subColor};">${escapeHtml(asset.district)} · ${escapeHtml(asset.tehsil)}</span><br />
      <div style="margin-top:5px;display:flex;gap:4px;flex-wrap:wrap;">
        <span style="display:inline-block;padding:2px 8px;border-radius:12px;background:${typeColor}22;color:${typeColor};font-size:10px;font-weight:600;">${escapeHtml(asset.type)}</span>
        <span style="display:inline-block;padding:2px 8px;border-radius:12px;background:${categoryColor}22;color:${categoryColor};font-size:10px;font-weight:600;">${escapeHtml(asset.category)}</span>
      </div>
      <div style="margin-top:6px;">
        <button style="font-size:10px;padding:5px 8px;border-radius:6px;border:1px solid ${btnBorder};background:${btnBg};color:${textColor};cursor:pointer;" onclick="window.dispatchEvent(new CustomEvent('asset-map-report-issue',{detail:{assetId:'${reportAssetId}'}}))">📢 Report issue</button>
      </div>
    </div>
  `;
}

function normalizeFeatureProperties(feature) {
  const props = feature?.properties || {};
  const coordinates = feature?.geometry?.coordinates || [props.lon, props.lat];

  return {
    id: props.id,
    dbId: props.dbId,
    sr: Number(props.sr),
    code: props.code,
    site: props.site,
    name: props.name,
    district: props.district,
    division: props.division,
    tehsil: props.tehsil,
    area: props.area,
    type: props.type,
    category: props.category,
    status: props.status,
    location: props.location,
    lat: Number(props.lat ?? coordinates[1]),
    lon: Number(props.lon ?? coordinates[0]),
  };
}

function fitMapToAssets(map, assets, options = {}) {
  if (!map || !assets.length) return;

  if (assets.length === 1) {
    map.flyTo({
      center: [assets[0].lon, assets[0].lat],
      zoom: options.singleZoom || 12,
      duration: options.duration ?? 450,
      essential: true,
    });
    return;
  }

  const bounds = new mapboxgl.LngLatBounds();
  assets.forEach((asset) => bounds.extend([asset.lon, asset.lat]));

  map.fitBounds(bounds, {
    padding: options.padding || 35,
    maxZoom: options.maxZoom || 11,
    duration: options.duration ?? 450,
  });
}

export default function InspectionSiteMap() {
  const navigate = useNavigate();
  const { isLight } = useThemeSafe();

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const didFitInitialDataRef = useRef(false);
  const typeColorMapRef = useRef({});
  const isLightRef = useRef(isLight);

  // Keep isLightRef in sync so popup callbacks always have the current theme
  useEffect(() => {
    isLightRef.current = isLight;
  }, [isLight]);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [mapTheme, setMapTheme] = useState("streets");
  const [inspectionSites, setInspectionSites] = useState([]);

  const fetchinspectionSites= useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/list-inspection-site/`);
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result?.message || result?.data || "Failed to load site.",
        );
      }
    
      setInspectionSites(normalizeListResponse(result));
    } catch (err) {
      console.error("Error loading inspectionSitesmap data", err);
      setAssets([]);
      setError(err.message || "Failed to load assets.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
  fetchinspectionSites();
}, [fetchinspectionSites]);

  useEffect(() => {
    document.title = "PSPA CMS — siteMonitoring Map";
  }, []);

  // useEffect(() => {
  //   const handleReportIssue = (event) => {
  //     const assetId = event?.detail?.assetId;
  //     navigate(
  //       assetId
  //         ? `/register-complaint?asset=${assetId}`
  //         : "/register-complaint",
  //     );
  //   };

  //   window.addEventListener("asset-map-report-issue", handleReportIssue);
  //   return () =>
  //     window.removeEventListener("asset-map-report-issue", handleReportIssue);
  // }, [navigate]);

  const normalizedSites = useMemo(() => {
  return inspectionSites.map((site, index) => normalizeSite(site, index));
}, [inspectionSites]);

  const mappedSites = useMemo(() => {
  return normalizedSites.filter((asset) => asset.hasCoordinates);
}, [normalizedSites]);

  const missingCoordinatesCount = normalizedSites.length - mappedSites.length;

  const districtOptions = useMemo(() => {
    return Array.from(
      new Set(
        mappedSites
          .map((asset) => asset.district)
          .filter(
            (district) =>
              district && district !== "—" && district !== "Unassigned",
          ),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [mappedSites]);

  const typeOptions = useMemo(() => {
    return Array.from(
      new Set(mappedSites.map((asset) => asset.type).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b));
  }, [mappedSites]);

  const typeColorMap = useMemo(() => {
    return buildColorMap(typeOptions, TYPE_COLORS, TYPE_PALETTE);
  }, [typeOptions]);

  const districtColorMap = useMemo(() => {
    return buildColorMap(districtOptions, DISTRICT_COLORS, DISTRICT_PALETTE);
  }, [districtOptions]);

  const typeColorExpression = useMemo(() => {
    return getMatchColorExpression(typeColorMap);
  }, [typeColorMap]);

  useEffect(() => {
    typeColorMapRef.current = typeColorMap;
  }, [typeColorMap]);

  const filteredSites= useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return mappedSites.filter((asset) => {
      const searchableText = [
        asset.site,
        asset.name,
        asset.code,
        asset.type,
        asset.status,
        asset.district,
        asset.division,
        asset.tehsil,
        asset.area,
        asset.location,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !q || searchableText.includes(q);
      const matchesDistrict =
        !districtFilter || asset.district === districtFilter;
      const matchesType = !typeFilter || asset.type === typeFilter;

      return matchesSearch && matchesDistrict && matchesType;
    });
  }, [districtFilter, mappedSites, searchTerm, typeFilter]);

  const filteredGeoJSON = useMemo(
    () => sitesToGeoJSON(filteredSites),
    [filteredSites],
  );

  const visibleinspectionSites= useMemo(
    () => filteredSites.slice(0, 220),
    [filteredSites],
  );

  const typeBreakdown = useMemo(() => {
    const counts = mappedSites.reduce((acc, asset) => {
      acc[asset.type] = (acc[asset.type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [mappedSites]);

  const districtBreakdown = useMemo(() => {
    const counts = filteredSites.reduce((acc, asset) => {
      acc[asset.district] = (acc[asset.district] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [filteredSites]);

  useEffect(() => {
    if (!MAPBOX_ACCESS_TOKEN || !mapContainerRef.current || mapRef.current) {
      return undefined;
    }

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAP_THEMES.find(t => t.id === mapTheme)?.style
        ?? (isLight ? "mapbox://styles/mapbox/light-v11" : "mapbox://styles/mapbox/dark-v11"),
      center: [71.5, 30.5],
      zoom: 6.3,
      minZoom: 5,
      maxZoom: 18,
      attributionControl: true,
    });

    map.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: false }),
      "top-left",
    );

    mapRef.current = map;

    const handleClusterClick = (event) => {
      const features = map.queryRenderedFeatures(event.point, {
        layers: [CLUSTER_LAYER_ID],
      });

      if (!features.length) return;

      const clusterId = features[0].properties.cluster_id;
      const source = map.getSource(MAP_SOURCE_ID);
      const center = features[0].geometry.coordinates;

      const zoomToCluster = (zoom) => {
        map.easeTo({
          center,
          zoom,
          duration: 550,
        });
      };

      try {
        const maybeZoom = source.getClusterExpansionZoom(
          clusterId,
          (clusterError, zoom) => {
            if (!clusterError && typeof zoom === "number") zoomToCluster(zoom);
          },
        );

        if (typeof maybeZoom === "number") {
          zoomToCluster(maybeZoom);
        } else if (maybeZoom && typeof maybeZoom.then === "function") {
          maybeZoom.then(zoomToCluster).catch(() => {});
        }
      } catch (zoomError) {
        console.error("Failed to zoom to cluster:", zoomError);
      }
    };

    const handlePointClick = (event) => {
      const feature = event.features?.[0];
      if (!feature) return;

      const site = normalizeFeatureProperties(feature);

      const typeColor = typeColorMapRef.current[site.type] || "#3b82f6";
      const categoryColor = CATEGORY_COLORS[site.category] || "#8b5cf6";

      setSelectedAsset(site);

      popupRef.current?.remove();
      popupRef.current = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        maxWidth: "260px",
      })
        .setLngLat([site.lon, site.lat])
        .setHTML(getPopupHtml(site, typeColor, categoryColor, isLightRef.current))
        .addTo(map);
    };

    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    const handleLoad = () => {
      map.addSource(MAP_SOURCE_ID, {
        type: "geojson",
        data: filteredGeoJSON,
        cluster: true,
        clusterMaxZoom: 13,
        clusterRadius: 45,
      });

      map.addLayer({
        id: CLUSTER_LAYER_ID,
        type: "circle",
        source: MAP_SOURCE_ID,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#3b82f6",
            100,
            "#f59e0b",
            500,
            "#ef4444",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            17,
            100,
            22,
            500,
            28,
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "rgba(255,255,255,0.85)",
          "circle-opacity": 0.92,
        },
      });

      map.addLayer({
        id: CLUSTER_COUNT_LAYER_ID,
        type: "symbol",
        source: MAP_SOURCE_ID,
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      map.addLayer({
        id: UNCLUSTERED_LAYER_ID,
        type: "circle",
        source: MAP_SOURCE_ID,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": typeColorExpression,
          "circle-radius": 5,
          "circle-stroke-width": 2,
          "circle-stroke-color": "rgba(255,255,255,0.92)",
          "circle-opacity": 0.95,
        },
      });

      map.fitBounds(
        [
          [69.0, 27.6],
          [75.5, 34.2],
        ],
        { padding: 30, duration: 0 },
      );

      map.on("click", CLUSTER_LAYER_ID, handleClusterClick);
      map.on("click", UNCLUSTERED_LAYER_ID, handlePointClick);
      map.on("mouseenter", CLUSTER_LAYER_ID, handleMouseEnter);
      map.on("mouseleave", CLUSTER_LAYER_ID, handleMouseLeave);
      map.on("mouseenter", UNCLUSTERED_LAYER_ID, handleMouseEnter);
      map.on("mouseleave", UNCLUSTERED_LAYER_ID, handleMouseLeave);

      setMapLoaded(true);
    };

    map.on("load", handleLoad);

    return () => {
      popupRef.current?.remove();
      map.off("load", handleLoad);

      if (map.getLayer(CLUSTER_LAYER_ID)) {
        map.off("click", CLUSTER_LAYER_ID, handleClusterClick);
        map.off("mouseenter", CLUSTER_LAYER_ID, handleMouseEnter);
        map.off("mouseleave", CLUSTER_LAYER_ID, handleMouseLeave);
      }

      if (map.getLayer(UNCLUSTERED_LAYER_ID)) {
        map.off("click", UNCLUSTERED_LAYER_ID, handlePointClick);
        map.off("mouseenter", UNCLUSTERED_LAYER_ID, handleMouseEnter);
        map.off("mouseleave", UNCLUSTERED_LAYER_ID, handleMouseLeave);
      }

      map.remove();
      mapRef.current = null;
      setMapLoaded(false);
      didFitInitialDataRef.current = false;
    };
    // Only initialize Mapbox once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switch map style when theme changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const newStyle = MAP_THEMES.find(t => t.id === mapTheme)?.style
      ?? (isLight ? "mapbox://styles/mapbox/light-v11" : "mapbox://styles/mapbox/dark-v11");

    // After style change, layers are removed — re-add them on styledata
    const handleStyleData = () => {
      if (!map.getSource(MAP_SOURCE_ID)) {
        map.addSource(MAP_SOURCE_ID, {
          type: "geojson",
          data: filteredGeoJSON,
          cluster: true,
          clusterMaxZoom: 13,
          clusterRadius: 45,
        });
      }

      if (!map.getLayer(CLUSTER_LAYER_ID)) {
        map.addLayer({
          id: CLUSTER_LAYER_ID,
          type: "circle",
          source: MAP_SOURCE_ID,
          filter: ["has", "point_count"],
          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#3b82f6",
              100,
              "#f59e0b",
              500,
              "#ef4444",
            ],
            "circle-radius": ["step", ["get", "point_count"], 17, 100, 22, 500, 28],
            "circle-stroke-width": 2,
            "circle-stroke-color": "rgba(255,255,255,0.85)",
            "circle-opacity": 0.92,
          },
        });
      }

      if (!map.getLayer(CLUSTER_COUNT_LAYER_ID)) {
        map.addLayer({
          id: CLUSTER_COUNT_LAYER_ID,
          type: "symbol",
          source: MAP_SOURCE_ID,
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
          paint: { "text-color": "#ffffff" },
        });
      }

      if (!map.getLayer(UNCLUSTERED_LAYER_ID)) {
        map.addLayer({
          id: UNCLUSTERED_LAYER_ID,
          type: "circle",
          source: MAP_SOURCE_ID,
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": typeColorExpression,
            "circle-radius": 5,
            "circle-stroke-width": 2,
            "circle-stroke-color": "rgba(255,255,255,0.92)",
            "circle-opacity": 0.95,
          },
        });
      }
    };

    map.once("styledata", handleStyleData);
    map.setStyle(newStyle);

    return () => {
      map.off("styledata", handleStyleData);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLight, mapTheme]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapLoaded || !map) return;

    const source = map.getSource(MAP_SOURCE_ID);
    if (!source) return;

    source.setData(filteredGeoJSON);

    if (map.getLayer(UNCLUSTERED_LAYER_ID)) {
      map.setPaintProperty(
        UNCLUSTERED_LAYER_ID,
        "circle-color",
        typeColorExpression,
      );
    }

    if (!filteredSites.length) return;

    const shouldFitMap =
      !didFitInitialDataRef.current ||
      Boolean(searchTerm.trim()) ||
      Boolean(districtFilter) ||
      Boolean(typeFilter);

    if (shouldFitMap) {
      fitMapToAssets(map, filteredSites, {
        padding: 35,
        maxZoom: 11,
        duration: didFitInitialDataRef.current ? 450 : 0,
      });
      didFitInitialDataRef.current = true;
    }
  }, [
    districtFilter,
    filteredSites,
    filteredGeoJSON,
    mapLoaded,
    searchTerm,
    typeColorExpression,
    typeFilter,
  ]);

  const focusSite= (asset) => {
    const map = mapRef.current;
    const typeColor = typeColorMap[asset.type] || "#3b82f6";
    const categoryColor = CATEGORY_COLORS[asset.category] || "#8b5cf6";

    setSelectedAsset(asset);

    if (!map) return;

    map.flyTo({
      center: [asset.lon, asset.lat],
      zoom: 14,
      duration: 650,
      essential: true,
    });

    popupRef.current?.remove();
    popupRef.current = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
      maxWidth: "260px",
    })
      .setLngLat([asset.lon, asset.lat])
      .setHTML(getPopupHtml(asset, typeColor, categoryColor, isLightRef.current))
      .addTo(map);
  };

  const closeDetail = () => setSelectedAsset(null);

  return (
    <div className={`assets-map-root fixed inset-0 z-[9999] overflow-hidden ${isLight ? "bg-slate-100 text-slate-900" : "bg-[#0b0f1a] text-[#e8edf5]"}`}>
      <style>{`
        .assets-map-root {
          --asset-surface: ${isLight ? "#ffffff" : "#111827"};
          --asset-surface2: ${isLight ? "#f1f5f9" : "#1a2236"};
          --asset-border: ${isLight ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.10)"};
          --asset-text: ${isLight ? "#1e293b" : "#e8edf5"};
          --asset-subtext: ${isLight ? "#64748b" : "#8a95a8"};
        }
        .assets-map-root .mapboxgl-map {
          font-family: "DM Sans", Arial, sans-serif;
        }
        .assets-map-root .mapboxgl-popup-content {
          background: var(--asset-surface) !important;
          border: 1px solid var(--asset-border) !important;
          color: var(--asset-text) !important;
          border-radius: 8px !important;
          box-shadow: 0 8px 24px ${isLight ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.35)"} !important;
          padding: 10px 14px !important;
        }
        .assets-map-root .mapboxgl-popup-tip {
          border-top-color: var(--asset-surface) !important;
          border-bottom-color: var(--asset-surface) !important;
        }
        .assets-map-root .mapboxgl-popup-close-button {
          color: var(--asset-text) !important;
          font-size: 16px !important;
          padding: 3px 7px !important;
        }
        .assets-map-root .mapboxgl-ctrl-group {
          background: var(--asset-surface) !important;
          border: 1px solid var(--asset-border) !important;
        }
        .assets-map-root .mapboxgl-ctrl-group button {
          ${isLight ? "" : "filter: invert(1);"}
        }
        .assets-map-root .mapboxgl-ctrl-attrib {
          background: ${isLight ? "rgba(255,255,255,0.78)" : "rgba(17,24,39,0.78)"} !important;
          color: ${isLight ? "#64748b" : "#8a95a8"} !important;
        }
        .assets-map-root .mapboxgl-ctrl-attrib a {
          color: #3b82f6 !important;
        }
        @keyframes assetFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className={`pointer-events-none absolute inset-0 z-0 ${isLight ? "bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)]" : "bg-[linear-gradient(rgba(59,130,246,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.025)_1px,transparent_1px)]"} bg-[length:44px_44px]`} />

      <div className="relative z-10 flex h-screen flex-col">
        <header className={`flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-7 py-[15px] ${isLight ? "border-black/10 bg-white" : "border-white/10 bg-[#111827]"}`}>
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-md border transition ${isLight ? "border-black/10 bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900" : "border-white/10 bg-[#1a2236] text-[#8a95a8] hover:bg-[#212d42] hover:text-white"}`}
                title="Back to dashboard"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <div>
                <h1 className={`font-serif text-[20px] font-light tracking-[-0.03em] ${isLight ? "text-slate-900" : "text-[#e8edf5]"}`}>
                  Inspection Site Map
                </h1>
                <p className={`mt-0.5 text-[12px] ${isLight ? "text-slate-500" : "text-[#8a95a8]"}`}>
                  {isLoading
                    ? "Loading sites from backend..."
                    : `${mappedSites.length.toLocaleString()} mapped sites · ${districtOptions.length.toLocaleString()} districts · Punjab, Pakistan`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-500">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Backend feed
            </span>

            {/* <button
              type="button"
              onClick={() => navigate("/register-complaint")}
              className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-[12px] font-medium text-white transition hover:bg-blue-700"
            >
              + Register complaint
            </button> */}
          </div>
        </header>

        <main className="grid min-h-0 flex-1 grid-cols-[280px_minmax(0,1fr)] overflow-hidden">
          <aside className={`flex min-h-0 flex-col overflow-hidden border-r ${isLight ? "border-black/10 bg-white" : "border-white/10 bg-[#111827]"}`}>
            <div className={`shrink-0 border-b px-3.5 py-3 ${isLight ? "border-black/10" : "border-white/10"}`}>
              <div className={`mb-2.5 text-[12px] font-medium ${isLight ? "text-slate-700" : ""}`}>
                Filter & search
              </div>

              <div className="relative mb-2">
                <Search className={`pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${isLight ? "text-slate-400" : "text-[#4f5a6e]"}`} />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Site name, type, tehsil..."
                  className={`w-full rounded-md border py-2 pl-8 pr-3 text-[12px] outline-none transition placeholder:text-slate-400 focus:border-blue-500/50 ${isLight ? "border-black/10 bg-slate-50 text-slate-900" : "border-white/10 bg-[#1a2236] text-[#e8edf5] placeholder:text-slate-500"}`}
                />
              </div>

              <select
                value={districtFilter}
                onChange={(event) => setDistrictFilter(event.target.value)}
                className={`mb-2 w-full cursor-pointer rounded-md border px-2.5 py-2 text-[12px] outline-none transition focus:border-blue-500/50 ${isLight ? "border-black/10 bg-slate-50 text-slate-900" : "border-white/10 bg-[#1a2236] text-[#e8edf5]"}`}
              >
                <option value="">
                  All districts ({districtOptions.length})
                </option>
                {districtOptions.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>

              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className={`w-full cursor-pointer rounded-md border px-2.5 py-2 text-[12px] outline-none transition focus:border-blue-500/50 ${isLight ? "border-black/10 bg-slate-50 text-slate-900" : "border-white/10 bg-[#1a2236] text-[#e8edf5]"}`}
              >
                <option value="">All types</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className={`grid shrink-0 grid-cols-2 gap-1.5 border-b px-3.5 py-2.5 ${isLight ? "border-black/10" : "border-white/10"}`}>
              <MapStat
                label="Total Sites"
                value={
                  isLoading ? "..." : normalizedSites.length.toLocaleString()
                }
                colorClass="text-blue-500"
                isLight={isLight}
              />
              <MapStat
                label="Mapped"
                value={
                  isLoading ? "..." : filteredSites.length.toLocaleString()
                }
                colorClass="text-teal-500"
                isLight={isLight}
              />
              <MapStat
                label="Districts"
                value={districtOptions.length.toLocaleString()}
                colorClass="text-amber-500"
                isLight={isLight}
              />
              <MapStat
                label="No GPS"
                value={missingCoordinatesCount.toLocaleString()}
                colorClass="text-purple-500"
                isLight={isLight}
              />
            </div>

            {error ? (
              <div className="border-b border-red-500/20 bg-red-500/10 px-3.5 py-3 text-[12px] leading-5 text-red-500">
                {error}
              </div>
            ) : null}

            <div className="min-h-0 flex-1 overflow-y-auto">
              {isLoading ? (
                <div className={`px-4 py-6 text-center text-[12px] ${isLight ? "text-slate-500" : "text-[#8a95a8]"}`}>
                  Loading inspectionSitesfrom backend...
                </div>
              ) : null}

              {!isLoading &&
                visibleinspectionSites.map((asset) => {
                  const isSelected = selectedAsset?.id === asset.id;
                  const typeColor = typeColorMap[asset.type] || "#3b82f6";

                  return (
                    <button
                      key={`${asset.id}-${asset.sr}`}
                      type="button"
                      onClick={() => focusSite(asset)}
                      className={cn(
                        "flex w-full items-start gap-2 border-b border-l-[3px] px-3.5 py-2.5 text-left transition",
                        isSelected
                          ? `border-l-blue-500 ${isLight ? "border-b-black/10 bg-blue-50" : "border-b-white/10 bg-blue-500/10"}`
                          : `border-l-transparent ${isLight ? "border-b-black/10 hover:bg-slate-50" : "border-b-white/10 hover:bg-[#1a2236]"}`,
                      )}
                    >
                      <span
                        className="mt-1 h-[9px] w-[9px] shrink-0 rounded-full"
                        style={{ background: typeColor }}
                      />
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate text-[12px] font-medium ${isLight ? "text-slate-800" : "text-[#e8edf5]"}`}>
                          {asset.site}
                        </span>
                        <span className={`block truncate text-[10px] ${isLight ? "text-slate-400" : "text-[#4f5a6e]"}`}>
                          {asset.district} · {asset.tehsil}
                        </span>
                      </span>
                    </button>
                  );
                })}

              {!isLoading && filteredSites.length > 220 ? (
                <div className={`px-3 py-3 text-center text-[11px] ${isLight ? "text-slate-400" : "text-[#4f5a6e]"}`}>
                  + {filteredSites.length - 220} more (refine search)
                </div>
              ) : null}

              {!isLoading && !filteredSites.length ? (
                <div className={`px-4 py-6 text-center text-[12px] ${isLight ? "text-slate-500" : "text-[#8a95a8]"}`}>
                  {mappedSites.length
                    ? "No inspectionSitesmatch your current filters."
                    : "No backend inspectionSiteswith valid latitude and longitude were found."}
                </div>
              ) : null}
            </div>
          </aside>

          <section className={`relative min-h-0 min-w-0 overflow-hidden ${isLight ? "bg-slate-200" : "bg-[#1a2236]"}`}>
            <div ref={mapContainerRef} className="h-full w-full" />

            {/* ── Theme switcher overlay ── */}
            <div className="absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2 flex items-center gap-1 rounded-full border border-white/20 bg-black/50 p-1 shadow-lg backdrop-blur-md">
              <Layers size={13} className="ml-1.5 mr-0.5 flex-shrink-0 text-white/70" />
              {MAP_THEMES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setMapTheme(t.id)}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-all duration-200 ${
                    mapTheme === t.id
                      ? "bg-white text-slate-900 shadow"
                      : "text-white/80 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {!MAPBOX_ACCESS_TOKEN ? (
              <div className={`absolute inset-0 z-[1001] flex items-center justify-center px-6 text-center ${isLight ? "bg-slate-100/90" : "bg-[#0b0f1a]/90"}`}>
                <div className={`max-w-md rounded-[10px] border p-5 ${isLight ? "border-black/10 bg-white" : "border-white/10 bg-[#111827]"}`}>
                  <div className="mb-2 text-[15px] font-medium text-red-400">
                    Mapbox token missing
                  </div>
                  <div className={`text-[12px] leading-6 ${isLight ? "text-slate-500" : "text-[#8a95a8]"}`}>
                    Add your token in <span className="font-mono">.env</span> as{" "}
                    <span className="font-mono">VITE_MAPBOX_ACCESS_TOKEN</span>,
                    then restart the React dev server.
                  </div>
                </div>
              </div>
            ) : null}

            <div className="pointer-events-none absolute right-3 top-3 z-[1000] flex max-h-[calc(100%-24px)] flex-col gap-2 overflow-y-auto">
              <OverlayCard title="Type" isLight={isLight}>
                {typeBreakdown.length ? (
                  typeBreakdown.map(([type, count]) => (
                    <LegendRow
                      key={type}
                      color={typeColorMap[type] || "#3b82f6"}
                      label={`${type} (${count.toLocaleString()})`}
                      isLight={isLight}
                    />
                  ))
                ) : (
                  <LegendRow color="#3b82f6" label="No mapped assets" isLight={isLight} />
                )}
              </OverlayCard>

              <OverlayCard title="By district" isLight={isLight}>
                {districtBreakdown.length ? (
                  districtBreakdown.map(([district, count]) => (
                    <LegendRow
                      key={district}
                      color={districtColorMap[district] || "#888"}
                      label={district}
                      value={count.toLocaleString()}
                      isLight={isLight}
                    />
                  ))
                ) : (
                  <LegendRow color="#888" label="No district data" isLight={isLight} />
                )}
              </OverlayCard>
            </div>

            {/* {selectedsite? (
              <div
                className="absolute bottom-3 left-3 z-[1000] w-[280px]"
                style={{ animation: "assetFadeUp .2s ease" }}
              >
                <DetailCard
                  asset={selectedAsset}
                  typeColor={typeColorMap[selectedAsset.type] || "#3b82f6"}
                  categoryColor={CATEGORY_COLORS[selectedAsset.category] || "#8b5cf6"}
                  districtColor={
                    districtColorMap[selectedAsset.district] || "#888"
                  }
                  onClose={closeDetail}
                  isLight={isLight}
                  onReport={() =>
                    navigate(
                      selectedAsset.dbId
                        ? `/register-complaint?asset=${selectedAsset.dbId}`
                        : "/register-complaint",
                    )
                  }
                />
              </div>
            ) : null} */}
          </section>
        </main>
      </div>
    </div>
  );
}

function MapStat({ label, value, colorClass, isLight }) {
  return (
    <div className={`rounded-md border px-2.5 py-2 text-center ${isLight ? "border-black/10 bg-slate-50" : "border-white/10 bg-[#1a2236]"}`}>
      <div
        className={cn(
          "font-serif text-[19px] font-light leading-none",
          colorClass,
        )}
      >
        {value}
      </div>
      <div className={`mt-1 text-[9px] uppercase tracking-[0.06em] ${isLight ? "text-slate-400" : "text-slate-500"}`}>
        {label}
      </div>
    </div>
  );
}

function OverlayCard({ title, children, isLight }) {
  return (
    <div className={`pointer-events-auto min-w-[136px] rounded-md border px-3 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.3)] ${isLight ? "border-black/10 bg-white" : "border-white/10 bg-[#111827]"}`}>
      <div className={`mb-1.5 text-[10px] font-medium uppercase tracking-[0.07em] ${isLight ? "text-slate-400" : "text-slate-500"}`}>
        {title}
      </div>
      {children}
    </div>
  );
}

function LegendRow({ color, label, value, isLight }) {
  return (
    <div className={`mb-1 flex items-center gap-1.5 text-[11px] last:mb-0 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
      <span
        className="h-[9px] w-[9px] shrink-0 rounded-full"
        style={{ background: color }}
      />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {value ? (
        <span className={`font-mono text-[10px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>{value}</span>
      ) : null}
    </div>
  );
}

function DetailCard({ asset, typeColor, categoryColor, districtColor, onClose, onReport, isLight }) {
  return (
    <div className={`rounded-[10px] border p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] ${isLight ? "border-blue-500/30 bg-white" : "border-blue-500/30 bg-[#111827]"}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: typeColor }}
            />
            <strong className={`truncate text-[13px] ${isLight ? "text-slate-900" : ""}`}>{asset.site}</strong>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className={`text-[14px] transition ${isLight ? "text-slate-400 hover:text-slate-700" : "text-slate-500 hover:text-slate-300"}`}
        >
          ✕
        </button>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <DetailItem
          label="Type"
          value={asset.type}
          valueStyle={{ color: typeColor }}
          isLight={isLight}
        />
        <DetailItem
          label="Category"
          value={asset.category}
          valueStyle={{ color: categoryColor }}
          isLight={isLight}
        />
        <DetailItem
          label="District"
          value={asset.district}
          valueStyle={{ color: districtColor }}
          isLight={isLight}
        />
        <DetailItem label="Tehsil" value={asset.tehsil} isLight={isLight} />
      </div>

      <div className={`mb-3 rounded-md border px-2 py-1.5 ${isLight ? "border-black/10 bg-slate-50" : "border-white/10 bg-[#1a2236]"}`}>
        <div className={`text-[9px] ${isLight ? "text-slate-400" : "text-[#4f5a6e]"}`}>Coordinates</div>
        <div className={`font-mono text-[10px] ${isLight ? "text-slate-700" : ""}`}>
          {Number(asset.lat).toFixed(4)}°N, {Number(asset.lon).toFixed(4)}°E
        </div>
      </div>

      <div className="flex gap-2">
        <a
          href={`https://www.google.com/maps?q=${asset.lat},${asset.lon}`}
          target="_blank"
          rel="noreferrer"
          className={`flex-1 rounded-md border px-3 py-2 text-center text-[12px] transition ${isLight ? "border-black/10 bg-slate-100 text-slate-600 hover:bg-slate-200" : "border-white/10 bg-[#1a2236] text-[#8a95a8] hover:bg-[#212d42]"}`}
        >
          🗺️ Map
        </a>
        <button
          type="button"
          onClick={onReport}
          className="flex-1 rounded-md bg-blue-500 px-3 py-2 text-[12px] font-medium text-white transition hover:bg-blue-700"
        >
          📋 Report issue
        </button>
      </div>
    </div>
  );
}

function DetailItem({ label, value, valueStyle, isLight }) {
  return (
    <div className={`rounded-md border px-2 py-1.5 ${isLight ? "border-black/10 bg-slate-50" : "border-white/10 bg-[#1a2236]"}`}>
      <div className={`text-[9px] ${isLight ? "text-slate-400" : "text-[#4f5a6e]"}`}>{label}</div>
      <div className={`truncate text-[12px] ${isLight ? "text-slate-800" : ""}`} style={valueStyle}>
        {value || "—"}
      </div>
    </div>
  );
}
