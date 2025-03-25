import {BULLET_IMAGE_SRC} from "./Config.js"

export class Bullet {
    constructor(x, y, width, height, speed, direction) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = direction;
        this.active = true; // 新增激活状态
        this.image = new Image();
        this.image.src = BULLET_IMAGE_SRC; // 使用 BULLET_IMAGE_SRC
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.drawImage(this.image, this.x, this.y, this.width, this.height); // 使用图像绘制子弹
    }

    update() {
        this.x += this.direction.x * this.speed;
        this.y += this.direction.y * this.speed;
    }

    isOutOfBounds(canvasHeight) {
        return this.y < 0 || this.y > canvasHeight + 50 || !this.active;
    }

    // 碰撞检测方法
    checkCollision(target) {
        return this.active &&
            this.x < target.x + target.width &&
            this.x + this.width > target.x &&
            this.y < target.y + target.height &&
            this.y + this.height > target.y;
    }
}
