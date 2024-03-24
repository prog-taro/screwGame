// src/components/Wood.jsにおけるWoodクラスの更新
import { Bodies, Constraint, Composite, World } from 'matter-js';
import CollisionManager from '../utils/CollisionManager';

export default class Wood {
    constructor(x, y, width, height, collisionCategory, screwHoles, screwHoleCategory, engine) {
        // isStaticをfalseに設定して、木材が重力の影響を受けるようにする
        this.collisionCategory = collisionCategory;
        this.body = Bodies.rectangle(x, y, width, height, {
            isStatic: false,
            collisionFilter: {
                category: collisionCategory,
                mask: screwHoleCategory
            },
             label: 'wood'
        });
        this.engine = engine;
        this.collisionManager = new CollisionManager(engine, this.body);
        this.constraints = [];
        this.holes = [screwHoles[0].getBody().id,screwHoles[1].getBody().id,screwHoles[2].getBody().id];
        screwHoles.forEach(screwHole => this.setConstraint(screwHole));
    }

    getBody() {
        return this.body;
    }

    getConstraintsLength() {
        return this.constraints.length;
    }

    setConstraint(screwHole) {
        if (this.holes.includes(screwHole.getBody().id)) {
            const screwHoleBody = screwHole.getBody();
            screwHole.removeCollision(this.collisionCategory);
            const constraint = Constraint.create({
                bodyA: this.body,
                pointA: { x: screwHoleBody.position.x - this.body.position.x, y: screwHoleBody.position.y - this.body.position.y },
                bodyB: screwHoleBody,
                pointB: { x: 0, y: 0 },
                length: 0,
                stiffness: 1,
                render: { visible: true }
            });
            World.add(this.engine.world, [constraint]);
            this.constraints.push({
                screwHole: screwHoleBody.id,
                constraint: constraint
            });
        }
    }

    removeConstraint(screwHole) {
        if (this.holes.includes(screwHole.getBody().id)) {
            const constraint = this.constraints.find(constraint => constraint.screwHole === screwHole.getBody().id);
            this.constraints = this.constraints.filter(constraint => constraint.screwHole !== screwHole.getBody().id);
            Composite.remove(this.engine.world, constraint.constraint);
            screwHole.addCollision(this.collisionCategory);
            if (this.getConstraintsLength() <= 1) {
                this.holes = this.constraints.map(constraint => constraint.screwHole);
            }
        }
    }

    ifCollisionRollback(screwHole, callback) {
        this.collisionManager.ifCollisionRollback(screwHole.getBody(), callback);
    }
}
