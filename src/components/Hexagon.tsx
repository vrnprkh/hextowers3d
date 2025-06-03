import { useMemo, useState } from "react";
import { Shape } from "three";
import type { ThreeElements } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useDispatch, useSelector } from "react-redux";
import {
  addHover,
  decrementHeight,
  incrementHeight,
  removeHover,
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
          dispatch(addHover(coordString));
        }
        e.stopPropagation();
      }}
      onPointerLeave={(e) => {
        if (tileData.target !== -1) {
          setHover(false);
          dispatch(removeHover(coordString));
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
        />
        <meshStandardMaterial
          attach="material-0"
          key={
            "face-" + (hovered ? "hovered" : tileData.indicator ? "indicator" : "normal")
          }
          color={
            hovered ? "#e69f65" : tileData.indicator ? "#d98957" : "#ecba85"
          }
        />
        <meshStandardMaterial
          attach="material-1"
          key={
            "side-" +(hovered ? "hovered" : tileData.indicator ? "indicator" : "normal")
          }
          color={
            hovered ? "#cc8d5a" : tileData.indicator ? "#bf784d" : "#d4a777"
          }
        />



      </mesh>
      {/* text */}
      {tileData.target !== -1 && (
        <>
          <Text
            position={[0, 0, tileData.height / 2 + 0.25]}
            fontSize={0.5}
            color={
              tileData.target === tileData.sees && tileData.height !== 0
                ? "#7ddb8b"
                : "white"
            }
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
