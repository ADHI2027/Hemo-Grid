import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cytoscape from 'cytoscape';
import { RecommendationItem, ShortageTier } from '../types';

export interface FacilityNodeData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  total_units: number;
  worst_tier: ShortageTier;
}

interface NetworkGraphProps {
  facilities?: FacilityNodeData[];
  recommendations?: RecommendationItem[];
}

const DEFAULT_FACILITIES: FacilityNodeData[] = [
  { id: 'FAC-01', name: 'Metro Central Blood Bank', lat: 40.7128, lng: -74.006, total_units: 140, worst_tier: 'STABLE' },
  { id: 'FAC-02', name: "St. Jude Children's Hospital", lat: 40.7589, lng: -73.9851, total_units: 25, worst_tier: 'CRITICAL' },
  { id: 'FAC-03', name: 'City General Hospital', lat: 40.6782, lng: -73.9442, total_units: 60, worst_tier: 'WATCH' },
  { id: 'FAC-04', name: 'Regional Trauma Center', lat: 40.7831, lng: -73.9712, total_units: 30, worst_tier: 'HIGH' },
  { id: 'FAC-05', name: 'Eastside Medical Center', lat: 40.7282, lng: -73.9792, total_units: 85, worst_tier: 'STABLE' },
];

const DEFAULT_RECOMMENDATIONS: Partial<RecommendationItem>[] = [
  {
    id: 'REC-8042',
    source_facility_id: 'FAC-01',
    source_facility_name: 'Metro Central Blood Bank',
    dest_facility_id: 'FAC-02',
    dest_facility_name: "St. Jude Children's Hospital",
    units: 12,
    rescue_score: 0.88,
  },
  {
    id: 'REC-8043',
    source_facility_id: 'FAC-05',
    source_facility_name: 'Eastside Medical Center',
    dest_facility_id: 'FAC-03',
    dest_facility_name: 'City General Hospital',
    units: 8,
    rescue_score: 0.74,
  },
  {
    id: 'REC-8044',
    source_facility_id: 'FAC-01',
    source_facility_name: 'Metro Central Blood Bank',
    dest_facility_id: 'FAC-04',
    dest_facility_name: 'Regional Trauma Center',
    units: 15,
    rescue_score: 0.82,
  },
];

// Map ShortageTier to token hex values
function getTierColor(tier: ShortageTier): string {
  switch (tier) {
    case 'STABLE':
      return '#3F7F63'; // --state-normal
    case 'WATCH':
      return '#8F6A00'; // --state-watch
    case 'HIGH':
      return '#A8541B'; // --state-rescue
    case 'CRITICAL':
      return '#A4232B'; // --state-critical
    default:
      return '#5A626A'; // --ink-mid
  }
}

// Compute deterministic preset positions scaled to container
function computePresetPositions(
  facilities: FacilityNodeData[],
  width: number = 800,
  height: number = 500,
  padding: number = 70
): Record<string, { x: number; y: number }> {
  if (facilities.length === 0) return {};
  let minLat = Infinity, maxLat = -Infinity;
  let minLng = Infinity, maxLng = -Infinity;

  facilities.forEach((f) => {
    if (f.lat < minLat) minLat = f.lat;
    if (f.lat > maxLat) maxLat = f.lat;
    if (f.lng < minLng) minLng = f.lng;
    if (f.lng > maxLng) maxLng = f.lng;
  });

  const latRange = maxLat - minLat || 1;
  const lngRange = maxLng - minLng || 1;

  const positions: Record<string, { x: number; y: number }> = {};
  facilities.forEach((f) => {
    const x = padding + ((f.lng - minLng) / lngRange) * (width - 2 * padding);
    // Invert latitude so north is up (y=0 is top)
    const y = padding + ((maxLat - f.lat) / latRange) * (height - 2 * padding);
    positions[f.id] = { x, y };
  });

  return positions;
}

