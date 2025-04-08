import {Bullet} from './Bullet.js'
import {Event} from "./Event.js";
import { GameElement } from "./GameElement.js";
import {PLAYER, PLAYER_IMAGE_SRC} from "./Config.js";

export class Player extends GameElement {
    constructor(x, y) {
        super(x, y, PLAYER_IMAGE_SRC, PLAYER);
        this.delay = 100; // 发射子弹的延迟
        this.lastShotTime = 0; // 记录上次发射时间
        this.speed = 5; // 固定速度为5
        this.vx = 0; // 水平速度
        this.vy = 0; // 垂直速度
        this.image = new Image();
        this.image.src = PLAYER_IMAGE_SRC; // 玩家的图片
        this.angle = 0;
        this.life = 3;
        this.bullets = []; // 玩家子弹数组
        this.shotDelay = 300; // 射击冷却时间(ms)
        this.event = new Event();
    }

    /**
     * 绘制玩家
     * @param {CanvasRenderingContext2D} ctx - Canvas的2D上下文
     */
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, -this.height / 2, -this.width / 2, this.height * 2, this.width);
        ctx.restore();

        // 绘制子弹
        this.bullets.forEach(bullet => bullet.draw(ctx));
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastShotTime > this.delay) {
            this.lastShotTime = now;

            // 确保子弹从玩家的中心发射
            const bulletX = this.x + this.width / 2 - 2.5; // 计算子弹的X坐标
            const bulletY = this.y + this.height / 2 - 2.5; // 计算子弹的Y坐标

            // 子弹方向向上
            const direction = { x: 1, y: 0 }; // 向右发射

            this.bullets.push(new Bullet(
                bulletX, bulletY,
                5, 5,
                5, direction,
            ));
            return true;
        }
        return false;
    }

    /**
     * 更新玩家位置
     */
    update(canvasWidth, canvasHeight) {
        this.x += this.vx;
        this.y += this.vy;

        // 边缘检测
        this.x = Math.max(0, Math.min(canvasWidth - this.width, this.x));
        this.y = Math.max(0, Math.min(canvasHeight - this.height, this.y));

        // 更新子弹
        this.bullets.forEach((bullet, index) => {
            bullet.update();
            if (bullet.isOutOfBounds(canvasHeight)) {
                this.bullets.splice(index, 1);
            }
        });
    }

    /**
     * 设置玩家速度
     * @param {number} vx - 水平速度
     * @param {number} vy - 垂直速度
     */
    setVelocity(vx, vy) {
        this.vx = vx;
        this.vy = vy;
    }

}
