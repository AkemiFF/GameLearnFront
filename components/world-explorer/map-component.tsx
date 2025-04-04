"use client"

import { countries } from "@/data/countries"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useRef, useState } from "react"

interface MapComponentProps {
  mapCenter: [number, number]
  mapZoom: number
  visitedCountries: string[]
  selectedCountry: string | null
  onCountrySelect: (countryCode: string) => void
  getCountryCoordinates: (countryCode: string) => [number, number]
}

export default function MapComponent({
  mapCenter,
  mapZoom,
  visitedCountries,
  selectedCountry,
  onCountrySelect,
  getCountryCoordinates
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const [isMapInitialized, setIsMapInitialized] = useState(false)
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    // Fix Leaflet icon issues
    // No need to delete _getIconUrl as it doesn't exist on L.Icon.Default
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });

    // Create map
    const map = L.map(mapRef.current, {
      center: mapCenter,
      zoom: mapZoom,
      zoomControl: false,
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create markers layer group
    markersLayerRef.current = L.layerGroup().addTo(map);

    // Store map reference
    leafletMapRef.current = map;
    setIsMapInitialized(true);

    // Load GeoJSON data
    fetch("/api/country-boundaries")
      .then((response) => response.json())
      .then((data) => {
        if (leafletMapRef.current) {
          // Create GeoJSON layer
          geoJsonLayerRef.current = L.geoJSON(data, {
            style: (feature) => countryStyle(feature, selectedCountry, visitedCountries),
            onEachFeature: (feature, layer) => {
              const countryCode = feature.properties.ISO_A2;
              const countryName = feature.properties.NAME ||
                countries.find((c) => c.code === countryCode)?.name ||
                countryCode;

              layer.on({
                click: () => onCountrySelect(countryCode),
                mouseover: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    weight: 3,
                    color: "#ffffff",
                    fillOpacity: 0.7,
                  });
                  layer.bindTooltip(countryName).openTooltip();
                },
                mouseout: (e) => {
                  const layer = e.target;
                  layer.setStyle(countryStyle(feature, selectedCountry, visitedCountries));
                  layer.closeTooltip();
                },
              });
            },
          }).addTo(leafletMapRef.current);
        }
      })
      .catch((error) => {
        console.error("Error loading country boundaries:", error);
        // Fallback to markers
        createCountryMarkers();
      });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update map when center or zoom changes
  useEffect(() => {
    if (leafletMapRef.current && isMapInitialized) {
      leafletMapRef.current.setView(mapCenter, mapZoom);
    }
  }, [mapCenter, mapZoom, isMapInitialized]);

  // Update styles when selected country or visited countries change
  useEffect(() => {
    if (geoJsonLayerRef.current && isMapInitialized) {
      geoJsonLayerRef.current.setStyle((feature) =>
        countryStyle(feature, selectedCountry, visitedCountries)
      );
    }

    // Update markers if GeoJSON is not available
    if (!geoJsonLayerRef.current && markersLayerRef.current && isMapInitialized) {
      markersLayerRef.current.clearLayers();
      createCountryMarkers();
    }
  }, [selectedCountry, visitedCountries, isMapInitialized]);

  // Create country markers as fallback
  const createCountryMarkers = () => {
    if (!markersLayerRef.current || !leafletMapRef.current) return;

    countries.forEach((country) => {
      const coords = getCountryCoordinates(country.code);
      const isVisited = visitedCountries.includes(country.code);
      const isSelected = selectedCountry === country.code;

      const markerIcon = createCustomIcon(
        isSelected ? "#9333ea" : isVisited ? "#3b82f6" : "#d1d5db"
      );

      const marker = L.marker([coords[0], coords[1]], { icon: markerIcon })
        .addTo(markersLayerRef.current!)
        .on('click', () => onCountrySelect(country.code));

      marker.bindPopup(`
        <div class="flex flex-col items-center p-1">
          <div class="w-8 h-5 mb-1 overflow-hidden rounded">
            <img
              src="https://flagcdn.com/w80/${country.code.toLowerCase()}.png"
              alt="Drapeau ${country.name}"
              class="w-full h-full object-cover"
            />
          </div>
          <span class="font-medium">${country.name}</span>
        </div>
      `);
    });
  };

  // Custom marker icon
  const createCustomIcon = (color: string) => {
    return L.divIcon({
      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="24" height="24"><circle cx="12" cy="12" r="10" /></svg>`,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // Style function for GeoJSON
  const countryStyle = (feature: any, selectedCountry: string | null, visitedCountries: string[]) => {
    const countryCode = feature.properties.ISO_A2;

    if (selectedCountry === countryCode) {
      return {
        fillColor: "#9333ea", // purple-600
        weight: 2,
        opacity: 1,
        color: "#ffffff",
        fillOpacity: 0.7,
      };
    } else if (visitedCountries.includes(countryCode)) {
      return {
        fillColor: "#3b82f6", // blue-500
        weight: 1,
        opacity: 1,
        color: "#ffffff",
        fillOpacity: 0.5,
      };
    } else {
      return {
        fillColor: "#d1d5db", // gray-300
        weight: 1,
        opacity: 1,
        color: "#ffffff",
        fillOpacity: 0.5,
      };
    }
  };

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
}
