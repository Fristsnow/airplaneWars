/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-03-19 15:26:35
 * @LastEditors: FirstsnowLucky firstsnow1119@163.com
 * @LastEditTime: 2025-04-08 17:32:35
 * @FilePath: \canvas\Event.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Utils } from "./Utils.js";
import { Explosion } from './Explosion.js';
import { Bullet } from './Bullet.js';  // 添加这行

export class Event {

    constructor() {
        this.utils = new Utils()
        this.explosions = []; // 存储爆炸效果
        this.skills = {
            q: { cooldown: 0, lastUsed: 0, name: '墙壁销毁', progress: 0 },
            z: { cooldown: 0, lastUsed: 0, name: '分身', progress: 0 },
            e: { cooldown: 0, lastUsed: 0, name: '恢复血量', progress: 0 },
            r: { cooldown: 0, lastUsed: 0, name: '子弹强化', progress: 0 }
        };
        this.clones = [];
        this.walls = [];
        this.gameLoop = null; // 添加游戏循环引用
    }

    handleEnemyCollisionPlayer(player, enemy, flag) {
        if (flag) {
            // 玩家击败敌人，增加分数
            player.score += enemy.score;
        } else {
            // 玩家被敌人击中，减少生命值
            player.life -= 1;
            if (player.life <= 0) {
                this.overGame(player); // 如果生命值为0，游戏结束
            }
        }
        return {
            life: player.life,
            score: player.score
        };
    }

    overGame(player) {
        // 停止游戏循环
        if (window.gameLoop) {
            cancelAnimationFrame(window.gameLoop);
            window.gameLoop = null;
        }
    
        const gameOverScreen = document.querySelector('.game-over');
        const finalScoreSpan = document.querySelector('.final-score');
        const playerNameInput = document.getElementById('player-name');
        const submitButton = document.querySelector('.submit-score');
        const leaderboardScreen = document.querySelector('.leaderboard');
        const scoresList = document.querySelector('.scores-list');
        const restartButton = document.querySelector('.restart-game');
    
        // 显示游戏结束界面
        gameOverScreen.style.display = 'flex';
        finalScoreSpan.textContent = player.score;
    
        // 处理提交分数
        submitButton.onclick = () => {
            const playerName = playerNameInput.value.trim();
            if (playerName) {
                this.saveScore(playerName, player.score);
                gameOverScreen.style.display = 'none';
                this.showLeaderboard();
                
                // 确保游戏循环被销毁
                if (window.gameLoop) {
                    cancelAnimationFrame(window.gameLoop);
                    window.gameLoop = null;
                }
            }
        };
    
        // 处理重新开始游戏
        restartButton.onclick = () => {
            leaderboardScreen.style.display = 'none';
            location.reload();
        };
    }

    saveScore(name, score) {
        // 获取现有分数
        let scores = JSON.parse(localStorage.getItem('gameScores')) || [];
        
        // 添加新分数
        scores.push({ name, score, date: new Date().toISOString() });
        
        // 按分数排序
        scores.sort((a, b) => b.score - a.score);
        
        // 只保留前10名
        scores = scores.slice(0, 10);
        
        // 保存到本地存储
        localStorage.setItem('gameScores', JSON.stringify(scores));
    }

    showLeaderboard() {
        const leaderboardScreen = document.querySelector('.leaderboard');
        const scoresList = document.querySelector('.scores-list');
        const canvas = document.querySelector('#canvas');
        
        // 获取分数
        const scores = JSON.parse(localStorage.getItem('gameScores')) || [];
        
        // 清空现有列表
        scoresList.innerHTML = '';
        
        // 添加分数项
        scores.forEach((score, index) => {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'score-item';
            scoreItem.innerHTML = `
                <span class="score-rank">#${index + 1}</span>
                <span class="score-name">${score.name}</span>
                <span class="score-value">${score.score}</span>
            `;
            scoresList.appendChild(scoreItem);
        });
        
        // 隐藏 canvas
        canvas.style.display = 'none';
        
        // 显示排行榜并添加动画类
        leaderboardScreen.style.display = 'flex';
        setTimeout(() => {
            leaderboardScreen.classList.add('show');
        }, 10);
    }

