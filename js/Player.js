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
        this.image.src = PLAYER_IMAGE_SRC;
        this.angle = 0;
        this.life = 3;
        this.energy = 100; // 初始能量值
        this.score = 0;  // 初始化积分
        this.bullets = []; // 玩家子弹数组
        this.shotDelay = 300; // 射击冷却时间(ms)
        this.event = new Event();
        this.topBoundary = 80;  // 状态栏高度
        this.bottomBoundary = window.innerHeight - 100;  // 技能栏高度
        this.y = Math.min(Math.max(y, this.topBoundary), this.bottomBoundary - this.height);
        this.bulletEnhanced = false;  // 添加这行
        this.bulletColumns = 1;
        this.bulletSpread = 0;
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
    
            // 计算子弹的基础位置（从飞机前端发射）
            const bulletX = this.x + this.width;
            const bulletY = this.y + this.height / 2;
            const direction = { x: 1, y: 0 };
    
            // 根据强化状态决定发射的子弹数量和属性
            const columns = this.bulletEnhanced ? 5 : 1;
            const spread = this.bulletEnhanced ? 30 : 0;
            const bulletWidth = this.bulletEnhanced ? 20 : 5;
            const bulletSpeed = this.bulletEnhanced ? 10 : 5;
    
            // 计算多列子弹的位置
            for (let i = 0; i < columns; i++) {
                const offsetY = (i - (columns - 1) / 2) * spread;
                const bullet = new Bullet(
                    bulletX,
                    bulletY + offsetY,
                    bulletWidth,
                    5,
                    bulletSpeed,
                    direction
                );
                bullet.active = true;  // 确保子弹是激活状态
                this.bullets.push(bullet);
            }
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
    
        // 边缘检测，包括状态栏和技能栏限制
        this.x = Math.max(0, Math.min(canvasWidth - this.width, this.x));
        this.y = Math.max(this.topBoundary, Math.min(this.bottomBoundary - this.height, this.y));
    
        // 更新子弹 - 使用 for 循环从后向前遍历
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.update();
            if (bullet.isOutOfBounds(canvasHeight)) {
                this.bullets.splice(i, 1);
            }
        }
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
