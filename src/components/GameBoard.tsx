'use client';

import { useEffect, useState } from 'react';
import { f, fixed, rf, getColor } from '@/utils/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
// import { coinImg } from 'app/config/const';

const rocketImageCount = 180;
const crashImageCount = 30;
const rocketImages: HTMLImageElement[] = [];
const crashImages: HTMLImageElement[] = [];

const PRIMARY_COLOR = '#6D6D8F';
const BACKGROUND_COLOR = 'rgb(23, 22, 73)';

let width = 800;
let height = 600;
let GAP = 60;
let ORG_X = GAP;
let ORG_Y = height - GAP;
let STAGE_WIDTH = width - GAP * 3;
let STAGE_HEIGHT = height - GAP * 2;
let rate = 1;
let histories: any[] = [];
let _players: any[] = [];
let _state = 0;
let _mywin = 0;
let _cnt = 0;

let timeElapsed: number, crashTimeElapsed: number, isRising: boolean | null, ctx: any;
let imageParachute: any, WinImages: any;

if (typeof window !== 'undefined') {
  imageParachute = new Image();
  imageParachute.src = 'images/parachute.png';

  WinImages = new Image();
  WinImages.src = 'images/cashout.png';
}

const loadImage = async (i: number): Promise<HTMLImageElement> => {
  return new Promise<HTMLImageElement>((resolve) => {
    if (typeof window === 'undefined') return;
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = `images/rocket/${String(i).padStart(4, '0')}.png`;
  });
};

const loadImage1 = async (i: number): Promise<HTMLImageElement> => {
  return new Promise<HTMLImageElement>((resolve) => {
    if (typeof window === 'undefined') return;
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = `images/crash/${String(i).padStart(4, '0')}.png`;
  });
};

const importImages = async () => {
  for (let i = 1; i <= rocketImageCount; i++) rocketImages.push(await loadImage(i));
  for (let i = 0; i < crashImageCount; i++) crashImages.push(await loadImage1(i * 4));
};

importImages();

const drawText = (
  content: string,
  x: number,
  y: number,
  color: string,
  fontSize: string,
  align = 'left'
) => {
  ctx.font = fontSize + (fontSize.includes('Passion One') ? '' : ' Montserrat'); // Montserrat
  ctx.textAlign = align;
  ctx.fillStyle = color;
  ctx.fillText(content, x, y);
  let metrics = ctx.measureText(content);
  return {
    width: metrics.width,
    height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
  };
};

const drawAxis = (W: number, H: number) => {
  ctx.save();
  ctx.beginPath();
  let xInterval = 2;
  let yInterval = 0.5;

  if (W > 10) xInterval = 5;
  if (W > 25) xInterval = 10;
  if (W > 50) xInterval = 25;
  if (W > 100) xInterval = 50;
  if (W > 250) xInterval = 100;
  if (W > 500) xInterval = 205;

  if (H < 2.5) yInterval = 1;
  else {
    let base = 1;
    while (base * 10 <= H) base *= 10;
    if (base * 2.5 >= H) yInterval = base / 2;
    else yInterval = base;
  }
  var rt: any;
  for (let x = 0; x <= W; x += xInterval) {
    let xPos = ORG_X + (STAGE_WIDTH / W) * x;
    let yPos = ORG_Y;
    rt = drawText(
      x.toString() + 's',
      xPos,
      yPos,
      PRIMARY_COLOR,
      `15px 'Roboto'`,
      x ? 'center' : 'left'
    );
  }

  for (let y = 0; y <= H; y += yInterval) {
    let xPos = ORG_X;
    let yPos = ORG_Y - (STAGE_HEIGHT / H) * y - 8;
    if (y) drawText(y + 'x', xPos - 1, yPos, PRIMARY_COLOR, `20px 'Roboto'`, 'left');
  }

  ctx.restore();
};

