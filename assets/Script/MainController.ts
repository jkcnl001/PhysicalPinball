// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator
import Config from "./Config"
import Ball from "./Ball"
import Barrier from "./Barrier"
import Shake from "./Shake"
@ccclass
export default class MainController extends cc.Component {
    /**障碍物 */
    @property(cc.Prefab)
    prefabBarriers: cc.Prefab[] = []
    barriers: Barrier[] = []

    @property(cc.Prefab)
    prefabBall: cc.Prefab = null
    balls: Ball[] = null

    @property(cc.Label)
    lbScoreCount: cc.Label = null
    @property(cc.Label)
    ballCount: cc.Label = null

    /**开局指引 节点 */
    @property(cc.Node)
    guide: cc.Node = null

    gameStatus: Boolean = true

    /**游戏结束 节点 */
    gameOverMark: cc.Node = null

    /**瞄准线 */
    takeAim: cc.Node = null


    /* 分数*/
    score: number = 0;
    /* 收回小球数 */
    recycleBallsCount: number = 1;
    /* 置障碍物基准率*/
    barrierScoreRate: number = 0
    onLoad() {
        cc.game.setFrameRate(60)
        cc.debug.setDisplayStats(false)
        let physicsManager: cc.PhysicsManager = cc.director.getPhysicsManager()
        /*启用物理世界*/
        physicsManager.enabled = true

        /* 设置重力
          cc.PhysicsManager.PTM_RATIO  像素/米
          重力 -9.8  米/秒的平方
          加速4倍
        */
        physicsManager.gravity = cc.v2(0, -cc.PhysicsManager.PTM_RATIO * 9.8 * 4)

        /*绘制物理调试信息*/
        physicsManager.debugDrawFlags =
            cc.PhysicsManager.DrawBits.e_aabbBit |
            cc.PhysicsManager.DrawBits.e_jointBit |
            cc.PhysicsManager.DrawBits.e_shapeBit

        /*
            设置物理步长
            物理系统是按照一个固定的步长来更新物理世界的，默认这个步长即是你的游戏的帧率：1/framerate
            物理步长，默认 FIXED_TIME_STEP 是 1/60
            每次更新物理系统处理速度的迭代次数，默认 VELOCITY_ITERATIONS  10
            每次更新物理系统处理位置的迭代次数，默认 POSITION_ITERATIONS 10
        */
        physicsManager.enabledAccumulator = true
        cc.PhysicsManager.FIXED_TIME_STEP = 1 / 60
        cc.PhysicsManager.VELOCITY_ITERATIONS = 10
        cc.PhysicsManager.POSITION_ITERATIONS = 10
        this.init()
        this.guideShow()
        this.addBarriers();
    }
    start() {
        /*事件监听*/
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        /* 显示游戏指引 */

    }
    /** 初始化 */
    init() {
        this.score = 0;
        this.recycleBallsCount = 1;
        this.barrierScoreRate = 0;
        this.balls[0]["main"] = this;
        this.balls[0].node.group = Config.groupBallInRecycle;
        this.gameOverMark.active = false;
        this.gameOverMark.zIndex = 10;
        this.guide.zIndex = 10;
        this.guide.active = false;
        this.takeAim["main"] = this;
    }
    onTouchStart(event: cc.Event.EventTouch) {
        this.guideHide();
    }
    onTouchEnd(event: cc.Event.EventTouch) {
        if (!this.isRecycleFinished()) {
            return;
        }
        let graphics = this.node.getChildByName("take-aim").getComponent(cc.Graphics);
        graphics.clear();
        this.recycleBallsCount = 0;
        let touchPos = this.node.convertTouchToNodeSpaceAR(event.touch);
        this.shootBalls(touchPos.sub(cc.v2(0, 420)));
    }
    addBall(pos) {
        let ball = cc.instantiate(this.prefabBall).getComponent(Ball);
        ball.node.parent = this.node;
        ball.node.position = pos;
        ball["main"] = this;
        ball.node.group = Config.groupBallInGame;
        this.balls.push(ball);
        this.setBallCount(this.balls.length);
    }
    /**显示小球总数*/
    setBallCount(num: Number) {
        this.ballCount.string = '小球数：' + num.toString();
    }
    /**连续发射小球 */
    shootBalls(dir: cc.Vec2) {
        if (!this.gameStatus) {
            return;
        }
        for (let i = 0; i < this.balls.length; i++) {
            let ball = this.balls[i];
            this.scheduleOnce(() => {
                this.shootBall(ball, dir);
            }, i * 0.2)
        }
    }
    /**发射单个小球 */
    shootBall(ball: Ball, dir) {
        ball.rigidBody.active = false;
        let pathPos = [];
        pathPos.push(ball.node.position);
        pathPos.push(cc.v2(0, 420));
        ball.node.group = Config.groupBallInGame;
        ball.node.runAction(cc.sequence(
            cc.cardinalSplineTo(0.8, pathPos, 0.5),
            cc.callFunc(function () {
                ball.rigidBody.active = true;
                ball.rigidBody.linearVelocity = dir.mul(3);
            })
        ))
    }
    //收回小球，上移一排障碍物
    recycleBall() {
        this.recycleBallsCount++;
        this.barrierScoreRate += 0.1;
        if (this.isRecycleFinished()) {
            for (let i = 0; i < this.barriers.length; i++) {
                let barrier = this.barriers[i];
                barrier.node.runAction(cc.sequence(
                    cc.moveBy(0.5, cc.v2(0, 100)),
                    cc.callFunc(function () {
                        if (barrier.node.position.y > 200) {
                            barrier.node.runAction(new Shake(1.5, 3, 3));
                        }
                        if (barrier.node.position.y > 300) {
                            this.gameOver();
                        }
                    }.bind(this))
                ))
            }
            this.addBarriers();
        }
    }
    /*小球是否收回完毕*/
    isRecycleFinished() {
        return this.recycleBallsCount == this.balls.length;
    }

