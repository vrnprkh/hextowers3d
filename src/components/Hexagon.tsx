import { useMemo, useState } from "react";
import { Shape } from "three";
import type { ThreeElements } from "@react-three/fiber";
import { Text } from "@react-three/drei";

type HexagonProps = ThreeElements["mesh"] & {
  height?: number;
  number?: number;
};

export default function Hexagon({ ...props }: HexagonProps) {
  props.height = props.height ?? 0.5;
  props.number = props.number ?? 1
  const bevelWidth = 0.1;
  const [hovered, setHover] = useState(false);
  const [height, setHeight] = useState(props.height);
  const hexShape = useMemo(() => {
    const shape = new Shape();
    const radius = 1 - bevelWidth;
    for (let i = 0; i <= 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
    return shape;
  }, []);

  return (
    <mesh
      {...props}
      onPointerOver={(e) => {
        setHover(true);
        e.stopPropagation();
      }}
      onPointerOut={(e) => {
        setHover(false);
        e.stopPropagation();
      }}
      onClick={(e) => {
        setHeight(((height - 0.25 + 0.5) % 2.5) + 0.25);
        e.stopPropagation();
      }}
      onContextMenu={(e) => {
        const val = ((height - 0.25 - 0.5) % 2.5) + 0.25;
        setHeight(val < 0.25 ? 2.25 : val);
        e.stopPropagation();
      }}
    >
      <extrudeGeometry
        args={[
          hexShape,
          {
            curveSegments: 1,
            bevelSegments: 16,
            bevelSize: bevelWidth,
            depth: height,
          },
        ]}
      />
      <meshStandardMaterial color={hovered ? "#e69f65" : "#ecba85"} />

      {/* text */}

      <Text
        position={[0, 0, height + 0.25]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {props.number}
      </Text>
    </mesh>
  );
}
