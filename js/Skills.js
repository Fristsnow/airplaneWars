/*
 * @Author: FirstsnowLucky firstsnow1119@163.com
 * @Date: 2025-04-08 15:14:07
 * @LastEditors: FirstsnowLucky firstsnow1119@163.com
 * @LastEditTime: 2025-04-08 15:14:12
 * @FilePath: \airplaneWars\js\Skills.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PLAYER_SKILL_IMAGE_SRC } from './Config.js';

export class Skills {
    constructor(ctx) {
        this.ctx = ctx;
        this.skills = PLAYER_SKILL_IMAGE_SRC;
        this.skillImages = [];
        this.cooldowns = {
            q: { duration: 10000, lastUsed: 0 },
            w: { duration: 15000, lastUsed: 0 },
            e: { duration: 8000, lastUsed: 0 },
            r: { duration: 12000, lastUsed: 0 }
        };
        this.loadImages();
    }

    loadImages() {
        this.skills.forEach(skill => {
            const img = new Image();
            img.src = skill.src;
            this.skillImages.push({
                key: skill.key,
                name: skill.name,
                image: img,
                width: skill.width,
                height: skill.height
            });
        });
    }

    draw() {
        const padding = 10;
        const startX = padding;
        const startY = this.ctx.canvas.height - 110;

        this.skillImages.forEach((skill, index) => {
            const x = startX + (skill.width + padding) * index;
            const y = startY;

            // 绘制技能背景
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(x, y, skill.width, skill.height);

            // 绘制技能图标
            this.ctx.drawImage(skill.image, x, y, skill.width, skill.height);

            // 绘制技能名称
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '14px Arial';
            this.ctx.fillText(skill.name, x + 5, y + skill.height - 5);

            // 绘制按键提示
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.fillText(skill.key.toUpperCase(), x + 5, y + 25);

            // 绘制冷却遮罩
            const cooldown = this.cooldowns[skill.key];
            if (cooldown) {
                const now = Date.now();
                const elapsed = now - cooldown.lastUsed;
                if (elapsed < cooldown.duration) {
                    const progress = elapsed / cooldown.duration;
                    const maskHeight = (1 - progress) * skill.height;
                    
                    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                    this.ctx.fillRect(x, y, skill.width, maskHeight);
                    
                    // 显示剩余冷却时间
                    const remainingSeconds = Math.ceil((cooldown.duration - elapsed) / 1000);
                    this.ctx.fillStyle = '#fff';
                    this.ctx.font = 'bold 24px Arial';
                    this.ctx.fillText(remainingSeconds, x + skill.width/2 - 10, y + skill.height/2);
                }
            }
        });
    }

    triggerCooldown(key) {
        if (this.cooldowns[key]) {
            this.cooldowns[key].lastUsed = Date.now();
        }
    }
}