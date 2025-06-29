import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import * as d3 from 'd3';

interface WorldMapProps {
  apiBaseUrl?: string;
  language: 'fr' | 'en';
}

interface ParticipantData {
  [countryCode: string]: number;
}

const API_CONFIG = {
  baseUrl: 'http://localhost:8000/api',
  endpoints: {
    allParticipantsByCountry: '/Registration/all-participants-by-country'
  }
};

const WorldMap: React.FC<WorldMapProps> = ({ apiBaseUrl, language }) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [participantData, setParticipantData] = useState<ParticipantData>({});
  const [participantCount, setParticipantCount] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [worldData, setWorldData] = useState<GeoJSON.FeatureCollection<GeoJSON.Geometry> | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const baseUrl = apiBaseUrl || API_CONFIG.baseUrl;

  // Charger les données géographiques
  useEffect(() => {
    const loadWorldData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
        if (!response.ok) throw new Error(`Failed to load GeoJSON: ${response.status}`);
        const data = await response.json();
        console.log('GeoJSON loaded successfully');
        setWorldData(data);
      } catch (err) {
        console.error('Error loading GeoJSON:', err);
        setError(language === 'fr' ? 'Erreur lors du chargement de la carte' : 'Error loading map data');
      }
    };

    loadWorldData();
  }, [language]);

  // Charger les données des participants depuis le backend
  useEffect(() => {
    const fetchAllParticipants = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const url = `${baseUrl}${API_CONFIG.endpoints.allParticipantsByCountry}`;
        console.log('Fetching participants data from:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        console.log('API response status:', response.status, response.statusText);
        
        if (response.ok) {
          const result = await response.json();
          console.log('Raw API response:', result);
          
          if (result.success && result.data) {
            // Convertir les données en format correct
            const data = Object.fromEntries(
              Object.entries(result.data)
                .filter(([_, count]) => Number(count) > 0)
                .map(([k, v]) => [k.toUpperCase(), Number(v)])
            );
            console.log('Processed participant data:', data);
            setParticipantData(data as ParticipantData);
          } else {
            console.warn('API returned error:', result.message);
            setError(result.message || (language === 'fr' ? 'Erreur lors du chargement des données' : 'Error loading participant data'));
          }
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch participant data:', response.status, errorText);
          setError(language === 'fr' ? 'Erreur lors du chargement des données' : 'Error loading participant data');
        }
      } catch (err) {
        console.error('Network error loading participant data:', err);
        setError(language === 'fr' ? 'Erreur de connexion au serveur' : 'Server connection error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllParticipants();
  }, [baseUrl, language]);

  // Fonction pour obtenir le nombre de participants d'un pays
  const getParticipantCount = useCallback((countryCode: string): number => {
    const code = countryCode?.toUpperCase();
    return participantData[code] || 0;
  }, [participantData]);

  // Gestion du clic sur un pays
  const handleCountryClick = useCallback((countryCode: string, countryName: string) => {
    console.log('Country clicked:', { countryCode, countryName });
    setSelectedCountry(countryName);
    const count = getParticipantCount(countryCode);
    setParticipantCount(count);
    setError('');
  }, [getParticipantCount]);

  // Dessiner la carte avec D3
  useEffect(() => {
    if (!worldData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Nettoyer le SVG

    const width = 800;
    const height = 400;

    // Configuration de la projection
    const projection = d3.geoNaturalEarth1()
      .scale(130)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Créer les groupes
    const mapGroup = svg.append("g");

    // Calculer les valeurs min/max pour la couleur
    const participantCounts = Object.values(participantData);
    const maxParticipants = Math.max(...participantCounts, 1);

    // Dessiner les pays
    mapGroup.selectAll("path")
      .data(worldData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", (d: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => {
        const countryCode = (d.properties?.iso_a2 || d.properties?.ISO_A2)?.toUpperCase();
        const participants = getParticipantCount(countryCode || '');
        if (participants > 0) {
          const intensity = Math.min(participants / maxParticipants, 1);
          return d3.interpolateBlues(0.3 + intensity * 0.7);
        }
        return "#f0f0f0";
      })
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 0.5)
      .style("cursor", "pointer")
      .on("mouseover", function(
        event: MouseEvent,
        d: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
      ) {
        const countryCode = (d.properties?.iso_a2 || d.properties?.ISO_A2)?.toUpperCase();
        const countryName = d.properties?.name || d.properties?.NAME;
        const participants = getParticipantCount(countryCode || '');
        
        // Highlight du pays
        d3.select(this)
          .attr("stroke", "#333")
          .attr("stroke-width", 2);

        // Créer le tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "world-map-tooltip")
          .style("opacity", 0)
          .style("position", "absolute")
          .style("background", "rgba(0,0,0,0.8)")
          .style("color", "white")
          .style("padding", "8px 12px")
          .style("border-radius", "4px")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .style("z-index", "1000")
          .style("box-shadow", "0 2px 4px rgba(0,0,0,0.2)");

        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
          
        tooltip.html(`
          <div style="font-weight: bold; margin-bottom: 4px;">${countryName}</div>
          <div>${participants} ${language === 'fr' ? 'participant(s)' : 'participant(s)'}</div>
        `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 0.5);
        d3.selectAll(".world-map-tooltip").remove();
      })
      .on("click", function(
        event: MouseEvent,
        d: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
      ) {
        const countryCode = (d.properties?.iso_a2 || d.properties?.ISO_A2)?.toUpperCase();
        const countryName = d.properties?.name || d.properties?.NAME;
        if (countryCode && countryName) {
          handleCountryClick(countryCode, countryName);
        }
      });

    // Ajouter des cercles pour les pays avec des participants
    Object.entries(participantData).forEach(([countryCode, count]) => {
      const feature = worldData.features.find(
        (f: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => 
          ((f.properties?.iso_a2 || f.properties?.ISO_A2) || '').toUpperCase() === countryCode
      );
      
      if (feature && count > 0) {
        const centroid = path.centroid(feature);
        if (centroid && !isNaN(centroid[0]) && !isNaN(centroid[1])) {
          const radius = Math.sqrt(count / Math.PI) * 2 + 3; // Formule pour un rayon proportionnel
          
          mapGroup.append("circle")
            .attr("cx", centroid[0])
            .attr("cy", centroid[1])
            .attr("r", radius)
            .attr("fill", "#ff6b6b")
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 2)
            .attr("opacity", 0.8)
            .style("cursor", "pointer")
            .on("mouseover", function(event: MouseEvent) {
              d3.select(this).attr("opacity", 1);
              
              const tooltip = d3.select("body").append("div")
                .attr("class", "world-map-tooltip")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("background", "rgba(0,0,0,0.8)")
                .style("color", "white")
                .style("padding", "8px 12px")
                .style("border-radius", "4px")
                .style("font-size", "12px")
                .style("pointer-events", "none")
                .style("z-index", "1000")
                .style("box-shadow", "0 2px 4px rgba(0,0,0,0.2)");

              tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
                
              tooltip.html(`
                <div style="font-weight: bold; margin-bottom: 4px;">${feature.properties?.name || feature.properties?.NAME}</div>
                <div>${count} ${language === 'fr' ? 'participant(s)' : 'participant(s)'}</div>
              `)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
              d3.select(this).attr("opacity", 0.8);
              d3.selectAll(".world-map-tooltip").remove();
            })
            .on("click", function() {
              const countryName = feature.properties?.name || feature.properties?.NAME;
              if (countryCode && countryName) {
                handleCountryClick(countryCode, countryName);
              }
            });
        }
      }
    });

  }, [worldData, participantData, language, handleCountryClick, getParticipantCount]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">
              {language === 'fr' ? 'Chargement des données...' : 'Loading data...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!worldData) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">
              {language === 'fr' ? 'Chargement de la carte...' : 'Loading map...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6 sticky top-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {language === 'fr' ? 'Participants par pays' : 'Participants by Country'}
      </h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="w-full bg-blue-50 rounded-lg overflow-hidden mb-4">
        <svg
          ref={svgRef}
          width="100%"
          height="400"
          viewBox="0 0 800 400"
          className="w-full h-auto"
          style={{ backgroundColor: '#e6f3ff' }}
        />
      </div>

      {/* Légende */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          {language === 'fr' ? 'Légende' : 'Legend'}
        </h4>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 border"></div>
            <span>{language === 'fr' ? 'Aucun participant' : 'No participants'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4" style={{ background: d3.interpolateBlues(0.5) }}></div>
            <span>{language === 'fr' ? 'Quelques participants' : 'Some participants'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4" style={{ background: d3.interpolateBlues(1) }}></div>
            <span>{language === 'fr' ? 'Beaucoup de participants' : 'Many participants'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span>{language === 'fr' ? 'Marqueurs de participants' : 'Participant markers'}</span>
          </div>
        </div>
      </div>

      {/* Informations sur le pays sélectionné */}
      {selectedCountry && (
        <div className="p-4 bg-blue-50 rounded-lg text-center mb-4">
          <p className="text-sm font-medium text-gray-900 mb-1">
            {language === 'fr' ? 'Pays sélectionné' : 'Selected Country'}: {selectedCountry}
          </p>
          <p className="text-sm text-gray-600">
            {language === 'fr' ? 'Nombre de participants' : 'Number of Participants'}: 
            <span className="font-semibold ml-1 text-blue-600">
              {participantCount !== null ? participantCount : 'N/A'}
            </span>
          </p>
        </div>
      )}

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">
            {Object.keys(participantData).length}
          </div>
          <div className="text-xs text-green-700">
            {language === 'fr' ? 'Pays participants' : 'Participating Countries'}
          </div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">
            {Object.values(participantData).reduce((sum, count) => sum + count, 0)}
          </div>
          <div className="text-xs text-blue-700">
            {language === 'fr' ? 'Total participants' : 'Total Participants'}
          </div>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">
            {Object.values(participantData).length > 0 ? Math.max(...Object.values(participantData)) : 0}
          </div>
          <div className="text-xs text-purple-700">
            {language === 'fr' ? 'Maximum par pays' : 'Maximum per Country'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;