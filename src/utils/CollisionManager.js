import { Events, Body } from 'matter-js';

class CollisionManager {
    constructor(engine, targetBody) {
        this.engine = engine;
        this.targetBody = targetBody;
        this.touchingBodies = new Map();
        this.rollbacks = [];
        this.rollbackEnds = [];
        this.prevState = {};

        this.setupCollisionListeners();
    }

    setupCollisionListeners() {
        // 衝突開始イベント
        Events.on(this.engine, 'collisionStart', (event) => this.handleCollisionStart(event));

        // 衝突中イベント
        Events.on(this.engine, 'collisionActive', (event) => this.handleCollisionActive(event));

        // 衝突終了イベント
        Events.on(this.engine, 'collisionEnd', (event) => this.handleCollisionEnd(event));

        // 更新後イベント
        Events.on(this.engine, 'afterUpdate', (event) => this.handleAfterUpdate(event));
    }

    handleCollisionStart(event) {
        event.pairs.forEach((pair) => {
            const { bodyA, bodyB } = pair;
            if (bodyA === this.targetBody || bodyB === this.targetBody) {
                const otherBody = bodyA === this.targetBody ? bodyB : bodyA;
                this.touchingBodies.set(otherBody.id, otherBody);
            }
        });
        this.doRollback();
    }

    handleCollisionActive(event) {
        event.pairs.forEach((pair) => {
            const { bodyA, bodyB } = pair;
            if (bodyA === this.targetBody || bodyB === this.targetBody) {
                const otherBody = bodyA === this.targetBody ? bodyB : bodyA;
                if (!this.touchingBodies.has(otherBody.id)) {
                    this.touchingBodies.set(otherBody.id, otherBody);
                }
            }
        });
    }

    handleCollisionEnd(event) {
        event.pairs.forEach((pair) => {
            const { bodyA, bodyB } = pair;
            if (bodyA === this.targetBody || bodyB === this.targetBody) {
                const otherBody = bodyA === this.targetBody ? bodyB : bodyA;
                this.touchingBodies.delete(otherBody.id);
            }
        });
        this.doRollbackEnds();
    }

    handleAfterUpdate(event) {
        this.rollbacks = [];
    }

    getTouchingBodies() {
        return Array.from(this.touchingBodies.values());
    }

    ifCollisionRollback(testBody, callback) {
        this.rollbacks.push({testBodyId: testBody.id, callback: callback});
    }

    doRollback () {
        if (this.rollbacks.length >= 1) {
            this.rollbacks.forEach(rollback => {
                if (this.touchingBodies.has(rollback.testBodyId)) {
                    rollback.callback();
                }
            });
            this.rollbacks = [];

            this.prevState = {
                position: { ...this.targetBody.position },
                velocity: { ...this.targetBody.velocity },
                angle: this.targetBody.angle,
                angularVelocity: this.targetBody.angularVelocity
            };
            this.rollbackEnds.push({
                testBodyId: testBody.id,
                callback: () => {
                    // 衝突したボディを初期状態に戻す
                    if (this.prevState) {
                        console.log(this.prevState);
                        Body.setVelocity(this.targetBody, this.prevState.velocity);
                        Body.setPosition(this.targetBody, this.prevState.position);
                        Body.setAngle(this.targetBody, this.prevState.angle);
                        Body.setAngularVelocity(this.targetBody, this.prevState.angularVelocity);
                        this.prevState = {};
                    }
                }
            });
        }
    }

    doRollbackEnds () {
        this.rollbackEnds.forEach(rollback => {
            if (!this.touchingBodies.has(rollback.testBodyId)) {
                rollback.callback();
            }
        });
        this.rollbackEnds = [];
    }
}

export default CollisionManager;
