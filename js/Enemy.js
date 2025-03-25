/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-03-25 11:09:52
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-03-25 14:02:41
 * @FilePath: \canvas\Enemy.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { GameElement } from "./GameElement.js";
import { Bullet } from "./Bullet.js";
import { ENEMY_IMAGE_SRC, ENEMY_BULLET_IMAGE_SRC } from "./Config.js";

export class Enemy extends GameElement {
    constructor(x, y, ctx, domConfig) {
        super(x, y, ENEMY_IMAGE_SRC, domConfig);
        this.shootDelay = 2000;
        this.lastEnemyShotTime = 0;
        this.ctx = ctx;
    }

    update() {
        super.update(this.ctx);
        this.shoot();
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastEnemyShotTime > this.shootDelay) {
            this.lastEnemyShotTime = now;

            const bulletX = this.x + this.width / 2 - 2.5; // 从敌人中心发射
            const bulletY = this.y + this.height; // 从敌人底部发射

            // 子弹方向向左
            const direction = { x: -1, y: 0 };

            const bullet = new Bullet(
                bulletX, bulletY,
                5, 5,
                5, direction,
                false
            );
            bullet.image.src = ENEMY_BULLET_IMAGE_SRC; // 使用 ENEMY_BULLET_IMAGE_SRC
            this.bullets.push(bullet);
        }
    }
}
