export default class CollisionCategoryUtil {
    constructor() {
        this.currentCategory = 0x0001;
    }

    // 次のカテゴリを生成するメソッド
    generateNextCategory() {
        const nextCategory = this.currentCategory;
        this.currentCategory <<= 1;

        // 32ビットを超える場合のエラー処理
        if (this.currentCategory > 0xFFFFFFFF) {
            throw new Error("カテゴリが上限に達しました。");
        }

        return nextCategory;
    }

    // デバッグや確認用に現在のカテゴリを取得するメソッド
    getCurrentCategory() {
        return this.currentCategory;
    }
}