    /**
     * 处理键盘按下事件
     * @param {KeyboardEvent} e - 键盘事件对象
     * @param {KeyboardEvent} keys - 键盘对象
     * @param {KeyboardEvent} player - 控制玩家
     */
    handleKeyDown(e, keys, player) {
        keys[e.key] = true;
        
        // 处理技能按键
        if (['q', 'z', 'e', 'r'].includes(e.key.toLowerCase())) {
            this.handleSkill(e.key.toLowerCase(), player);
        }
        
        // 处理移动和射击
        this.updatePlayerVelocity(player, keys);
        this.updateShooting(player, keys);
    }

    handleKeyUp(e, keys, player) {
        keys[e.key] = false;
        this.updatePlayerVelocity(player, keys);
    }

    // 新增射击更新方法
    updateShooting(player, keys) {
        if (keys[' ']) {
            player.shoot();
        }
    }

    handleSkill(key, player) {
        const now = Date.now();
        const skill = this.skills[key];

        if (skill && now - skill.lastUsed >= skill.cooldown) {
            skill.lastUsed = now;
            skill.progress = 1; // 设置冷却进度

            switch (key) {
                case 'q':
                    this.createWall(player);
                    break;
                case 'z':
                    this.createClone(player);
                    break;
                case 'e':
                    this.heal(player);
                    break;
                case 'r':
                    this.enhanceBullets(player);
                    break;
            }
        }
    }

