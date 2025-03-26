import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import Two from 'two.js';

const GravityWords = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const twoRef = useRef<Two | null>(null);
  const entitiesRef = useRef<Matter.Body[]>([]);

  const copy = [
    "Idea", "Money", "Tech", "Design", "MVP", "Analytics",
    "Business", "Culture", "Marketing", "Client", "Roadmap", "Guidance"
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

    // Initialize Matter.js
    const engine = Matter.Engine.create();
    engine.world.gravity.y = 1;
    twoRef.current = two;

    // Create boundaries
    const bounds = {
      thickness: 50,
      properties: { isStatic: true }
    };

    const boundaries = [
      Matter.Bodies.rectangle(-bounds.thickness / 2, two.height / 2, bounds.thickness, two.height * 2, bounds.properties),
      Matter.Bodies.rectangle(two.width + bounds.thickness / 2, two.height / 2, bounds.thickness, two.height * 2, bounds.properties),
      Matter.Bodies.rectangle(two.width / 2, two.height + bounds.thickness / 2, two.width * 2, bounds.thickness, bounds.properties)
    ];
    Matter.World.add(engine.world, boundaries);

    // Default styles matching original
    const defaultStyles = {
      size: two.width * 0.08,
      weight: 400,
      fill: "white",
      leading: two.width * 0.08 * 0.8,
      family: "Arial, sans-serif",
      alignment: "center",
      baseline: "baseline",
      margin: { top: 0, left: 0, right: 0, bottom: 0 }
    };

    // Add slogan words
    const entities: Matter.Body[] = [];
    let x = defaultStyles.margin.left;
    let y = -two.height;

    copy.slice(0, 6).forEach((word) => {
      const group = new Two.Group();
      group.isWord = true;

      // Create text
      const text = new Two.Text(word, 0, 0, defaultStyles);
      text.size = defaultStyles.size;
      text.leading = defaultStyles.leading;

      // Create background rectangle
      const rect = text.getBoundingClientRect(true);
      const rectangle = new Two.Rectangle(0, 0, rect.width, rect.height);
      rectangle.fill = `rgba(255, ${Math.random() * 255}, ${Math.random() * 255}, 0.85)`;
      rectangle.noStroke();

      // Position group
      group.translation.set(x + rect.width / 2, y + rect.height / 2);
      text.translation.y = 14;

      // Create physics body
      const body = Matter.Bodies.rectangle(
        group.translation.x,
        group.translation.y,
        rect.width,
        rect.height,
        { restitution: 0.8, friction: 0.1 }
      );

      // Line breaking logic
      if (x + rect.width > two.width - defaultStyles.margin.left) {
        x = defaultStyles.margin.left;
        y += defaultStyles.leading;
        group.translation.set(x + rect.width / 2, y + rect.height / 2);
      }
      x += rect.width + defaultStyles.margin.left;

      // Link elements
      group.add(rectangle, text);
      two.add(group);
      entities.push(body);
      (body as any).group = group;
    });

    Matter.World.add(engine.world, entities);
    entitiesRef.current = entities;

    // Mouse interaction
    const mouse = Matter.Mouse.create(containerRef.current);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2 }
    });
    Matter.World.add(engine.world, mouseConstraint);

    // Animation loop
    two.bind('update', () => {
      Matter.Engine.update(engine);
      entities.forEach(body => {
        (body as any).group.translation.set(body.position.x, body.position.y);
        (body as any).group.rotation = body.angle;
      });
    }).play();

    // Cleanup
    return () => {
      two.unbind('update');
      two.pause();
      containerRef.current?.removeChild(two.renderer.domElement);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-[500px] relative" />;
};

export default GravityWords;