// src/components/ScrewHole.js
import { Bodies } from 'matter-js';

export default class ScrewHole {
    constructor(x, y, radius, collisionCategory, isFilled) {
        this.collisionMask = 0xFFFFFFFE;
        this.body = Bodies.circle(x, y, radius, {
            isStatic: true,
            collisionFilter: {
                category: collisionCategory,
                mask: isFilled ? this.collisionMask : 0 // ネジが刺さっていない場合は何とも衝突しない
            },
            render: { fillStyle: isFilled ? 'gray' : '#531' },
            label: 'screwHole'
        });
        this.isFilled = isFilled; // ネジが刺さっているかどうかの状態
        this.isSelected = false; // ネジ穴が選択されているかの状態
    }

    setIsFilled(isFilled) {
        this.isFilled = isFilled;
        this.updateColor();
    }

    setSelected(isSelected) {
        this.isSelected = isSelected;
        this.updateColor();
    }

    updateColor() {
        // 選択されている場合は赤色、そうでない場合は通常の色
        if (this.isSelected) {
            this.body.render.fillStyle = '#f00';
        } else {
            this.body.collisionFilter.mask = this.isFilled ? this.collisionMask : 0; // ネジが刺さっていない場合は何とも衝突しない
            this.body.render.fillStyle = this.isFilled ? 'gray' : '#531';
        }
    }

    removeCollision(category) {
        this.collisionMask &= ~category;
        this.body.collisionFilter.mask = this.isFilled ? this.collisionMask : 0; // ネジが刺さっていない場合は何とも衝突しない
    }

    addCollision(category) {
        this.collisionMask |= category;
        this.body.collisionFilter.mask = this.isFilled ? this.collisionMask : 0; // ネジが刺さっていない場合は何とも衝突しない
    }

    getBody() {
        return this.body;
    }

    getIsFilled() {
        return this.isFilled;
    }

    getSelected() {
        return this.isSelected;
    }
}
