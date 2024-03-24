// components/main.js
import { Bodies, Runner, Engine, Render, World, Mouse, MouseConstraint } from 'matter-js';
import Wood from './Wood';
import ScrewHole from './ScrewHole';
import { addMouseClickEvent } from '../utils/EventHandler';
import CollisionCategoryUtil from '../utils/CollisionCategoryUtil';

class Main {
    constructor(container) {
        this.container = container;
        // 衝突カテゴリ管理クラスのインスタンスを作成
        this.collisionCategoryUtil = new CollisionCategoryUtil();
        this.init();
    }

    init() {
        // エンジンの作成と重力設定
        this.engine = Engine.create();
        this.engine.world.gravity.y = 1; // 重力の強さを設定

        this.render = Render.create({
            element: this.container,
            engine: this.engine,
            options: { width: 300, height: 600, wireframes: false }
        });

        this.runner = Runner.create();


        // ネジ穴のカテゴリの生成
        this.screwHoleCategory = this.collisionCategoryUtil.generateNextCategory();

        this.screwHoles = [
            new ScrewHole(100, 200, 15, this.screwHoleCategory, true),
            new ScrewHole(200, 200, 15, this.screwHoleCategory, true),
            new ScrewHole(150, 200, 15, this.screwHoleCategory, true),
            new ScrewHole(120, 250, 15, this.screwHoleCategory, false),
            new ScrewHole(180, 250, 15, this.screwHoleCategory, false),
            new ScrewHole(120, 150, 15, this.screwHoleCategory, false),
            new ScrewHole(180, 150, 15, this.screwHoleCategory, false)
        ];
        const woodCategory = this.collisionCategoryUtil.generateNextCategory();
        this.woods = [new Wood(150, 200, 150, 50, woodCategory, this.screwHoles, this.screwHoleCategory, this.engine)];

        World.add(this.engine.world, [
            ...this.woods.map(wood => wood.getBody()),
            ...this.screwHoles.map(screwHole => screwHole.getBody())
        ]);

        this.mouse = Mouse.create(this.render.canvas);
        this.mouseConstraint = MouseConstraint.create(this.engine, { mouse: this.mouse });
        // World.add(this.engine.world, this.mouseConstraint);

        // イベントハンドラの追加
        addMouseClickEvent(this.mouseConstraint, this.screwHoles, this.woods);

        Render.run(this.render);
        Runner.run(this.runner, this.engine);
    }
}

export default Main;
