import { useMemo, useState } from "react";
import { Shape } from "three";
import type { ThreeElements } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementHeight,
  incrementHeight,
  selectTile,
} from "../features/levelSlice";

type HexagonProps = ThreeElements["mesh"] & {
  coords: [number, number];
};

export default function Hexagon({ ...props }: HexagonProps) {
  const bevelWidth = 0.1;
  const [hovered, setHover] = useState(false);
  const coordString = `${props.coords[0]}-${props.coords[1]}`;
  const dispatch = useDispatch();
  const tileData = useSelector(selectTile(coordString));

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
      onPointerEnter={(e) => {
        if (tileData.target !== -1) {
          setHover(true);
        }
        e.stopPropagation();
      }}
      onPointerLeave={(e) => {
        if (tileData.target !== -1) {
          setHover(false);
        }
        e.stopPropagation();
      }}
      onClick={(e) => {
        if (tileData.target !== -1) {
          dispatch(incrementHeight(coordString));
        }
        e.stopPropagation();
      }}
      onContextMenu={(e) => {
        if (tileData.target !== -1) {
          dispatch(decrementHeight(coordString));
        }
        e.stopPropagation();
      }}
    >
      {/* base */}
      <mesh castShadow={true} receiveShadow={true}>
        <extrudeGeometry
          args={[
            hexShape,
            {
              curveSegments: 1,
              bevelSegments: 16,
              bevelSize: bevelWidth,
              depth: tileData.height / 2,
            },
          ]}
        ></extrudeGeometry>
        <meshStandardMaterial
          key={hovered ? "hovered" : "normal"}
          color={hovered ? "#e69f65" : "#ecba85"}
        />
      </mesh>
      {/* text */}
      {tileData.target !== -1 && (
        <>
          <Text
            position={[0, 0, tileData.height / 2 + 0.25]}
            fontSize={0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
            raycast={() => null}
          >
            {tileData.target}
          </Text>
          <Text
            position={[0, -0.2, tileData.height / 2 + 0.25]}
            fontSize={0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
            raycast={() => null}
          >
            {Array(tileData.height).fill(".")}
          </Text>
        </>
      )}
    </mesh>
  );
}
