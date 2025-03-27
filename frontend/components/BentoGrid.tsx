import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import Two from 'two.js';
import Marquee from 'react-fast-marquee';

export const GravityWords = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const twoRef = useRef<Two | null>(null);
  const entitiesRef = useRef<Matter.Body[]>([]);
  
  // Remove text array and use only toys and new AI SVG items.
  const toys = [
    { type: 'teddy', size: 150 },
    { type: 'ball', size: 100 },
    { type: 'bunny', size: 80 }
  ];
  
  // Array for three tech-related AI SVG items.
  const aiSvgs = [
    { type: 'neural' },
    { type: 'chip' },
    { type: 'robot' }
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize Two.js
    const two = new Two({
      type: Two.Types.svg,
      fullscreen: false,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight
    }).appendTo(containerRef.current);
    twoRef.current = two;

    // Initialize Matter.js engine
    const engine = Matter.Engine.create();
    engine.world.gravity.y = 1;

    // Create boundaries
    const bounds = {
      thickness: 50,
      properties: { isStatic: true }
    };
    const boundaries = [
      Matter.Bodies.rectangle(
        -bounds.thickness / 2,
        two.height / 2,
        bounds.thickness,
        two.height * 2,
        bounds.properties
      ),
      Matter.Bodies.rectangle(
        two.width + bounds.thickness / 2,
        two.height / 2,
        bounds.thickness,
        two.height * 2,
        bounds.properties
      ),
      Matter.Bodies.rectangle(
        two.width / 2,
        two.height + bounds.thickness / 2,
        two.width * 2,
        bounds.thickness,
        bounds.properties
      )
    ];
    Matter.World.add(engine.world, boundaries);

    const entities: Matter.Body[] = [];

    // Helper to create a toy element (same as before)
    const createToy = (toy: { type: string; size: number }) => {
      const group = new Two.Group();
      (group as any).isToy = true;
      const center = { x: 0, y: 0 };

      if (toy.type === 'teddy') {
        const headRadius = toy.size * 0.3;
        const head = new Two.Circle(center.x, center.y, headRadius);
        head.fill = '#DDB67D';
        head.noStroke();

        const earRadius = headRadius * 0.4;
        const leftEar = new Two.Circle(center.x - headRadius * 0.7, center.y - headRadius * 0.8, earRadius);
        leftEar.fill = '#DDB67D';
        leftEar.noStroke();
        const rightEar = new Two.Circle(center.x + headRadius * 0.7, center.y - headRadius * 0.8, earRadius);
        rightEar.fill = '#DDB67D';
        rightEar.noStroke();

        const bodyWidth = toy.size * 0.8;
        const bodyHeight = toy.size * 0.6;
        const body = new Two.RoundedRectangle(center.x, center.y + headRadius + bodyHeight * 0.3, bodyWidth, bodyHeight, 20);
        body.fill = '#A67C52';
        body.noStroke();

        group.add(body, head, leftEar, rightEar);
      } else if (toy.type === 'ball') {
        const radius = toy.size / 2;
        const ball = new Two.Circle(center.x, center.y, radius);
        ball.fill = '#FF6F61';
        ball.noStroke();

        const eyeRadius = radius * 0.15;
        const leftEye = new Two.Circle(center.x - radius * 0.3, center.y - radius * 0.2, eyeRadius);
        leftEye.fill = 'white';
        leftEye.noStroke();
        const rightEye = new Two.Circle(center.x + radius * 0.3, center.y - radius * 0.2, eyeRadius);
        rightEye.fill = 'white';
        rightEye.noStroke();

        const smile = new Two.Path([
          new Two.Anchor(center.x - radius * 0.3, center.y + radius * 0.1),
          new Two.Anchor(center.x, center.y + radius * 0.3),
          new Two.Anchor(center.x + radius * 0.3, center.y + radius * 0.1)
        ], false);
        smile.noFill();
        smile.stroke = 'white';
        smile.linewidth = 2;

        group.add(ball, leftEye, rightEye, smile);
      } else if (toy.type === 'bunny') {
        const faceRadius = toy.size * 0.4;
        const face = new Two.Circle(center.x, center.y, faceRadius);
        face.fill = '#FFF0F5';
        face.noStroke();

        const earWidth = faceRadius * 0.4;
        const earHeight = faceRadius * 1.2;
        const leftEar = new Two.Ellipse(center.x - faceRadius * 0.5, center.y - faceRadius, earWidth, earHeight);
        leftEar.fill = '#FFF0F5';
        leftEar.noStroke();
        leftEar.rotation = -0.2;
        const rightEar = new Two.Ellipse(center.x + faceRadius * 0.5, center.y - faceRadius, earWidth, earHeight);
        rightEar.fill = '#FFF0F5';
        rightEar.noStroke();
        rightEar.rotation = 0.2;

        const eyeRadius = faceRadius * 0.1;
        const leftEye = new Two.Circle(center.x - faceRadius * 0.3, center.y - faceRadius * 0.1, eyeRadius);
        leftEye.fill = 'black';
        leftEye.noStroke();
        const rightEye = new Two.Circle(center.x + faceRadius * 0.3, center.y - faceRadius * 0.1, eyeRadius);
        rightEye.fill = 'black';
        rightEye.noStroke();

        const nose = new Two.Path([
          new Two.Anchor(center.x, center.y),
          new Two.Anchor(center.x - eyeRadius, center.y + eyeRadius),
          new Two.Anchor(center.x + eyeRadius, center.y + eyeRadius)
        ], true);
        nose.fill = '#FFB6C1';
        nose.noStroke();

        group.add(leftEar, rightEar, face, leftEye, rightEye, nose);
      }
      // Place the toy at a random position near the top of the canvas.
      group.translation.set(
        two.width * (0.2 + 0.6 * Math.random()),
        two.height * 0.2 * Math.random()
      );
      two.add(group);

      const toyRect = group.getBoundingClientRect();
      const body = Matter.Bodies.rectangle(
        group.translation.x,
        group.translation.y,
        toyRect.width,
        toyRect.height,
        { restitution: 0.8, friction: 0.1 }
      );
      (body as any).group = group;
      Matter.World.add(engine.world, body);
      entities.push(body);
    };

    // Helper to create an AI SVG element
    const createAISvg = (item: { type: string }) => {
      const group = new Two.Group();
      (group as any).isAISvg = true;
      // We'll use the center for drawing our shapes.
      const center = { x: 0, y: 0 };

      if (item.type === 'neural') {
        // Neural network icon: two circles connected by a line
        const circle1 = new Two.Circle(center.x - 30, center.y, 20);
        circle1.fill = '#00d2ff';
        circle1.noStroke();
        const circle2 = new Two.Circle(center.x + 30, center.y, 20);
        circle2.fill = '#ff007a';
        circle2.noStroke();
        const connector = new Two.Line(
          center.x - 10, center.y,
          center.x + 10, center.y
        );
        connector.stroke = '#ffffff';
        connector.linewidth = 4;
        group.add(circle1, circle2, connector);
      } else if (item.type === 'chip') {
        // Chip icon: a rectangle with small circles as pins
        const rect = new Two.Rectangle(center.x, center.y, 100, 60);
        rect.fill = '#7b61ff';
        rect.noStroke();
        group.add(rect);
        // Add pins (small circles)
        for (let i = -40; i <= 40; i += 20) {
          const pinTop = new Two.Circle(center.x + i, center.y - 40, 5);
          pinTop.fill = '#ffffff';
          pinTop.noStroke();
          const pinBottom = new Two.Circle(center.x + i, center.y + 40, 5);
          pinBottom.fill = '#ffffff';
          pinBottom.noStroke();
          group.add(pinTop, pinBottom);
        }
      } else if (item.type === 'robot') {
        // Robot icon: a rounded rectangle with two eyes
        const bodyRect = new Two.RoundedRectangle(center.x, center.y, 80, 100, 10);
        bodyRect.fill = '#ffb400';
        bodyRect.noStroke();
        const eyeLeft = new Two.Circle(center.x - 15, center.y - 10, 8);
        eyeLeft.fill = '#000000';
        eyeLeft.noStroke();
        const eyeRight = new Two.Circle(center.x + 15, center.y - 10, 8);
        eyeRight.fill = '#000000';
        eyeRight.noStroke();
        group.add(bodyRect, eyeLeft, eyeRight);
      }

      // Place the AI SVG at a random position near the top
      group.translation.set(
        two.width * (0.2 + 0.6 * Math.random()),
        two.height * 0.2 * Math.random()
      );
      two.add(group);

      const aiRect = group.getBoundingClientRect();
      const body = Matter.Bodies.rectangle(
        group.translation.x,
        group.translation.y,
        aiRect.width,
        aiRect.height,
        { restitution: 0.8, friction: 0.1 }
      );
      (body as any).group = group;
      Matter.World.add(engine.world, body);
      entities.push(body);
    };

    // Combine toys and aiSvgs arrays into one list.
    const mixedItems: { type: 'toy' | 'ai'; value: any }[] = [];
    const maxLen = Math.max(toys.length, aiSvgs.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < toys.length) {
        mixedItems.push({ type: 'toy', value: toys[i] });
      }
      if (i < aiSvgs.length) {
        mixedItems.push({ type: 'ai', value: aiSvgs[i] });
      }
    }

    // Launch items one-by-one with an interval.
    let index = 0;
    const interval = setInterval(() => {
      if (index >= mixedItems.length) {
        clearInterval(interval);
        return;
      }
      const item = mixedItems[index];
      if (item.type === 'toy') {
        createToy(item.value);
      } else if (item.type === 'ai') {
        createAISvg(item.value);
      }
      index++;
    }, 800); // 800ms delay between launches

    entitiesRef.current = entities;

    // Mouse interaction setup
    const mouse = Matter.Mouse.create(containerRef.current);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2 }
    });
    Matter.World.add(engine.world, mouseConstraint);

    // Animation loop for updating positions
    two.bind('update', () => {
      Matter.Engine.update(engine);
      entities.forEach(body => {
        // Prevent upward motion when above half the canvas height.
        if (body.position.y < two.height * 0.5) {
          Matter.Body.setVelocity(body, { x: 0, y: body.velocity.y });
        }
        (body as any).group.translation.set(body.position.x, body.position.y);
        (body as any).group.rotation = body.angle;
      });
    }).play();

    return () => {
      two.unbind('update');
      two.pause();
      containerRef.current?.removeChild(two.renderer.domElement);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      clearInterval(interval);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-[500px] relative" />;
};


