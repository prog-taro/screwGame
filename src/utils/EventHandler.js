// src/utils/EventHandler.js
import { Events, Query } from 'matter-js';

let selectedScrewHole = null;

export const addMouseClickEvent = (mouseConstraint, screwHoles, woods) => {
    Events.on(mouseConstraint, 'mousedown', function(event) {
        const mousePosition = event.mouse.position;
        const clickedBodies = Query.point(screwHoles.map(screwHole => screwHole.getBody()), mousePosition);

        if (clickedBodies.length > 0) {
            const clickedBody = clickedBodies[0];
            const clickedScrewHole = screwHoles.find(screwHole => screwHole.getBody() === clickedBody);

            woods.forEach(wood => console.log(wood.collisionManager.getTouchingBodies()));
            if (selectedScrewHole === clickedScrewHole) {
                // ネジの選択を解除
                selectedScrewHole.setSelected(false); // 前に選択されたネジ穴の選択状態を解除
                selectedScrewHole = null;
                console.log('ネジの選択が解除されました。');
            } else if (clickedScrewHole.getIsFilled()) {
                // ネジが選択された場合、色を変更
                if (selectedScrewHole) {
                    selectedScrewHole.setSelected(false); // 前に選択されたネジ穴の選択状態を解除
                }
                selectedScrewHole = clickedScrewHole;
                selectedScrewHole.setSelected(true);
                console.log('ネジが選択されました。');
            } else if (!clickedScrewHole.getIsFilled() && selectedScrewHole) {
                // ネジを移動させる場合
                selectedScrewHole.setIsFilled(false);
                clickedScrewHole.setIsFilled(true);
                selectedScrewHole.setSelected(false); // 選択状態を解除

                const rollbackSelectedScrewHole = selectedScrewHole;
                const rollbackClickedScrewHole = clickedScrewHole;

                woods.forEach(wood => {
                    wood.setConstraint(clickedScrewHole);
                    wood.removeConstraint(selectedScrewHole);
                    wood.ifCollisionRollback(clickedScrewHole, () => {
                        rollbackSelectedScrewHole.setIsFilled(true);
                        rollbackClickedScrewHole.setIsFilled(false);
                        rollbackSelectedScrewHole.setSelected(true);
                        selectedScrewHole = rollbackSelectedScrewHole;
                        woods.forEach(wood => {
                            wood.setConstraint(rollbackSelectedScrewHole);
                            wood.removeConstraint(rollbackClickedScrewHole);
                        });
                        console.log('ネジが移動がロールバックされました。');
                    });
                });

                selectedScrewHole = null;

                console.log('ネジが移動されました。');
            }
        }
    });
};

/*
// 接触しているボディを追跡するためのマップ
const touchingBodies = new Map();

// 衝突開始イベントをリッスン
Events.on(engine, 'collisionStart', function(event) {
    event.pairs.forEach(function(pair) {
        const { bodyA, bodyB } = pair;

        // 特定のボディ（targetBody）が衝突した場合
        if (bodyA === targetBody || bodyB === targetBody) {
            const otherBody = bodyA === targetBody ? bodyB : bodyA;
            // 接触しているボディを追加
            touchingBodies.set(otherBody.id, otherBody);
        }
    });
});

// 衝突中イベントをリッスン
Events.on(engine, 'collisionActive', function(event) {
    event.pairs.forEach(function(pair) {
        const { bodyA, bodyB } = pair;

        if (bodyA === targetBody || bodyB === targetBody) {
            const otherBody = bodyA === targetBody ? bodyB : bodyA;
            // 既に追加されている場合は更新の必要なし
            if (!touchingBodies.has(otherBody.id)) {
                touchingBodies.set(otherBody.id, otherBody);
            }
        }
    });
});

// 衝突終了イベントをリッスン
Events.on(engine, 'collisionEnd', function(event) {
    event.pairs.forEach(function(pair) {
        const { bodyA, bodyB } = pair;

        if (bodyA === targetBody || bodyB === targetBody) {
            const otherBody = bodyA === targetBody ? bodyB : bodyA;
            // 接触しているボディを削除
            touchingBodies.delete(otherBody.id);
        }
    });
});

// 特定の時点でtargetBodyに接触しているすべてのボディを取得
function getTouchingBodies() {
    return Array.from(touchingBodies.values());
}
*/