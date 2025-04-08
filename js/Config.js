/*
 * @Author: FirstsnowLucky firstsnow1119@163.com
 * @Date: 2025-03-19 09:18:32
 * @LastEditors: FirstsnowLucky firstsnow1119@163.com
 * @LastEditTime: 2025-04-08 15:18:27
 * @FilePath: \airplaneWars\js\Config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const BG_IMAGE_SRC = './img/backgrounds/black.jpg';

export const PLAYER_IMAGE_SRC = './img/mine/mine.png';

export const ENEMY_IMAGE_SRC = './img/ships/ship_1.png';

export const BULLET_IMAGE_SRC = './img/playerBullet.png';

export const ENEMY_BULLET_IMAGE_SRC = './img/enemyBullet.png';

export const EXPLOSION_IMAGE_SRC = [
    './img/Explosion1.png',
    './img/Explosion2.png',
    './img/Explosion3.png',
];

export const PLAYER_SKILL_IMAGE_SRC = [
    {
        name: '分身',
        key: 'z',
        width: 70,
        height: 70,
        src: './img/other/1.png'
    },
    {
        name: '子弹强化',
        key: 'r',
        width: 70,
        height: 70,
        src: './img/other/2.png'
    },
    {
        name: '墙壁销毁',
        key: 'q',
        width: 70,
        height: 70,
        src: './img/other/3.png'
    },
    {
        name: '恢复血量',
        key: 'e',
        width: 70,
        height: 70,
        src: './img/other/4.png'
    }
];

export const ENEMY = {
    width: 40,
    height: 40,
    speedX: -3,
    speedY: 0,
    score: 100,
    spriteWidth: 80,
    spriteHeight: 80,
    frames: 4,
    frameDelay: 40
}

export const PLAYER = {
    width: 40,
    height: 40,
    speedX: 0,
    speedY: 0,
    score: 0,
};

export const STATUS_BAR = {
    height: 80,  // 状态栏高度
    waveColor: 'rgba(0, 150, 255, 0.3)',  // 海浪颜色
    avatarSize: 60,  // 头像大小
    avatarSrc: './img/mine/mine.png',  // 玩家头像
    padding: 10  // 内边距
};
