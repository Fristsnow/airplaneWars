import { STATUS_BAR } from './Config.js';

export class StatusBar {
    constructor(ctx) {
        this.ctx = ctx;
        this.waveOffset = 0;
        this.avatar = new Image();
        this.avatar.src = STATUS_BAR.avatarSrc;
    }

    draw(player) {
        const { width } = this.ctx.canvas;
        const { height, waveColor, avatarSize, padding } = STATUS_BAR;

        // 绘制波浪背景
        this.ctx.fillStyle = waveColor;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        
        // 创建波浪效果
        for (let x = 0; x <= width; x += 50) {
            const y = Math.sin((x + this.waveOffset) / 50) * 10 + height;
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.lineTo(width, 0);
        this.ctx.closePath();
        this.ctx.fill();

        // 更新波浪动画
        this.waveOffset += 2;
        if (this.waveOffset > 1000) this.waveOffset = 0;

        // 绘制头像
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(padding + avatarSize/2, height/2, avatarSize/2, 0, Math.PI * 2);
        this.ctx.clip();
        this.ctx.drawImage(this.avatar, padding, height/2 - avatarSize/2, avatarSize, avatarSize);
        this.ctx.restore();

        // 绘制状态信息
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '18px Arial';
        const startX = padding * 2 + avatarSize;
        
        // 生命值
        this.ctx.fillText(`生命: ${player.life}`, startX, height/2 - 10);
        
        // 能量条
        const energyWidth = 150;
        const energyHeight = 15;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(startX, height/2 + 5, energyWidth, energyHeight);
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(startX, height/2 + 5, energyWidth * (player.energy / 100), energyHeight);

        // 积分
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText(`积分: ${player.score}`, width - 150, height/2);
    }
}