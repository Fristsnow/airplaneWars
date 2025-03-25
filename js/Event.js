/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-03-19 15:26:35
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-03-25 12:23:53
 * @FilePath: \canvas\Event.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {Utils} from "./Utils.js";
import { Explosion } from './Explosion.js';

export class Event {

    constructor() {
        this.utils = new Utils()
        this.explosions = []; // 存储爆炸效果
    }

    handleEnemyCollisionPlayer(player, enemy, flag) {
        if (flag) {
            // 玩家击败敌人，增加分数
            player.score += enemy.score; // 假设 enemy 对象有 score 属性
        } else {
            // 玩家被敌人击中，减少生命值
            player.life -= 1;
            if (player.life <= 0) {
                this.overGame(); // 如果生命值为0，游戏结束
            }
        }
        return {
            life: player.life,
            score: player.score
        };
    }

    overGame() {
        console.log("Game Over");
    }

    /**
     * 处理键盘按下事件
     * @param {KeyboardEvent} e - 键盘事件对象
     * @param {KeyboardEvent} keys - 键盘对象
     * @param {KeyboardEvent} player - 控制玩家
     */
    handleKeyDown(e, keys, player) {
        keys[e.key] = true; // 记录按下的键
        if (e.key === ' ') {
            player.shoot(); // 玩家发射子弹
        }
        this.updatePlayerVelocity(player, keys);
    }

    /**
     * 处理键盘松开事件
     * @param {KeyboardEvent} e - 键盘事件对象
     * @param {KeyboardEvent} keys - 键盘对象
     * @param {KeyboardEvent} player - 控制玩家
     */
    handleKeyUp(e, keys, player) {
        keys[e.key] = false; // 记录松开的键
        this.updatePlayerVelocity(player, keys);
    }

    updatePlayerVelocity(player, keys) {
        const speed = player.speed;
        let vx = 0;
        let vy = 0;

        // 根据按下的键计算速度
        const keyActions = {
            'w': { vx: 0, vy: -speed }, // 上
            'ArrowUp': { vx: 0, vy: -speed }, // 上
            's': { vx: 0, vy: speed }, // 下
            'ArrowDown': { vx: 0, vy: speed }, // 下
            'a': { vx: -speed, vy: 0 }, // 左
            'ArrowLeft': { vx: -speed, vy: 0 }, // 左
            'd': { vx: speed, vy: 0 }, // 右
            'ArrowRight': { vx: speed, vy: 0 }, // 右
        };

        for (const key in keyActions) {
            if (keys[key]) {
                vx += keyActions[key].vx;
                vy += keyActions[key].vy;
            }
        }

        // 如果同时按下两个方向键，则调整速度为对角线方向
        if (vx !== 0 && vy !== 0) {
            const diagonalSpeed = speed / Math.sqrt(2); // 对角线速度
            vx = vx > 0 ? diagonalSpeed : -diagonalSpeed;
            vy = vy > 0 ? diagonalSpeed : -diagonalSpeed;
        }

        // 设置玩家速度
        player.setVelocity(vx, vy);
    }

    checkBulletCollisions(enemies, player) {
        enemies.forEach((enemy, enemyIndex) => {
            player.bullets.forEach((bullet, bulletIndex) => {
                if (bullet.checkCollision(enemy)) {
                    this.handleCollision(player, enemies, enemyIndex, bulletIndex);
                }
            });
        });
    }

    handleCollision(player, enemies, enemyIndex, bulletIndex) {
        // 确保 bulletIndex 和 enemyIndex 是有效的
        if (bulletIndex >= 0 && bulletIndex < player.bullets.length && enemyIndex >= 0 && enemyIndex < enemies.length) {
            // 移除子弹
            player.bullets[bulletIndex].active = false; // 将子弹标记为不活跃

            // 移除敌人
            const enemy = enemies[enemyIndex]; // 获取敌人对象
            enemies.splice(enemyIndex, 1); // 从数组中移除敌人

            // 添加爆炸效果，传递敌人的宽度和高度
            this.createExplosion(
                enemy.x, // 使用敌人的位置
                enemy.y,
                enemy.width, // 传递敌人的宽度
                enemy.height // 传递敌人的高度
            );
        } else {
            console.error("Invalid indices:", { enemyIndex, bulletIndex });
        }
    }

    createExplosion(x, y, width, height) {
        const explosion = new Explosion(x, y, 1000, width, height); // 持续时间为1000毫秒
        this.explosions.push(explosion);
    }

    updateExplosions(ctx) {
        this.explosions.forEach((explosion, index) => {
            explosion.draw(ctx);
            if (explosion.isFinished()) {
                this.explosions.splice(index, 1); // 移除已完成的爆炸效果
            }
        });
    }

    updateEnemies(ctx, canvas, enemies, player) {

        const enemyBullets = (enemy) => {
            enemy.bullets.forEach((bullet, index) => {
                bullet.update();
                bullet.draw(ctx);

                // 检测子弹是否出界
                if (bullet.isOutOfBounds(canvas.width, canvas.height)) {
                    enemy.bullets.splice(index, 1);
                    return
                }

                // 检测子弹是否击中玩家
                if (this.utils.checkCollision(bullet, player)) {
                    enemy.bullets.splice(index, 1);
                    // 玩家受伤逻辑
                    const {life, score} = this.handleEnemyCollisionPlayer(player, enemy, false)
                    console.log(life, score, 'life', 'score')
                    player.life = life <= 0 ? this.overGame() : life;
                    player.scope = score;
                }
            });
        }

        enemies.forEach((enemy, index) => {
            enemy.update();
            enemy.draw(ctx);
            enemyBullets(enemy)

            // 检测敌机是否超出左侧边界
            if (enemy.isOutOfBoundsLeft()) {
                enemies.splice(index, 1);
            }

            if (enemy.checkCollision(player)) {
                this.createExplosion(
                    enemy.x, // 使用敌人的位置
                    enemy.y,
                    enemy.width, // 传递敌人的宽度
                    enemy.height // 传递敌人的高度
                );
                enemies.splice(index, 1);
                const {life, score} = this.handleEnemyCollisionPlayer(player, enemy, true)
                player.life = life <= 0 ? this.overGame() : life;
                player.scope = score;
            }
        })
    }
}