    /*添加障碍物*/
    addBarriers() {
        let startPosX = -270;
        let endPosX = 270;
        let currentPosX = startPosX + this.getRandomSpace();
        while (currentPosX < endPosX) {
            let barrier = cc.instantiate(this.prefabBarriers[Math.floor(Math.random() * this.prefabBarriers.length)]).getComponent(Barrier);
            barrier.node.parent = this.node;
            barrier.node.position = cc.v2(currentPosX, -410);
            if (barrier.lbScore) {
                barrier.node.rotation = Math.random() * 360;
            }
            barrier.main = this;
            currentPosX += this.getRandomSpace();
            this.barriers.push(barrier);
        }
    }
    /*抖动障碍物*/
    shake(barrier) {
        let shake = new Shake(0.7, 1, 1);
        barrier.node.runAction(shake);
    }
    /**记分牌显示 */
    addScore() {
        this.score++;
        this.lbScoreCount.string = '分数：' + this.score.toString();
    }

    /**设置 障碍物自身分数值*/
    setBarrierScore() {
        let score = Math.floor(this.randomNum(1 + 2 * this.barrierScoreRate, 5 + 3 * this.barrierScoreRate));
        return score;
    }
    /**消除障碍物 */
    removeBarrier(barrier) {
        let idx = this.barriers.indexOf(barrier);
        if (idx != -1) {
            barrier.node.removeFromParent(false);
            this.barriers.splice(idx, 1);
        }
    }
    /** 获取随机距离，用于生成障碍物的间距 */
    getRandomSpace() {
        return 80 + Math.random() * 200;
    }
    /**获取区间随机值 */
    randomNum(Min: number, Max: number) {
        let Range: number = Max - Min;
        let Rand = Math.random();
        let num = Min + Math.floor(Rand * Range);
        return num;
    }
    /** 显示引导动画 */
    guideShow() {
        this.guide.active = true;
        let handMove: cc.Node = this.guide.getChildByName('handMove');
        let animCtrl: cc.Animation = handMove.getComponent(cc.Animation);
        animCtrl.play('handMove');
    }
    /**关闭引导动画 */
    guideHide() {
        this.guide.active = false;
        let handMove = this.guide.getChildByName('handMove');
        let animCtrl = handMove.getComponent(cc.Animation);
        animCtrl.stop('handMove');
    }
    /**开始游戏 */
    gameStart() {
        cc.director.loadScene("game");
    }
    /**游戏结束 */
    gameOver() {
        this.gameStatus = false;
        this.gameOverMark.active = true;
        this.gameOverMark.getChildByName("score").getComponent(cc.Label).string = "得分：" + this.score.toString();
    }
}