    // 添加技能UI渲染方法
    drawSkillUI(ctx) {
        const padding = 10;
        const skillSize = 50;
        const startY = ctx.canvas.height - skillSize - padding;

        Object.entries(this.skills).forEach(([key, skill], index) => {
            const startX = padding + (skillSize + padding) * index;

            // 绘制技能背景
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(startX, startY, skillSize, skillSize);

            // 绘制冷却遮罩
            const now = Date.now();
            const elapsed = now - skill.lastUsed;
            const progress = Math.min(elapsed / skill.cooldown, 1);
            skill.progress = 1 - progress;

            if (skill.progress > 0) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(startX, startY, skillSize, skillSize * skill.progress);

                // 显示剩余冷却时间
                if (skill.progress < 1) {
                    ctx.fillStyle = '#fff';
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    const remainingSeconds = Math.ceil((skill.cooldown - elapsed) / 1000);
                    ctx.fillText(remainingSeconds, startX + skillSize / 2, startY + skillSize / 2);
                }
            }

            // 绘制技能按键
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(key.toUpperCase(), startX + 5, startY + 25);

            // 绘制技能名称
            ctx.font = '12px Arial';
            ctx.fillText(skill.name, startX + 5, startY + skillSize - 5);
        });
    }

    enhanceBullets(player) {
        player.bulletEnhanced = true;
        player.bulletColumns = 5;  // 设置子弹列数
        player.bulletSpread = 20;  // 子弹之间的间距

        setTimeout(() => {
            player.bulletEnhanced = false;
            player.bulletColumns = 1;  // 恢复默认列数
            player.bulletSpread = 0;   // 恢复默认间距
        }, 20000); // 持续20秒
    }

    createWall(player) {
        this.walls.push({
            x: 0,
            y: 80,
            width: 20,
            height: window.innerHeight - 150,
            speed: 5
        });
    }

    createClone(player) {
        // 上方分身
        const clone1 = {
            x: player.x,
            y: player.y - 60,
            width: player.width,
            height: player.height,
            image: player.image,
            created: Date.now(),
            duration: 8000,  // 增加持续时间
            offset: -60,
            lastShot: 0,
            shootDelay: 100  // 减少射击间隔
        };

        // 下方分身
        const clone2 = {
            x: player.x,
            y: player.y + 60,
            width: player.width,
            height: player.height,
            image: player.image,
            created: Date.now(),
            duration: 8000,  // 增加持续时间
            offset: 60,
            lastShot: 0,
            shootDelay: 100  // 减少射击间隔
        };

        this.clones.push(clone1, clone2);
    }

    renderSkillEffects(ctx, player) {
        // 先渲染墙壁
        this.walls = this.walls.filter(wall => {
            wall.x += wall.speed;
            ctx.fillStyle = 'rgba(0, 150, 255, 0.6)';
            ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
            return wall.x < ctx.canvas.width;
        });

        // 渲染分身
        this.clones = this.clones.filter(clone => {
            const now = Date.now();
            if (now - clone.created < clone.duration) {
                clone.x = player.x;
                clone.y = player.y + clone.offset;

                // 分身自动射击
                if (now - clone.lastShot > clone.shootDelay) {
                    clone.lastShot = now;
                    const bullet = new Bullet(
                        clone.x + clone.width,  // x位置
                        clone.y + clone.height / 2,  // y位置
                        35,  // 宽度
                        5,   // 高度
                        20,  // 速度
                        { x: 1, y: 0 }  // 向右射击的方向
                    );
                    player.bullets.push(bullet);
                }

                ctx.save();
                ctx.globalAlpha = 0.5;
                ctx.drawImage(clone.image, clone.x, clone.y, clone.width, clone.height);
                ctx.restore();
                return true;
            }
            return false;
        });
    }

    heal(player) {
        player.life = Math.min(6, player.life + 1);
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
        // 从后向前遍历敌人数组
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            // 从后向前遍历子弹数组
            for (let j = player.bullets.length - 1; j >= 0; j--) {
                const bullet = player.bullets[j];
                if (bullet.checkCollision(enemy)) {
                    // 移除子弹
                    bullet.active = false;
                    player.bullets.splice(j, 1);

                    // 移除敌人并创建爆炸效果
                    this.createExplosion(enemy.x, enemy.y, enemy.width, enemy.height);
                    enemies.splice(i, 1);
                    player.score += enemy.score;
                    break; // 一个敌人被击中后就跳出内层循环
                }
            }
        }
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
                this.explosions.splice(index, 1);
            }
        });
    }

    updateEnemies(ctx, canvas, enemies, player) {
        this.walls.forEach(wall => {
            enemies.forEach((enemy, index) => {
                if (enemy.x < wall.x + wall.width &&
                    enemy.x + enemy.width > wall.x &&
                    enemy.y < wall.y + wall.height &&
                    enemy.y + enemy.height > wall.y) {
                    // 敌人碰到墙壁时被消灭
                    this.createExplosion(enemy.x, enemy.y, enemy.width, enemy.height);
                    enemies.splice(index, 1);
                    player.score += enemy.score;
                }
            });
        });

        const enemyBullets = (enemy) => {
            enemy.bullets.forEach((bullet, index) => {
                bullet.update();
                bullet.draw(ctx);

                // 检测子弹是否出界
                if (bullet.isOutOfBounds(canvas.width, canvas.height)) {
                    enemy.bullets.splice(index, 1);
                    return;
                }

                // 检测子弹是否击中玩家
                if (this.utils.checkCollision(bullet, player)) {
                    enemy.bullets.splice(index, 1);
                    // 玩家受伤逻辑
                    const { life, score } = this.handleEnemyCollisionPlayer(player, enemy, false);
                    if (life <= 0) {
                        this.overGame(player);
                        return;
                    }
                    player.life = life;
                    player.score = score;
                }
            });
        };

        enemies.forEach((enemy, index) => {
            enemy.update();
            enemy.draw(ctx);
            enemyBullets(enemy);

            // 检测敌机是否超出左侧边界
            if (enemy.isOutOfBoundsLeft()) {
                enemies.splice(index, 1);
                return;
            }

            if (enemy.checkCollision(player)) {
                this.createExplosion(enemy.x, enemy.y, enemy.width, enemy.height);
                enemies.splice(index, 1);
                const { life, score } = this.handleEnemyCollisionPlayer(player, enemy, false);
                if (life <= 0) {
                    this.overGame(player);
                    return;
                }
                player.life = life;
                player.score = score;
            }
        });
    }
}
