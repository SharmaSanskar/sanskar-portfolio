'use client';

import { MeshGradient } from '@paper-design/shaders-react';

interface PaperShaderProps {
  colors?: string[];
  speed?: number;
  className?: string;
}

export function PaperShader({ 
  colors = ['#0a0a0a', '#1c1917', '#292524', '#44403c'],
  speed = 0.5,
  className = '' 
}: PaperShaderProps) {
  return (
    <div className={`absolute inset-0 w-full h-full bg-primary ${className}`}>
      <MeshGradient
        className="w-full h-full"
        colors={colors}
        speed={speed}
      />
    </div>
  );
}