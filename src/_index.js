import { Runner, Engine, Render, World, Bodies, Constraint, Mouse, MouseConstraint, Composite } from 'matter-js';

const engine = Engine.create();
const runner = Runner.create();
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 800,
        height: 600,
        wireframes: true
    }
});

// 木材の作成
const wood = Bodies.rectangle(400, 300, 150, 20, { label: 'wood' });

// 固定点（制約）の作成
const constraints = [];
const pin1 = { x: 370, y: 300 };
const pin2 = { x: 430, y: 300 };

[pin1, pin2].forEach(pin => {
    const pinBody = Bodies.circle(pin.x, pin.y, 5, { isStatic: true, isSensor: true, render: { visible: false } });
    const constraint = Constraint.create({
        bodyA: wood,
        pointA: { x: pin.x - wood.position.x, y: pin.y - wood.position.y },
        bodyB: pinBody,
        pointB: { x: 0, y: 0 },
        length: 0,
        stiffness: 1,
        render: { visible: true }
    });
    constraints.push(constraint);
    World.add(engine.world, [pinBody, constraint]);
});

// マウス制御の追加
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        render: { visible: false }
    }
});
World.add(engine.world, mouseConstraint);

// クリックイベントで制約を解除
mouseConstraint.mouse.element.addEventListener('mousedown', function(event) {
    const mousePosition = { x: event.clientX, y: event.clientY };
    constraints.forEach(constraint => {
        if (Math.abs(mousePosition.x - constraint.bodyB.position.x) < 20 &&
            Math.abs(mousePosition.y - constraint.bodyB.position.y) < 20) {
            Composite.remove(engine.world, constraint);
        }
    });
});

World.add(engine.world, [wood]);

Render.run(render);
Runner.run(runner, engine);