const drawRocket = (W: number, H: number) => {
  const time = Math.max(timeElapsed - 5, 0);
  const D = 30 * rate;
  const curX = ORG_X + (STAGE_WIDTH / W) * time + D;
  const curY = ORG_Y - (f(time) / H) * STAGE_HEIGHT - D;
  const imgWidth = 200 * rate;
  const imgHeight = 200 * rate;
  const delta = 0.1;
  let ang = Math.atan2(
    ((f(time - delta) - f(time)) / H) * (width > 384 ? 1 : 2),
    delta / W / (time / 5 ? 0.5 : 1)
  );
  ctx.save();
  ctx.translate(curX, curY);
  ctx.rotate(ang);
  if (rocketImages.length)
    ctx.drawImage(
      rocketImages[
        rocketImages.length !== rocketImageCount
          ? 0
          : parseInt((time * 50).toString()) % rocketImageCount
      ],
      -imgWidth / 4,
      -imgHeight / 2,
      imgWidth,
      imgHeight
    );
  ctx.restore();
};

const drawGraph = (W: number, H: number) => {
  const time = Math.max(timeElapsed - 5, 0);
  const D = 30 * rate;
  const SEG = Math.min(time * 100, 1000);

  const pureGraph = () => {
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.moveTo(ORG_X + D, ORG_Y - D - STAGE_HEIGHT / H);
    for (let i = 0; i <= SEG; i++) {
      let x = (time / SEG) * i;
      let curX = ORG_X + (STAGE_WIDTH / W) * x;
      let curY = ORG_Y - (f(x) / H) * STAGE_HEIGHT;
      ctx.lineTo(curX + D, curY - D);
    }
  };

  const drawGradientFill = () => {
    ctx.save();
    pureGraph();
    const xx = (time / W) * STAGE_WIDTH;
    const yy = (f(time) / H) * STAGE_HEIGHT;
    const radFillGrad = ctx.createRadialGradient(
      ORG_X + D,
      ORG_Y - D,
      0,
      ORG_X + D,
      ORG_Y - D,
      Math.hypot(xx, yy)
    );
    radFillGrad.addColorStop(0, '#292938');
    radFillGrad.addColorStop(0.5, '#4A70FF');
    radFillGrad.addColorStop(1, '#AD19C6');
    const edx = ORG_X + D + xx;
    const sty = ORG_Y - D;
    ctx.lineTo(edx, sty);
    ctx.lineTo(ORG_X + D, sty);
    ctx.fillStyle = radFillGrad;
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.restore();
  };

  const drawGraphLine = () => {
    ctx.save();
    pureGraph();
    const xx = (time / W) * STAGE_WIDTH;
    const yy = (f(time) / H) * STAGE_HEIGHT;
    const radGrad = ctx.createRadialGradient(ORG_X, ORG_Y, 0, ORG_X, ORG_Y, Math.hypot(xx, yy));
    radGrad.addColorStop(0, '#61B0D0');
    radGrad.addColorStop(0.5, '#4A70FF');
    radGrad.addColorStop(1, '#AD19C6');
    ctx.lineWidth = 3;
    ctx.strokeStyle = radGrad;
    ctx.shadowColor = '#111111';
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 3;
    ctx.stroke();
    ctx.restore();
  };

  const drawSmoothBackground = () => {
    ctx.save();
    ctx.fillStyle = 'rgb(22, 23, 73)';
    ctx.filter = 'blur(20px)';
    ctx.fillRect(0, ORG_Y - 50, width, 100);
    ctx.restore();
  };

  drawGradientFill();
  drawGraphLine();
  drawSmoothBackground();
};

const drawCrash = (W: number, H: number) => {
  const time = Math.max(timeElapsed - 5, 0);
  const D = 30 * rate;
  const curX = ORG_X + (STAGE_WIDTH / W) * time + D;
  const curY = ORG_Y - (f(time) / H) * STAGE_HEIGHT - D;
  const imgWidth = 300 * rate;
  const imgHeight = 300 * rate;
  ctx.save();
  ctx.translate(curX, curY);
  if (crashImages.length === crashImageCount)
    ctx.drawImage(
      crashImages[Math.floor(Math.min(116, crashTimeElapsed) / 4)],
      -imgWidth / 2,
      -imgHeight / 2,
      imgWidth,
      imgHeight
    );
  ctx.restore();
};

