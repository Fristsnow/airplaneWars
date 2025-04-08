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
import { ENEMY_IMAGE_SRC, ENEMY_BULLET_IMAGE_SRC, ENEMY } from "./Config.js";

export class Enemy extends GameElement {
    constructor(x, y, ctx, domConfig) {
        super(x, y, ENEMY_IMAGE_SRC, domConfig);
        this.shootDelay = 2000;
        this.lastEnemyShotTime = 0;
        this.ctx = ctx;
        // 添加动画相关属性
        this.currentFrame = 0;
        this.frameTimer = 0;
    }

    draw(ctx) {
        // 计算当前帧的位置
        const frameX = this.currentFrame * ENEMY.spriteWidth;
        
        ctx.drawImage(
            this.image,
            frameX, 0,                    // 精灵图裁剪起点
            ENEMY.spriteWidth, ENEMY.spriteHeight,  // 裁剪尺寸
            this.x, this.y,              // 绘制位置
            this.width, this.height      // 绘制尺寸
        );

        // 绘制子弹
        this.bullets.forEach(bullet => bullet.draw(ctx));
    }

    update() {
        // 更新动画帧
        this.frameTimer++;
        if (this.frameTimer >= ENEMY.frameDelay) {
            this.currentFrame = (this.currentFrame + 1) % ENEMY.frames;
            this.frameTimer = 0;
        }

        super.update(this.ctx);
        this.shoot();
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastEnemyShotTime > this.shootDelay) {
            this.lastEnemyShotTime = now;

            const bulletX = this.x + this.width / 2 - 2.5;
            const bulletY = this.y + this.height;

            // 子弹方向向左
            const direction = { x: -1, y: 0 };

            const bullet = new Bullet(
                bulletX, bulletY,
                5, 5,
                5, direction,
                false
            );
            bullet.image.src = ENEMY_BULLET_IMAGE_SRC;
            this.bullets.push(bullet);
        }
    }
}
