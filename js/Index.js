/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-03-17 14:19:52
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-03-25 11:16:24
 * @FilePath: \canvas\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {Drawer} from "./Drawer.js"
import {Player} from "./Player.js"
import {BG_IMAGE_SRC, PLAYER_IMAGE_SRC, ENEMY} from './Config.js'
import {Event} from './Event.js'
import {Enemy} from "./Enemy.js"

class Index {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.drawer = new Drawer(this.ctx);
        this.event = new Event();
        this.backgroundImage = null; // 背景图
        this.player = null; // 玩家
        this.enemies = []; // 敌人
        this.keys = {}; // 记录按键状态
        this.init();
    }

    async init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // 加载背景图
        this.backgroundImage = await this.loadImage(BG_IMAGE_SRC);

        // 加载玩家图片并创建玩家实例
        const playerImage = await this.loadImage(PLAYER_IMAGE_SRC);
        this.player = new Player(100, 100, playerImage.src);

        // 创建敌机
        await this.spawnEnemy()

        // 监听键盘事件
        window.addEventListener('keydown', (e) => this.event.handleKeyDown(e, this.keys, this.player));
        window.addEventListener('keyup', (e) => this.event.handleKeyUp(e, this.keys, this.player));

        // 启动游戏循环
        this.gameLoop();
    }

    /**
     * 加载图片
     * @param {string} src - 图片路径
     * @returns {Promise<HTMLImageElement>} - 加载完成的图片
     */
    loadImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
        });
    }

    async spawnEnemy() {
        const y = Math.random() * (this.canvas.height - 40); // 随机Y坐标
        const enemy = new Enemy(this.canvas.width, y, this.ctx, ENEMY); // 确保传递 domConfig
        this.enemies.push(enemy);

        // 每隔一段时间创建新的敌机
        setTimeout(() => this.spawnEnemy(), 1000);
    }

    /**
     * 游戏循环
     */
    gameLoop() {
        this.drawer.clearCanvas();
        if (this.backgroundImage) this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);

        this.player.update(this.canvas.width, this.canvas.height);
        this.player.draw(this.ctx);

        // 玩家子弹的碰撞事件
        this.event.checkBulletCollisions(this.enemies, this.player)

        // 更新敌人和子弹
        this.event.updateEnemies(this.ctx, this.canvas, this.enemies, this.player);
        this.event.updateExplosions(this.ctx); // 更新爆炸效果

        requestAnimationFrame(() => this.gameLoop());
    }
}

new Index();