const drawBackground = () => {
  ctx.save();
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
};

const drawStatusText = () => {
  const time = Math.max(timeElapsed - 5, 0);
  ctx.save();

  let content = fixed(f(time), 2).toFixed(2) + 'x';
  let fontSize = width > 720 ? 72 : 48;
  let textAlign = width > 384 ? 'center' : 'left';
  let textX = width > 384 ? width / 2 : ORG_X + 40;
  let textY = height / 3 + 20;

  if (timeElapsed < 5) {
    content = (5 - Math.floor(timeElapsed)).toString();
    ctx.globalAlpha = 1 - (timeElapsed - Math.floor(timeElapsed));
    fontSize *= 1 + ctx.globalAlpha;
  }

  drawText(
    content,
    textX,
    textY,
    isRising ? '#F5F5FA' : '#FF3300',
    `${fontSize}px 'Passion One'`,
    textAlign
  );

  if (!isRising) {
    drawText(
      'Round Over',
      textX,
      textY - fontSize / 2 - 10,
      isRising ? '#F5F5FA' : '#FF3300',
      `${fontSize / 3}px 'Passion One'`,
      textAlign
    );
  }
  ctx.restore();
};

const drawPlayers = (players: IPlayer[], W: number, H: number) => {
  const D = 30 * rate;
  const imgWidth = 50 * rate;
  const imgHeight = 50 * rate;
  for (let i = 0; i < players.length; i++) {
    if (players[i].cashPoint < 1) continue;
    const time = rf(players[i].cashPoint);
    if (timeElapsed - time > 2) continue;
    const rt = (30 - (timeElapsed - time) / 0.2) / 30;
    const curX = ORG_X + (STAGE_WIDTH / W) * time + D;
    const curY = ORG_Y - (players[i].cashPoint / H) * STAGE_HEIGHT - D;
    ctx.save();
    ctx.translate(curX, curY + (imgHeight * (timeElapsed - time)) / 0.1 / 30);
    ctx.globalAlpha = 1 - (20 - (timeElapsed - time) / 0.1) / 40;
    ctx.fillStyle = '#fff';
    ctx.ellipse(
      (-imgWidth * rt) / 2,
      (-imgHeight * rt) / 2,
      imgWidth * rt,
      imgHeight * rt,
      Math.PI / 4,
      0,
      2 * Math.PI
    );
    drawText(players[i].name, (imgWidth * rt) / 2 + 4, 6, '#6D6D8F', `${12}px`, 'left');
    ctx.restore();
  }
};

const drawHistory = (histories: any[]) => {
  const cnt = Math.min(10, Math.floor((width - GAP * 2) / 60));
  const grid = (width - GAP * 2 + 4) / cnt;
  if (histories.length > cnt) {
    histories.splice(0, histories.length - cnt);
  }

  histories.forEach((bet, index) => {
    const x = GAP + grid * index + grid / 2;
    const y = width > 540 ? GAP : width > 384 ? GAP * 1.5 : GAP * 2;
    ctx.strokeStyle = getColor(bet.crashPoint);
    ctx.beginPath();
    ctx.roundRect(x - 28, y - 12 * 1.4, 56, 12 * 2, [5]);
    ctx.stroke();
    drawText(
      bet.crashPoint.toFixed(2) + 'x',
      x,
      y,
      getColor(bet.crashPoint),
      `20px 'Roboto'`,
      'center'
    );
  });
};

