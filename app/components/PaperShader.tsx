'use client';

import { MeshGradient } from '@paper-design/shaders-react';

interface PaperShaderProps {
  colors?: readonly string[];
  speed?: number;
  className?: string;
  /**
   * When false the shader's requestAnimationFrame loop is cancelled entirely
   * (ShaderMount treats speed 0 as "stop") and resumes from the same frame when
   * set back to true. ShaderMount only pauses on document visibilitychange.
   */
  active?: boolean;
  /** Render-resolution caps — a soft gradient looks identical at low res. */
  minPixelRatio?: number;
  maxPixelCount?: number;
}

export function PaperShader({
  colors = ['#0a0a0a', '#1c1917', '#292524', '#44403c'],
  speed = 0.5,
  className = '',
  active = true,
  minPixelRatio,
  maxPixelCount,
}: PaperShaderProps) {
  return (
    <div className={`absolute inset-0 w-full h-full bg-page ${className}`}>
      <MeshGradient
        className="w-full h-full"
        colors={[...colors]}
        speed={active ? speed : 0}
        minPixelRatio={minPixelRatio}
        maxPixelCount={maxPixelCount}
      />
    </div>
  );
}
