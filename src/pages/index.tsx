import { useIsInView } from "~/hooks/use-is-in-view";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Html } from "@react-three/drei";
import Model from "~/components/model";
import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

const Home: NextPage = (props) => {
  return (
    <>
      <Head>
        <title>johnnymadigan</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="an introduction" />
        <meta property="og:title" content="johnnymadigan" />
        <meta property="og:description" content="an introduction" />
        <meta property="og:image" content="/favicon.ico" />
        <meta property="og:image:alt" content="j" />
      </Head>
      <main className="min-h-[100vh] bg-[url('/bg.gif')] bg-cover">
        {/* relative for socials */}
        <div className="relative flex w-screen flex-col">
          <Socials />
          <ThreeScene />
          <WhoAmI />
          <Credits />
        </div>
      </main>
    </>
  );
};

const ThreeScene = () => (
  // specify z index so socials can be positioned on top
  <div className="-z-0 h-screen w-screen select-none">
    <div className="h-screen w-screen">
      <Canvas camera={{ position: [0, 0, 20] }} resize={{ debounce: 50 }}>
        <Suspense fallback={null}>
          <directionalLight position={[0, -5, -1]} />
          <ambientLight intensity={0.7} />
          <Model />
          <Html center>
            {/* for smooth model movement, avoid cursor position jumping when mousing in/out element by making element full-screen */}
            <h1 className="flex h-screen w-screen animate-zoomIn cursor-default items-center justify-center justify-items-center text-center font-anton text-[24vw] font-extrabold tracking-tighter text-white md:text-[11vw]">
              JOHNNY MADIGAN
            </h1>
          </Html>
          {/* <OrbitControls /> */}
        </Suspense>
      </Canvas>
    </div>
  </div>
);

const Socials = () => {
  return (
    // parent must be relative for positioning and z index max to keep on top
    <div className="fixed z-50 flex w-full select-none flex-row space-x-2 bg-black p-4">
      <h1 className="font-anton text-4xl font-extrabold tracking-tight text-white">
        JM
      </h1>
      <Link href={"https://github.com/johnnymadigan"}>
        <Image
          src={"/github.png"}
          alt="github"
          height={37}
          width={37}
          className="duration-700 hover:scale-110"
        />
      </Link>
      <Link href={"https://www.linkedin.com/in/johnnymadigan/"}>
        <Image
          src={"/linkedin.png"}
          alt="linkedin"
          height={37}
          width={37}
          className="duration-700 hover:scale-110"
        />
      </Link>
    </div>
  );
};

const WhoAmI = () => {
  const elementRef = useRef<HTMLSpanElement>(null);
  const elementIsInView = useIsInView(elementRef);

  const Highlight = ({ words }: { words: string }) => (
    <span className="whitespace-nowrap rounded-full bg-gray-800 px-2 py-1 font-bold text-amber-400">
      {words}
    </span>
  );

  return (
    <span
      ref={elementRef}
      className={`my-80 flex flex-col content-center text-center ${
        elementIsInView ? "animate-fadeIn" : "invisible"
      }`}
    >
      <h1 className="font-anton text-5xl font-extrabold tracking-tight text-white">
        who am i ?
      </h1>
      <span className="text-md mt-5 max-w-4xl space-y-5 self-center px-10 text-gray-400">
        <p>
          I'm a <Highlight words="full stack software developer" /> (.NET,
          React) currently working at Queensland Health on a portfolio of
          enterprise apps.
        </p>
        <p>
          As someone who <Highlight words="thrives" /> on mastering their stack,
          finding solutions to complex problems, and sharing knowledge, I
          believe I can bring <Highlight words="value" /> to any team.
        </p>
      </span>
    </span>
  );
};

const Credits = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const elementIsInView = useIsInView(elementRef);

  return (
    <div
      ref={elementRef}
      className={`content center flex h-80 flex-col space-y-3 text-center text-xs text-gray-600 ${
        elementIsInView ? "animate-fadeIn" : "invisible"
      }`}
    >
      <p>
        <a className="italic" href="https://skfb.ly/DXqI">
          Hotline Miami 2: Wrong Number - Tony mask
        </a>{" "}
        by down_limit
      </p>
      <p>
        <a
          className="italic"
          href="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzc5MmVlNDNiMTc4Y2NmNjhmNzczNDFlMTRhNjQ5MmJiNmVhZGZiYiZjdD1n/g0gAJDvoNJBSwx8wP0/giphy.gif"
        >
          Glow Black And White
        </a>{" "}
        by Erica Anderson
      </p>
      <p>© Johnny Madigan</p>
    </div>
  );
};

export default Home;
