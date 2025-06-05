import { useMemo } from "react";
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
import {
  pancakeHovers,
  pancakeIndicators,
  pancakeNormals,
} from "../util/threeTheme";

import * as THREE from "three";

import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";
type HexagonProps = ThreeElements["object3D"] & {
  coords: [number, number];
};

export default function Hexagon({ ...props }: HexagonProps) {
  const bevelWidth = 0.1;
  const layerHeight = 0.25;

  const coordString = `${props.coords[0]}-${props.coords[1]}`;
  const dispatch = useDispatch();
  const tileData = useSelector(selectTile(coordString));

  const fullHeight = (tileData.height + 1) * (layerHeight + 2 * bevelWidth);

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

  const mergedGeometry = useMemo(() => {
    const geometries: THREE.BufferGeometry[] = [];
    let groupStart = 0;
    const finalGeometry = new THREE.BufferGeometry();

    for (let h = 0; h < tileData.height + 1; h++) {
      const extrudeSettings = {
        curveSegments: 1,
        bevelSegments: 16,
        bevelThickness: bevelWidth,
        bevelSize: bevelWidth,
        depth: layerHeight,
      };

      const geom = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);
      geom.translate(0, 0, h * (layerHeight + 2 * bevelWidth));

      const count = geom.index
        ? geom.index.count
        : geom.getAttribute("position").count;

      finalGeometry.addGroup(groupStart, count, h); // h = material index
      groupStart += count;

      geometries.push(geom);
    }

    const merged = BufferGeometryUtils.mergeGeometries(geometries, true);
    if (!merged) {
      console.error("mergeGeometries failed");
      return finalGeometry;
    }

    finalGeometry.copy(merged);
    return finalGeometry;
  }, [hexShape, tileData.height]);

  return (
    <object3D
      {...props}
      onPointerEnter={(e) => {
        if (tileData.target !== -1) {
          dispatch(addHover(coordString));
        }
        e.stopPropagation();
      }}
      onPointerLeave={(e) => {
        if (tileData.target !== -1) {
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
      <mesh geometry={mergedGeometry} castShadow receiveShadow>
        {Array.from({ length: tileData.height + 1 }, (_, i) => (
          <meshStandardMaterial
            key={`material-${i}`}
            attach={`material-${i}`}
            color={
              tileData.hovered
                ? pancakeHovers[i]
                : tileData.indicator
                ? pancakeIndicators[i]
                : pancakeNormals[i]
            }
          />
        ))}
      </mesh>

      {/* text */}
      {tileData.target !== -1 && (
        <>
          <Text
            position={[0, 0, fullHeight]}
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
            position={[0, -0.2, fullHeight]}
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
    </object3D>
  );
}