const draw = () => {
  const time = Math.max(timeElapsed - 5, 0);
  ctx.clearRect(0, 0, width, height);
  let W = Math.max(18, time * 1.1);
  let H = Math.max(4, f(time) * 1.3);

  drawBackground();
  drawStatusText();
  drawHistory(histories);

  if (isRising) {
    drawGraph(W, H);
    drawPlayers(_players, W, H);
    drawRocket(W, H);
  } else {
    drawCrash(W, H);
  }
  drawAxis(W, H);

  if (_mywin > 0) {
    const ratio = Math.min(3, _cnt);
    let rate = width / 800;
    if (width < 800) rate *= 1.2;
    if (width < 400) rate *= 1.5;
    const imgWidth = ((Math.pow(ratio, 0.3) * 400) / Math.pow(3, 0.3)) * rate;
    const imgHeight = ((Math.pow(ratio, 0.3) * 266) / Math.pow(3, 0.3)) * rate;
    ctx.drawImage(
      WinImages,
      width / 2 - imgWidth / 2,
      height / 2 - imgHeight / 2,
      imgWidth,
      imgHeight
    );
    if (_cnt > 3) {
      ctx.save();
      ctx.translate(width / 2, height / 2);
      const content = '+' + _mywin.toFixed(3);
      let posX = 0;
      let posY = STAGE_HEIGHT / (width > 384 ? 4 : width < 768 ? 3.5 : 4.5);
      const fontSize = `${width > 540 ? 48 : 36}px`;
      ctx.font = fontSize + ' Passion One';
      ctx.textAlign = 'center';

      let metrics = ctx.measureText(content);
      let textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      let linearGrad = ctx.createLinearGradient(0, posY - textHeight, 0, posY);
      linearGrad.addColorStop(0.3, '#FFFFFF');
      linearGrad.addColorStop(0.7, '#FF9900');
      ctx.fillStyle = linearGrad;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#FF9900';
      ctx.fillText(content, posX, posY);
      ctx.restore();
    }
    _cnt++;
    if (_cnt === 20) _mywin = 0;
  }
};

interface GameBoardProps {
  players: any;
  history: any;
  mywin: any;
  refer: any;
}

const GameBoard = ({ players, history, mywin, refer }: GameBoardProps) => {
  const [state, setState] = useState(0);

  const gameState = useSelector((state: RootState) => state.gameState.gameState);

  useEffect(() => {
    _mywin = mywin;
    _cnt = 0;
  }, [mywin]);

  useEffect(() => {
    if (gameState.isRising === null) return;

    const updateCanvas = () => {
      const canvas = refer.current;
      if (!canvas) return;

      ctx = canvas.getContext('2d');
      const parentWidth = canvas.parentElement.offsetWidth;
      width = parentWidth;
      height = ((parentWidth * 480) / 720) * (parentWidth > 384 ? 1 : 2);
      rate = (parentWidth / 1440) * (parentWidth > 384 ? 1 : 2);
      GAP = (60 * parentWidth) / 1440;
      ORG_X = GAP;
      ORG_Y = height - GAP * 0.8;
      STAGE_WIDTH = width - GAP * (parentWidth > 384 ? 2 : 4);
      STAGE_HEIGHT = height - GAP * (parentWidth > 540 ? 3 : parentWidth > 384 ? 4 : 5);

      draw();
    };

    updateCanvas();

    isRising = gameState.isRising;
    timeElapsed = gameState.timeElapsed;
    crashTimeElapsed = gameState.crashTimeElapsed;

    const interval = setInterval(() => {
      setState((prevState) => prevState + 1);
      if (isRising) {
        timeElapsed += 0.1;
      } else {
        crashTimeElapsed = Math.min(116, crashTimeElapsed + 4);
      }
      updateCanvas();
    }, 100);

    return () => clearInterval(interval);
  }, [gameState.isRising, gameState.crashTimeElapsed, refer, gameState.timeElapsed]);

  useEffect(() => {
    if (Math.abs(timeElapsed - gameState.timeElapsed) > 0.25) timeElapsed = gameState.timeElapsed;
  }, [gameState.timeElapsed]);

  histories = history.map((bet: any) => bet).reverse();
  _players = players;

  return (
    <div className='relative'>
      {/* <div className="blur"></div>
      <div className="blur2"></div> */}
      <div className='lg:hidden text-white flex justify-between mb-2 p-2 bg-[#6D6D8F] rounded-md'>
        <p>
          {players.filter((player: any) => player.cashPoint > 0).length}/{players.length} Players
        </p>
      </div>
      <canvas className='mx-auto rounded-3xl' ref={refer} width={width} height={height} />
    </div>
  );
};

export default GameBoard;
