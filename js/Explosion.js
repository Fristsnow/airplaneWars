/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-03-25 11:38:56
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-03-25 14:11:34
 * @FilePath: \canvas\Explosion.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {EXPLOSION_IMAGE_SRC} from './Config.js'

export class Explosion {
    constructor(x, y, duration, width, height) {
        this.x = x;
        this.y = y;
        this.duration = duration;
        this.startTime = Date.now(); // 开始时间
        this.images = EXPLOSION_IMAGE_SRC.map(src => {
            const img = new Image();
            img.src = src;
            return img;
        });
        this.width = width; // 爆炸图像的宽度
        this.height = height; // 爆炸图像的高度
    }

    draw(ctx) {
        const elapsed = Date.now() - this.startTime;
        if (elapsed < this.duration) {
            const index = Math.floor(elapsed / (this.duration / this.images.length));
            ctx.drawImage(this.images[index], this.x, this.y, this.width, this.height); // 使用指定的宽度和高度绘制爆炸
        }
    }

    isFinished() {
        return (Date.now() - this.startTime) >= this.duration;
    }
}
