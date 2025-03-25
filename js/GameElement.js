/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-03-19 15:02:16
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-03-25 12:24:59
 * @FilePath: \canvas\GameElement.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {Bullet} from "./Bullet.js";

export class GameElement {
    constructor(x, y, imageSrc, domConfig) {
        this.x = x;
        this.y = y;
        this.width = domConfig.width;
        this.height = domConfig.height;
        this.speedX = domConfig.speedX || 0;
        this.speedY = domConfig.speedY || 0;
        this.image = new Image();
        this.image.src = imageSrc;
        this.score = domConfig.score;
        this.bullets = [];
        this.lastShotTime = 0;
        this.shotDelay = 100;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        // 绘制子弹
        this.bullets.forEach(bullet => bullet.draw(ctx));
    }

    update(ctx) {
        this.x += this.speedX;
        this.y += this.speedY;

        // 更新子弹
        this.bullets.forEach((bullet, index) => {
            bullet.update();
            if (bullet.isOutOfBounds(ctx.canvas.height)) {
                console.log(`Removing bullet at index ${index}`);
                this.bullets.splice(index, 1);
            }
        });
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastShotTime > this.shotDelay) {
            this.lastShotTime = now;

            const bulletX = this.x + this.width / 2 - 2.5;
            const bulletY = this.y + this.height / 2 - 2.5;

            // 子弹方向向上
            let direction = { x: 1, y: 0 }; // 默认向上发射

            this.bullets.push(new Bullet(
                bulletX, bulletY,
                5, 5,
                5,
                direction
            ));
            return true;
        }
        return false;
    }
    /**
     * 元素的碰撞检测
     * @param other
     * @returns {boolean}
     */
    checkCollision(other) {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }

    /**
     * 检测元素是否超出左侧边界
     * @returns {boolean} - 是否超出左侧边界
     */
    isOutOfBoundsLeft() {
        return this.x + this.width < 0;
    }
}
