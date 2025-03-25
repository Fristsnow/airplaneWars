/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-03-17 14:27:48
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-03-17 14:52:19
 * @FilePath: \canvas\Drawer.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export class Drawer {
    constructor(ctx) {
        this.ctx = ctx
    }

    clearCanvas() {
        const { width, height } = this.ctx.canvas;
        this.ctx.clearRect(0, 0, width, height);
    }

    drawImage(src, x, y, width, height) {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            width && height ? this.ctx.drawImage(img, x, y, width, height) : this.ctx.drawImage(img, x, y)
        };
    }
}
