import React, { useEffect, useRef, useState } from "react";
import MacbookKeyboard from "./Macbook.Keyboard";
import { useGesture } from "@use-gesture/react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import MacbookScreen from "./Macbook.Screen";
import _debounce from "lodash/debounce";
import { Group } from "three";

const ANIMATION_DEBOUNCE_MS = 0; // debouncing animation frames causes jittery movements, but option here when testing new animations and need to improve performance
const MIN_Z_VALUE = -50; // the min z-index for the model to travel from
const MAX_Z_VALUE = 30; // the max z-index for the model to travel to
const TRAVEL_SPEED = 0.4; // the speed the model travels at
const PERCENTAGE_TO_STOP_TRAVEL_AT = 0.1; // issues calculating this dynamically, the window.innerHeight (100vh) logs as the site height (bug with R3F?)

type MacbookProps = {
  videoSource: string;
};

const Macbook: React.FC<MacbookProps> = ({ videoSource }) => {
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const groupRef = useRef<Group>(null);
  const scroll = useScroll();

  // ANIMATIONS
  // TODO: test gyroscope orientation
  // For gyroscope orientation
  useEffect(() => {
    if (window.DeviceOrientationEvent) {
      const debouncedHandleOrientation = _debounce((event) => {
        const { beta, gamma } = event;

        if (groupRef.current) {
          groupRef.current.rotation.x = (beta || 0) * (Math.PI / 180);
          groupRef.current.rotation.y = (gamma || 0) * (Math.PI / 180);
        }
      }, ANIMATION_DEBOUNCE_MS);

      window.addEventListener("deviceorientation", debouncedHandleOrientation);

      return () => {
        window.removeEventListener(
          "deviceorientation",
          debouncedHandleOrientation
        );
        debouncedHandleOrientation.cancel();
      };
    }
  }, []);

  // For mouse movement
  useEffect(() => {
    const debouncedHandleMouseMove = _debounce((event) => {
      setMouseCoords({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    }, ANIMATION_DEBOUNCE_MS);

    window.addEventListener("mousemove", debouncedHandleMouseMove);

    return () => {
      window.removeEventListener("mousemove", debouncedHandleMouseMove);
      debouncedHandleMouseMove.cancel();
    };
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      // Update the model's rotation based on mouse movement
      const targetRotationX = -(mouseCoords.y * (Math.PI / 8));
      const targetRotationY = mouseCoords.x * (Math.PI / 8);

      groupRef.current.rotation.x +=
        0.04 * (targetRotationX - groupRef.current.rotation.x);
      groupRef.current.rotation.y +=
        0.04 * (targetRotationY - groupRef.current.rotation.y);

      // TODO: WIP moving model left and right as we scroll
      // Update the model's position as we scroll down the page (use lerp for smooth transition)
      // const targetX = calculateTargetX(scroll.offset);

      // groupRef.current.position.x = lerp(
      //   groupRef.current.position.x,
      //   targetX,
      //   0.1 // speed of transition
      // );
    }
  });

  // GESTURES
  useGesture(
    {
      onWheel: ({ delta: [, deltaY] }) => {
        // Zoom in model's z-axis on scroll up until a certain percentage
        if (groupRef.current && scroll.offset < PERCENTAGE_TO_STOP_TRAVEL_AT) {
          const newPositionZ = Math.max(
            Math.min(
              groupRef.current.position.z + deltaY * TRAVEL_SPEED,
              MAX_Z_VALUE
            ),
            MIN_Z_VALUE
          );
          groupRef.current.position.z = newPositionZ;
        }
      },
    },
    { target: window }
  );

  return (
    <group
      dispose={null}
      ref={groupRef}
      position={[0, -1, -50]}
      scale={[0.01, 0.01, 0.01]}
      rotation={[0, Math.PI / 2, 0]}
    >
      <MacbookScreen videoSource={videoSource} />
      <MacbookKeyboard />
    </group>
  );
};

// TODO: WIP moving model left and right as we scroll
// const lerp = (start: number, end: number, alpha: number) =>
//   start * (1 - alpha) + end * alpha;

// const calculateTargetX = (offset: number): number => {
//   if (offset > 0.75) {
//     // Page 4: Credits
//     return 0;
//   } else if (offset > 0.5) {
//     // Page 3: Projects
//     return 2;
//   } else if (offset > 0.25) {
//     // Page 2: About
//     return -2;
//   } else {
//     // Page 1: Hero
//     return 0;
//   }
// };

export default Macbook;
