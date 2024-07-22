//  各部屋名:各部屋画像イメージ
const roomArray = [
  {"name":"玄関", "image":"./images/entrance.jpg", "timer":30}
 ,{"name":"社員用出入り口", "image":"./images/employee_entrance.jpg", "timer":30}
 ,{"name":"社内中央", "image":"./images/center.jpg", "timer":30}
 ,{"name":"作業スペース", "image":"./images/work_space.jpg", "timer":30}
 ,{"name":"会議室（ふじ）", "image":"./images/conference_room.jpg", "timer":30}
 ,{"name":"休憩スペース", "image":"./images/break_room.jpg", "timer":30}
]

// 初期タイマー時間
const initialTime = 13;

const startButton = document.getElementById('startButton');// STARTボタン
const overlay = document.getElementById('overlay');// マスク
const sound01 = document.getElementById('sound01');// BGM
const roomText = document.getElementById('room-text');// 部屋名
const backImage = document.getElementById('backImage');// 背景画像
const timerText = document.getElementById('time-text');// タイマー

/** 
* スタートボタンクリック
*/
AFRAME.registerComponent('click-start', {
 init:function(){
   startButton.addEventListener('click', ()=>{
     startButton.parentNode.removeChild(startButton);// STARTボタン削除
     overlay.parentNode.removeChild(overlay);// マスク削除
     countdown(roomArray[0].timer);// タイマー表示
     displeyRoomName(roomArray[0].name);// 最初の部屋名表示
     insertBackImage(roomArray[0].image);// 最初の部屋画像表示
     sound01.components.sound.playSound();// 音声再生
   });
 }
});

/**
* 部屋名表示（※日本語出力が対応していないため画像として表示する）
*/ 
function displeyRoomName(roomName) {
 // 対象の日本語テキストを生成したcanvasに描画
 const width = roomName.length * 1.4;
 const height = 1.6;
 let cvs = document.createElement('canvas');
 let ctx = cvs.getContext('2d');
 cvs.width = (roomName.length * 1.4) * 100;
 cvs.height = 1.6 * 100;
 ctx.fillStyle = "rgb(255, 255, 255)";
 ctx.font = '100pt Arial';
 ctx.fillText(roomName, 0, 125);

 // 文字の長さによってxの位置を決める(y,zは固定)
 const xPosition = -1.55 + (roomName.length * 0.07);
 roomText.setAttribute('position', {x: xPosition, y: 0.7, z: -1});

 // canvas情報をbase64に変換
 const base64 = cvs.toDataURL("image/png");
 // a-imageを挿入
 roomText.innerHTML = `<a-image scale="${(width)/10} ${height/10} 1" src="${base64}"></a-image>`;
}

/**
* 背景画像イメージ挿入 
*/ 
function insertBackImage(imagePath) {
 backImage.setAttribute('src', imagePath);
}

/** 
* カウントダウンタイマー表示
*/
let count = 1;// 部屋切替回数
function countdown(timer) {
 // 初期タイマー時間
 let seconds = timer;
 
 const interval = setInterval(() => {
   timerText.setAttribute('value', seconds);

   // 10秒以下は赤文字
   if(seconds <= 10) {
     timerText.setAttribute('color', "red");
   }
   seconds--;
   
   // タイマーが0
   if (seconds < 0) {
     // 設定されている部屋がまだあれば、次の部屋へ移動
     if (count < roomArray.length) {
       displeyRoomName(roomArray[count].name);// 次の部屋名をセット
       insertBackImage(roomArray[count].image);// 次の画像を挿入
       timerText.setAttribute('color', "white");
       clearInterval(interval);
       countdown(roomArray[count++].timer);
     } else {
       clearInterval(interval);
       return;
     }
   }
 }, 1000);
}