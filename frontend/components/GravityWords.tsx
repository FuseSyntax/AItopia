import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import Two from 'two.js';

const GravityWords = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const twoRef = useRef<Two | null>(null);
  const entitiesRef = useRef<Matter.Body[]>([]);
  
  // The two arrays for texts and toys
  const copy = [
    "Idea Money", "Tech Design", "MVP Analytics",
    "Business Culture", "Marketing Client", "Roadmap Guidance"
  ];
  
  const toys = [
    { type: 'teddy', size: 150 },
    { type: 'ball', size: 100 },
    { type: 'bunny', size: 80 }
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

    // Default text style
    const defaultStyles = {
      size: two.width * 0.03,
      fill: "white",
      leading: two.width * 0.08 * 0.5,
      family: "Loos Extra Wide, sans-serif",
      alignment: "center",
      baseline: "baseline",
      margin: { left: 20, right: 20, top: 0, bottom: 0 }
    };

    const entities: Matter.Body[] = [];
    // Use a cursor for text placement
    let textX = defaultStyles.margin.left;
    let textY = -two.height;

    // Helper to create a text element
    const createText = (word: string) => {
      const group = new Two.Group();
      (group as any).isWord = true;

      const text = new Two.Text(word, 0, 0, defaultStyles);
      text.size = defaultStyles.size;
      text.leading = defaultStyles.leading;

      // Get text dimensions and add padding
      const rect = text.getBoundingClientRect(true);
      const paddingX = 120;
      const paddingY = 40;
      const newWidth = rect.width + paddingX;
      const newHeight = rect.height + paddingY;

      const rectangle = new Two.Rectangle(0, 0, newWidth, newHeight);
      rectangle.fill = `rgba(255, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.85)`;
      rectangle.noStroke();
      rectangle.radius = 15;

      // Wrap to new line if needed
      if (textX + newWidth > two.width - defaultStyles.margin.left) {
        textX = defaultStyles.margin.left;
        textY += defaultStyles.leading;
      }
      group.translation.set(textX + newWidth / 2, textY + newHeight / 2);
      textX += newWidth + defaultStyles.margin.left;
      text.translation.y = 8;
      group.add(rectangle, text);
      two.add(group);

      // Create corresponding Matter.js body
      const body = Matter.Bodies.rectangle(
        group.translation.x,
        group.translation.y,
        newWidth,
        newHeight,
        { restitution: 0.8, friction: 0.1 }
      );
      (body as any).group = group;
      Matter.World.add(engine.world, body);
      entities.push(body);
    };

    // Helper to create a toy element
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

      // Create the Matter.js body using the group's bounding box.
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

    // Combine the words and toys arrays into one interleaved list.
    const mixedItems: { type: 'word' | 'toy'; value: any }[] = [];
    const maxLen = Math.max(copy.length, toys.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < copy.length) mixedItems.push({ type: 'word', value: copy[i] });
      if (i < toys.length) mixedItems.push({ type: 'toy', value: toys[i] });
    }

    // Launch items one-by-one with an interval.
    let index = 0;
    const interval = setInterval(() => {
      if (index >= mixedItems.length) {
        clearInterval(interval);
        return;
      }
      const item = mixedItems[index];
      if (item.type === 'word') {
        createText(item.value);
      } else {
        createToy(item.value);
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

export default GravityWords;
