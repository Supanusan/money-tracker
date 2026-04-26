import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface PieSlice {
  value: number;
  color: string;
  label: string;
}

interface PieChartProps {
  data: PieSlice[];
  size?: number;
  strokeWidth?: number;
  innerRadius?: number; // 0 = full pie, >0 = donut
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function createArcPath(
  cx: number, cy: number,
  outerR: number, innerR: number,
  startAngle: number, endAngle: number,
): string {
  // Clamp to avoid full-circle issues with SVG arcs
  const sweep = Math.min(endAngle - startAngle, 359.999);
  const largeArc = sweep > 180 ? 1 : 0;

  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, startAngle + sweep);
  const innerStart = polarToCartesian(cx, cy, innerR, startAngle + sweep);
  const innerEnd = polarToCartesian(cx, cy, innerR, startAngle);

  if (innerR === 0) {
    // Full pie slice (no hole)
    return [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
      `L ${cx} ${cy}`,
      'Z',
    ].join(' ');
  }

  // Donut slice
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
    'Z',
  ].join(' ');
}

export function PieChart({ data, size = 180, innerRadius = 0.55 }: PieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 2;
  const innerR = outerR * innerRadius;

  let currentAngle = 0;
  const slices = data.map((slice) => {
    const sliceAngle = (slice.value / total) * 360;
    const path = createArcPath(cx, cy, outerR, innerR, currentAngle, currentAngle + sliceAngle);
    currentAngle += sliceAngle;
    return { ...slice, path };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle for the hole */}
        {innerRadius > 0 && (
          <Circle cx={cx} cy={cy} r={innerR - 1} fill="#ffffff" />
        )}
        {slices.map((slice, i) => (
          <Path key={i} d={slice.path} fill={slice.color} />
        ))}
        {/* Inner circle overlay for clean donut look */}
        {innerRadius > 0 && (
          <Circle cx={cx} cy={cy} r={innerR} fill="#ffffff" />
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