export default function NetworkGraph({
  facilities = DEFAULT_FACILITIES,
  recommendations = DEFAULT_RECOMMENDATIONS as RecommendationItem[],
}: NetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const navigate = useNavigate();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = 500;
    const positions = computePresetPositions(facilities, width, height);

    // Build Cytoscape elements
    const elements: cytoscape.ElementDefinition[] = [];

    // Facility Nodes
    facilities.forEach((fac) => {
      // Node size maps to total_units (min 24px, max 50px)
      const size = Math.min(52, Math.max(24, 20 + fac.total_units * 0.2));
      const color = getTierColor(fac.worst_tier);
      const pos = positions[fac.id] || { x: 100, y: 100 };

      elements.push({
        group: 'nodes',
        data: {
          id: fac.id,
          label: `${fac.name}\n(${fac.total_units}u)`,
          tier: fac.worst_tier,
          color: color,
          size: size,
        },
        position: pos,
      });
    });

    // Recommendation Edges
    recommendations.forEach((rec) => {
      // Edge width maps to units (min 2px, max 8px)
      const edgeWidth = Math.min(8, Math.max(2, 2 + rec.units * 0.4));

      elements.push({
        group: 'edges',
        data: {
          id: rec.id,
          source: rec.source_facility_id,
          target: rec.dest_facility_id,
          recId: rec.id,
          units: rec.units,
          rescue_score: rec.rescue_score,
          width: edgeWidth,
          label: `Score ${rec.rescue_score.toFixed(2)} (${rec.units}u)`,
        },
      });
    });

    // Initialize Cytoscape instance with PRESET layout
    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      layout: {
        name: 'preset',
        fit: true,
        padding: 40,
      },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'label': 'data(label)',
            'width': 'data(size)',
            'height': 'data(size)',
            'color': '#1A1D20',
            'font-size': '11px',
            'font-family': 'monospace',
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'text-wrap': 'wrap',
            'border-width': 2,
            'border-color': '#1A1D20',
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 'data(width)',
            'line-color': '#0B6E7F', // --accent token
            'target-arrow-color': '#0B6E7F',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'font-size': '10px',
            'font-family': 'monospace',
            'color': '#5A626A',
            'label': 'data(label)',
            'text-rotation': 'autorotate',
            'text-margin-y': -8,
          },
        },
        {
          selector: '.highlighted',
          style: {
            'border-width': 4,
            'border-color': '#0B6E7F',
            'opacity': 1,
          },
        },
        {
          selector: '.dimmed',
          style: {
            'opacity': 0.2,
          },
        },
      ],
    });

    cyRef.current = cy;

    // Node click event -> Filter connected edge set
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      const nodeId = node.id();
      setSelectedNodeId(nodeId);

      cy.elements().removeClass('highlighted dimmed');
      node.addClass('highlighted');
      const connectedEdges = node.connectedEdges();
      connectedEdges.addClass('highlighted');
      const connectedNodes = connectedEdges.connectedNodes();
      connectedNodes.addClass('highlighted');

      cy.elements().difference(node.union(connectedEdges).union(connectedNodes)).addClass('dimmed');
    });

    // Edge click event -> Navigate to recommendation detail page
    cy.on('tap', 'edge', (evt) => {
      const edge = evt.target;
      const recId = edge.data('recId');
      if (recId) {
        navigate(`/recommendations/${recId}`);
      }
    });

    // Background click event -> Clear filter
    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        setSelectedNodeId(null);
        cy.elements().removeClass('highlighted dimmed');
      }
    });

    return () => {
      cy.destroy();
    };
  }, [facilities, recommendations, navigate]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-3">
        <div>
          <h1 className="text-xl font-bold text-ink tracking-tight">Network Graph</h1>
          <p className="text-xs text-ink-mid mt-0.5">
            Geographic facility nodes and active transfer recommendation edges.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-ink-mid">
            {facilities.length} Facilities • {recommendations.length} Active Edges
          </span>
          {selectedNodeId && (
            <button
              type="button"
              onClick={() => {
                setSelectedNodeId(null);
                cyRef.current?.elements().removeClass('highlighted dimmed');
              }}
              className="text-accent hover:underline text-xs"
            >
              Clear node filter (Selected: {selectedNodeId})
            </button>
          )}
        </div>
      </div>

      {/* Legend & Guidance */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-surface border border-rule rounded text-xs">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-ink">Node Tier Color:</span>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-state-normal inline-block" /> STABLE
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-state-watch inline-block" /> WATCH
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-state-rescue inline-block" /> HIGH
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-state-critical inline-block" /> CRITICAL
            </span>
          </div>
        </div>
        <div className="text-ink-mid text-[11px] font-mono">
          Click node to filter edges • Click edge to open recommendation detail
        </div>
      </div>

      {/* Cytoscape Graph Canvas */}
      <div className="border border-rule rounded bg-paper shadow-xs overflow-hidden relative">
        <div ref={containerRef} className="w-full h-[500px] bg-paper" />
      </div>
    </div>
  );
}
