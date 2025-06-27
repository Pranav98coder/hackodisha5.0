"use client";

import { useState, useRef, useEffect } from "react";
import SectionTitle from "@/components/shared/section-title";
// import {
//     Engine,
//     World,
//     Bodies,
//     Runner,
//     Mouse,
//     MouseConstraint,
// } from "matter-js";
import { defaultStatsConfig } from "@/config/statistics";

export default function Statistics() {
  const stats = defaultStatsConfig;

  const [labelPositions, setLabelPositions] = useState(
    stats.map(() => ({ x: 15, y: 15, angle: 0 }))
  );
  const cardsRef = useRef(stats.map(() => useRef(null)));
  const labelsRef = useRef(stats.map(() => useRef(null)));

  useEffect(() => {
    if (!cardsRef.current || !labelsRef.current) return;

    let engines = [];
    let runners = [];
    let labelBodies = [];
    let mouseConstraints = [];
    let animationId = null;

    const initPhysics = () => {
      const cardsReady = cardsRef.current.every((ref) => ref?.current);
      if (!cardsReady) {
        setTimeout(initPhysics, 100);
        return;
      }

      cleanup();

      stats.forEach((stat, index) => {
        const card = cardsRef.current[index]?.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const engine = Engine.create();
        engine.world.gravity.y = 0.8;
        engines.push(engine);

        const labelW = 165;
        const labelH = 45;

        const labelBody = Bodies.rectangle(
          width * 0.3 + Math.random() * width * 0.4,
          30 + Math.random() * 50,
          labelW,
          labelH,
          {
            restitution: 0.4,
            friction: 0.1,
            frictionAir: 0.01,
            angle: (stat.rotation * Math.PI) / 180,
          }
        );
        labelBodies.push(labelBody);

        const wallThickness = 20;
        const ground = Bodies.rectangle(
          width / 2,
          height - 110,
          width - 10,
          wallThickness,
          { isStatic: true }
        );

        const leftWall = Bodies.rectangle(
          0,
          height / 2,
          wallThickness,
          height,
          { isStatic: true }
        );

        const rightWall = Bodies.rectangle(
          width,
          height / 2,
          wallThickness,
          height,
          { isStatic: true }
        );

        const ceiling = Bodies.rectangle(width / 2, 0, width, wallThickness, {
          isStatic: true,
        });

        World.add(engine.world, [
          labelBody,
          ground,
          leftWall,
          rightWall,
          ceiling,
        ]);

        const mouse = Mouse.create(card);
        const mouseConstraint = MouseConstraint.create(engine, {
          mouse: mouse,
          constraint: {
            stiffness: 0.2,
            render: { visible: false },
          },
        });
        World.add(engine.world, mouseConstraint);
        mouseConstraints.push(mouseConstraint);

        const runner = Runner.create();
        Runner.run(runner, engine);
        runners.push(runner);
      });

      const animate = () => {
        if (labelBodies.length > 0) {
          labelBodies.forEach((body, index) => {
            const labelEl = labelsRef.current[index]?.current;
            if (labelEl) {
              const x = body.position.x - 82.5;
              const y = body.position.y - 22.5;

              labelEl.style.left = `${x}px`;
              labelEl.style.top = `${y}px`;
              labelEl.style.transform = `rotate(${body.angle}rad)`;
            }
          });
        }
        animationId = requestAnimationFrame(animate);
      };
      animate();
    };

    const cleanup = () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      runners.forEach((runner) => Runner.stop(runner));
      engines.forEach((engine) => {
        World.clear(engine.world);
        Engine.clear(engine);
      });
      engines = [];
      runners = [];
      labelBodies = [];
      mouseConstraints = [];
    };

    setTimeout(initPhysics, 100);

    return cleanup;
  }, [stats]);

  return (
    <>
      <SectionTitle title={"STATISTICS"} lineGradient="purple" />
      <div className="flex flex-col justify-center items-center w-full max-w-full overflow-hidden h-auto min-h-screen px-0 md:px-4 mx-auto bg-[#BC82FE] relative">
        <div className="w-full overflow-hidden">
          <div className="flex flex-col sm:flex-row w-full max-w-[1541px] justify-center items-center gap-8 sm:gap-4 md:gap-5 lg:gap-20 mx-auto px-4">
            {stats.map((stat, index) => {
              return (
                <div
                  key={stat.id || index}
                  className={`w-[280px] h-[280px] sm:w-[250px] sm:h-[250px] md:w-[280px] md:h-[280px] lg:w-[300px] lg:h-[300px] flex-shrink-0 rounded-[24px] border-2 border-black ${stat.bg} ${stat.hoverBg} transition-colors duration-300 ease-in-out relative mb-8 sm:mb-0 group overflow-hidden`}
                  ref={cardsRef.current[index]}
                >
                  {" "}
                  <div
                    ref={labelsRef.current[index]}
                    className="absolute cursor-grab active:cursor-grabbing inline-flex py-3 px-6 justify-center items-center gap-2.5 rounded-[48px] border-2 border-black bg-white hover:bg-[#F3F3F3] hover:shadow-md select-none will-change-transform z-10"
                    style={{
                      position: "absolute",
                      left: `${labelPositions[index]?.x || 15}px`,
                      top: `${labelPositions[index]?.y || 15}px`,
                      transform: `rotate(${
                        labelPositions[index]?.angle || 0
                      }rad)`,
                      transformOrigin: "center center",
                      WebkitUserSelect: "none",
                      MozUserSelect: "none",
                      msUserSelect: "none",
                      userSelect: "none",
                      width: "165px",
                      height: "45px",
                    }}
                  >
                    <p className="text-black font-[Bricolage_Grotesque] text-2xl font-normal leading-normal tracking-[-0.48px] select-none">
                      {stat.label}
                    </p>
                  </div>{" "}
                  <div className="absolute bottom-0 left-0 right-0 text-center pb-4">
                    <p className="text-black font-sans text-[70px] sm:text-[80px] md:text-[90px] lg:text-[100px] xl:text-[120px] font-extrabold leading-none select-none">
                      {stat.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
