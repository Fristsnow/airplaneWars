/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-03-17 14:19:52
 * @LastEditors: FirstsnowLucky firstsnow1119@163.com
 * @LastEditTime: 2025-04-08 17:21:57
 * @FilePath: \canvas\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {Drawer} from "./Drawer.js"
import {Player} from "./Player.js"
import {BG_IMAGE_SRC, PLAYER_IMAGE_SRC, ENEMY} from './Config.js'
import {Event} from './Event.js'
import {Enemy} from "./Enemy.js"
import {Skills} from './Skills.js';
import {StatusBar} from './StatusBar.js'

class Index {
    constructor() {
        this.mainPage = document.querySelector('.main-page');
        this.canvas = document.getElementById("canvas");
        this.startBtn = document.querySelector('.main-btn');
        
        // 绑定开始游戏事件
        this.startBtn.addEventListener('click', () => this.startGame());
        this.ctx = this.canvas.getContext("2d");
        this.drawer = new Drawer(this.ctx);
        this.event = new Event();
        this.backgroundImage = null; // 背景图
        this.player = null; // 玩家
        this.enemies = []; // 敌人
        this.keys = {}; // 记录按键状态
        this.backgroundX = 0; // 添加背景位置追踪
        this.backgroundSpeed = 2; // 背景滚动速度
        this.init();
        this.skills = new Skills(this.ctx);
        this.statusBar = new StatusBar(this.ctx);
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
        const statusBarHeight = 80;
        const skillBarHeight = 70;
        const availableHeight = this.canvas.height - statusBarHeight - skillBarHeight;
        
        // 在有效范围内随机生成敌人的Y坐标
        const y = statusBarHeight + Math.random() * availableHeight;
        
        const enemy = new Enemy(this.canvas.width, y, this.ctx, ENEMY);
        this.enemies.push(enemy);

        // 每隔一段时间创建新的敌机
        setTimeout(() => this.spawnEnemy(), 1000);
    }

    /**
     * 游戏循环
     */
    gameLoop() {
        this.drawer.clearCanvas();
        
        // 更新背景位置
        this.backgroundX -= this.backgroundSpeed;
        
        // 使用单张图片实现无限滚动
        if (this.backgroundImage) {
            // 绘制背景
            this.ctx.drawImage(
                this.backgroundImage, 
                this.backgroundX, 0, 
                this.backgroundImage.width, this.canvas.height
            );
            
            // 绘制第二部分以填充右侧
            this.ctx.drawImage(
                this.backgroundImage, 
                this.backgroundX + this.backgroundImage.width, 0, 
                this.backgroundImage.width, this.canvas.height
            );
            
            // 当第一张图完全移出视野时重置位置
            if (this.backgroundX <= -this.backgroundImage.width) {
                this.backgroundX = 0;
            }
        }

        // 更新和渲染游戏元素
        this.event.renderSkillEffects(this.ctx, this.player);  // 添加这行，传入 player
        this.event.updateEnemies(this.ctx, this.canvas, this.enemies, this.player);
        this.event.updateExplosions(this.ctx);
        
        this.player.update(this.canvas.width, this.canvas.height);
        this.player.draw(this.ctx);

        // 玩家子弹的碰撞事件
        this.event.checkBulletCollisions(this.enemies, this.player);

        // 更新敌人和子弹
        this.event.updateEnemies(this.ctx, this.canvas, this.enemies, this.player);
        this.event.updateExplosions(this.ctx); // 更新爆炸效果

        // 绘制技能图标
        this.skills.draw();
        this.statusBar.draw(this.player)

        // 绘制技能UI
        this.event.drawSkillUI(this.ctx);
        
        // 保存游戏循环的引用到全局
        window.gameLoop = requestAnimationFrame(() => this.gameLoop());
    }

    startGame() {
        this.mainPage.style.display = 'none';
        this.canvas.style.display = 'block';
        this.init();
    }
}

new Index();
