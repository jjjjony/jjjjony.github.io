import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_VIDEO_SOURCE,
} from "~/constants/defaults";
import { Html, OrbitControls, ScrollControls } from "@react-three/drei";
import { useIsMobile } from "~/hooks/useIsMobile";
import { Canvas } from "@react-three/fiber";
import Projects from "./Projects.Section";
import _debounce from "lodash/debounce";
import Credits from "./Credits.Section";
import About from "./About.Section";
import Hero from "./Hero.Section";
import DotsCircle from "./Dots";
import Macbook from "./Macbook";
import Cursor from "./Cursor";

const DEBOUNCED_DELAY_MS = 10;

const Scene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  const [videoSource, setVideoSource] = useState(
    `/videos/${DEFAULT_VIDEO_SOURCE}`
  );

  const changeBackgroundCallback = useCallback(
    _debounce((newColor: string | null) => {
      document.body.style.backgroundColor = newColor
        ? newColor
        : DEFAULT_BACKGROUND_COLOR;
    }, DEBOUNCED_DELAY_MS),
    []
  );

  const changeLaptopScreenCallback = useCallback(
    _debounce((videoSource: string | null) => {
      setVideoSource(
        `/videos/${videoSource ? videoSource : DEFAULT_VIDEO_SOURCE}`
      );
    }, DEBOUNCED_DELAY_MS),
    [setVideoSource]
  );

  useEffect(() => {
    // Cleanup
    return () => {
      changeBackgroundCallback.cancel();
      changeLaptopScreenCallback.cancel();
    };
  }, [changeBackgroundCallback, changeLaptopScreenCallback]);

  return (
    <div className="h-screen w-screen select-none">
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 35] }}
        className="h-screen w-screen"
      >
        {!isMobile && <Cursor />}

        {/* TODO: test the suspense */}
        <Suspense fallback={null}>
          <Lighting />
          {/* <OrbitControls enableZoom={false}/> */}
          <ScrollControls pages={3}>
            {/* Models */}
            <DotsCircle />
            <Macbook videoSource={videoSource} />

            {/* Sections */}
            <Html fullscreen>
              <Hero />
            </Html>
            <Html fullscreen style={{ marginTop: "100vh" }}>
              <About
                changeBackgroundCallback={changeBackgroundCallback}
                changeLaptopScreenCallback={changeLaptopScreenCallback}
              />
            </Html>
            <Html fullscreen style={{ marginTop: "200vh" }}>
              <Projects
                changeBackgroundCallback={changeBackgroundCallback}
                changeLaptopScreenCallback={changeLaptopScreenCallback}
              />
            </Html>
            <Html fullscreen style={{ marginTop: "300vh" }}>
              <Credits />
            </Html>
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
};

const Lighting = () => {
  return (
    <>
      <ambientLight />
      <directionalLight />
      <pointLight position={[-30, 0, -30]} power={10.0} />
    </>
  );
};

export default Scene;