const BentoGrid = () => {
    return (
        <div>
            <div className="grid grid-cols-3 md:grid-cols-3 grid-rows-5 md:grid-rows-3 gap-2 md:gap-6 m-4">
                <div className="col-start-1 row-start-1 col-span-3 md:col-start-1 md:row-start-1 md:col-span-1 md:row-span-1 bg-brown rounded-3xl p-10">
                    <div className="flex justify-between uppercase font-loos-wide text-5xl items-center ">
                        <p>30</p>
                        <p className='text-3xl'>GB</p>
                    </div>
                </div>
                <div className="col-start-1 row-start-2 col-span-3 md:col-start-1 md:row-start-2 md:col-span-1 md:row-span-1 bg-brown rounded-3xl p-10">
                    <div className="flex justify-between uppercase font-loos-wide text-5xl items-center ">
                        <p>300</p>
                        <p className='text-3xl'>Minutes</p>
                    </div></div>
                <div className="col-start-1 row-start-3 col-span-3 md:col-start-1 md:row-start-3 md:col-span-1 md:row-span-1 bg-brown rounded-3xl p-10">
                    <div className="flex justify-between uppercase font-loos-wide text-5xl items-center ">
                        <p>50</p>
                        <p className='text-3xl'>SMS</p>
                    </div>
                </div>
                <div className="col-start-1 row-start-5 col-span-3 md:col-start-2 md:row-start-1 md:col-span-1 md:row-span-3 bg-brown rounded-3xl p-10">
                <p className='text-center font-loos-wide text-3xl mb-20'>
                        So Many Tools
                    </p>
                <GravityWords />
                </div>
                <div className="col-start-1 row-start-4 col-span-3 md:col-start-3 md:row-start-1 md:col-span-1 md:row-span-3 bg-brown rounded-3xl p-10">
                    <p className='text-center font-loos-wide text-3xl mb-44'>
                        Balance Transfer
                    </p>
                    <Marquee gradient={false} className='bg-brown' speed={40} direction="right">
                        {Array(20).fill(
                            <div className="mx-8 flex items-center gap-4 p-3 font-loos-wide text-4xl font-bold text-white/10">
                                <span className='text-white'>GB</span>
                            </div>
                        )}
                    </Marquee>
                    <Marquee gradient={false} className='bg-brown' speed={40} direction="left">
                        {Array(20).fill(
                            <div className="mx-8 flex items-center gap-4 p-3 font-loos-wide text-4xl font-bold text-white/10">
                                <span className='text-white'>MINUTES</span>
                            </div>
                        )}
                    </Marquee>
                    <Marquee gradient={false} className='bg-brown' speed={40} direction="right">
                        {Array(20).fill(
                            <div className="mx-8 flex items-center gap-4 p-3 font-loos-wide text-4xl font-bold text-white/10">
                                <span className='text-white'>SMS</span>
                            </div>
                        )}
                    </Marquee>

                </div>

            </div>
        </div>
    )
}

export default BentoGrid
