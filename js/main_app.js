/**
 * 科目B アルゴリズム完全攻略ブートキャンプ
 * メインロジック (main_app.js)
 */

let currentStageNum = null;
// localStorageから値を取得（文字列として保存されるため 'true' と比較）
let isTutorialCleared = localStorage.getItem('fe_algo_tutorial_cleared') === 'true';

// HTMLの読み込み完了時にクリア状態をチェックし、UIを更新
document.addEventListener('DOMContentLoaded', () => {
    if (isTutorialCleared) {
        updateStage1UI();
    }
});
 
 // ＝＝＝＝ 第1層：ロードマップからステージを選択 ＝＝＝＝
 function selectStage(stageNum) {
     // Stage 1 を選んだのに、まだチュートリアルをクリアしていない場合は弾く（セキュリティ用）
     if (stageNum === 1 && !isTutorialCleared) {
         alert('まずはStage 0：チュートリアルをクリアしてください。');
         return;
     }
 
     currentStageNum = stageNum;
     document.getElementById('roadmap-layer').style.display = 'none';
     document.getElementById('learning-layer').style.display = 'block';
     
     // 選ばれたステージに応じて第2層のメニューを描画
     if (stageNum === 0) {
         renderTopicMenu(quizData.stage0);
     } else if (stageNum === 1) {
         renderTopicMenu(quizData.stage1);
     } else {
         document.getElementById('dynamic-content-area').innerHTML = `
             <div class="nav-header">
                 <button class="back-btn" onclick="backToRoadmap()">← ロードマップに戻る</button>
                 <h2 style="color:red; margin-left: 15px;">Stage ${stageNum} は現在ロックされています。</h2>
             </div>`;
     }
 }
 
 // ＝＝＝＝ 第2層：ステージ内の項目メニューを描画 ＝＝＝＝
 function renderTopicMenu(stageData) {
     const container = document.getElementById('dynamic-content-area');
     
     // ヘッダー（戻るボタン付き）とメニューの生成
     let html = `
         <div class="nav-header">
             <button class="back-btn" onclick="backToRoadmap()">← ロードマップに戻る</button>
             <h2 style="color: #004494; margin-left: 15px;">${stageData.title}</h2>
         </div>
         <div style="display: grid; gap: 15px; margin-top: 20px;">
     `;
     
     stageData.topics.forEach(topic => {
         html += `<button onclick="startTopic('${topic.id}')" 
                     style="padding: 15px; background: #fff; border: 2px solid #0056b3; border-radius: 8px; color: #0056b3; font-size: 1.1rem; font-weight: bold; cursor: pointer; text-align: left;">
                     ▶ ${topic.title} を学習する
                  </button>`;
     });
     
     html += `</div>`;
     container.innerHTML = html;
 }
 
 // ＝＝＝＝ 第3層：解説・問題タブを描画 ＝＝＝＝
 function startTopic(topicId) {
     const stageData = quizData[`stage${currentStageNum}`];
     const topic = stageData.topics.find(t => t.id === topicId);
     if (!topic) return;
 
     const container = document.getElementById('dynamic-content-area');
     container.innerHTML = '<p style="text-align:center; font-weight:bold;">データを読み込み中...</p>';
 
     Promise.all([
         fetch(topic.introHTML).then(res => res.text()),
         topic.quizHTML ? fetch(topic.quizHTML).then(res => res.text()) : Promise.resolve("")
     ])
     .then(([introData, quizDataHtml]) => {
         // 解説と問題をタブ構造で合体させる
         container.innerHTML = `
             <div class="nav-header">
                 <button class="back-btn" onclick="renderTopicMenu(quizData.stage${currentStageNum})">← メニューに戻る</button>
                 <h2 style="color: #004494; margin-left: 15px;">${topic.title}</h2>
             </div>
 
             <div class="main-tabs">
                 <button id="tab-btn-intro" class="main-tab-btn active" onclick="switchMainTab('intro')">📖 解説</button>
                 <button id="tab-btn-quiz" class="main-tab-btn" onclick="switchMainTab('quiz')">✍️ 問題</button>
             </div>
 
             <div id="main-tab-intro" class="main-tab-content active">${introData}</div>
             <div id="main-tab-quiz" class="main-tab-content" style="display:none;">${quizDataHtml}</div>
         `;
     })
     .catch(err => {
         container.innerHTML = `
             <div class="nav-header">
                 <button class="back-btn" onclick="renderTopicMenu(quizData.stage${currentStageNum})">← メニューに戻る</button>
             </div>
             <div style="background: #f8d7da; padding: 15px; color: #721c24; border-radius: 8px; margin-top: 15px;">
                 <strong>⚠️ 読み込みエラー:</strong> ファイルが見つかりません。パスを確認してください。
             </div>`;
     });
 }
 
 // ＝＝＝＝ メインのタブ切り替え処理 ＝＝＝＝
 function switchMainTab(tabName) {
     document.getElementById('main-tab-intro').style.display = (tabName === 'intro') ? 'block' : 'none';
     document.getElementById('main-tab-quiz').style.display = (tabName === 'quiz') ? 'block' : 'none';
     
     if (tabName === 'intro') {
         document.getElementById('tab-btn-intro').classList.add('active');
         document.getElementById('tab-btn-quiz').classList.remove('active');
     } else {
         document.getElementById('tab-btn-quiz').classList.add('active');
         document.getElementById('tab-btn-intro').classList.remove('active');
     }
 }
 
 // ＝＝＝＝ トップ画面（第1層）に戻る処理 ＝＝＝＝
 function backToRoadmap() {
     document.getElementById('learning-layer').style.display = 'none';
     document.getElementById('roadmap-layer').style.display = 'block';
     document.getElementById('dynamic-content-area').innerHTML = ''; 
     
     // もしチュートリアルがクリアされていたら、トップ画面のStage 1の見た目をリアルタイムに更新
     if (isTutorialCleared) {
         updateStage1UI();
     }
 }
 
 // ＝＝＝＝ クイズ画面のページ切り替え処理 ＝＝＝＝
 function switchPage(targetId) {
     document.querySelectorAll('.page').forEach(page => {
         page.classList.remove('active');
     });
     const targetPage = document.getElementById(targetId);
     if (targetPage) {
         targetPage.classList.add('active');
         window.scrollTo(0, 0);
     }
 }
 
 // ＝＝＝＝ ★新規追加：チュートリアルクリア時の処理 ＝＝＝＝
 function completeTutorial() {
     isTutorialCleared = true;
     alert('🎉 チュートリアルクリア！\nStage 1「基礎編」が解放されました！');
     
     // メイン画面のUIをアンロック状態に書き換える
     updateStage1UI();
     
     // ロードマップ画面に自動で戻す
     backToRoadmap();
 }
 
 // ＝＝＝＝ ★新規追加：Stage 1の見た目を解放状態にする処理 ＝＝＝＝
 function updateStage1UI() {
     const stage1Card = document.getElementById('stage-card-1');
     const stage1Btn = document.getElementById('btn-stage-1');
     
     if (stage1Card && stage1Btn) {
         stage1Card.classList.remove('locked'); // グレーアウト用のクラスを削除
         stage1Btn.disabled = false;            // ボタンを押せるようにする
         stage1Btn.innerText = '学習を開始';     // ボタンの文字を変更
     }
 }

 function completeTutorial() {
    isTutorialCleared = true;
    
    // localStorageにクリア状態を保存
    localStorage.setItem('fe_algo_tutorial_cleared', 'true');
    
    alert('🎉 チュートリアルクリア！\nStage 1「基礎編」が解放されました！');
    
    // メイン画面のUIをアンロック状態に書き換える
    updateStage1UI();
    
    // ロードマップ画面に自動で戻す
    backToRoadmap();
}
