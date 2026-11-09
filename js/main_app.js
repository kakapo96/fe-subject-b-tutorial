/**
 * 科目B アルゴリズム完全攻略ブートキャンプ
 * メインロジック (main_app.js)
 */

let currentStageNum = null;

// HTMLの読み込み完了時にプログレスバーを初期化
document.addEventListener('DOMContentLoaded', () => {
    updateProgressUI();
});

// ＝＝＝＝ 進捗率の計算とプログレスバー更新 ＝＝＝＝
function updateProgressUI() {
    const clearedTopics = JSON.parse(localStorage.getItem('fe_algo_cleared_topics')) || [];
    let totalTopics = 0;
    
    // quizDataから全トピック数をカウント
    for (let stageKey in quizData) {
        totalTopics += quizData[stageKey].topics.length;
    }
    
    const clearedCount = clearedTopics.length;
    const percent = totalTopics === 0 ? 0 : Math.floor((clearedCount / totalTopics) * 100);

    const progressBar = document.getElementById('total-progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar && progressText) {
        progressBar.style.width = percent + '%';
        progressText.innerText = `${percent}% (${clearedCount} / ${totalTopics} トピック)`;
    }
}

// ＝＝＝＝ 第1層：ロードマップからステージを選択 ＝＝＝＝
function selectStage(stageNum) {
    currentStageNum = stageNum;
    document.getElementById('roadmap-layer').style.display = 'none';
    document.getElementById('learning-layer').style.display = 'block';
    
    const stageKey = `stage${stageNum}`;
    
    if (quizData[stageKey]) {
        renderTopicMenu(quizData[stageKey]);
    } else {
        document.getElementById('dynamic-content-area').innerHTML = `
            <div class="nav-header">
                <button class="back-btn" onclick="backToRoadmap()">← ロードマップに戻る</button>
                <h2 style="color:red; margin-left: 15px;">Stage ${stageNum} は現在準備中です。</h2>
            </div>`;
    }
}

// ＝＝＝＝ 第2層：ステージ内の項目メニューを描画 ＝＝＝＝
function renderTopicMenu(stageData) {
    const container = document.getElementById('dynamic-content-area');
    const clearedTopics = JSON.parse(localStorage.getItem('fe_algo_cleared_topics')) || [];
    
    let html = `
        <div class="nav-header">
            <button class="back-btn" onclick="backToRoadmap()">← ロードマップに戻る</button>
            <h2 style="color: #004494; margin-left: 15px;">${stageData.title}</h2>
        </div>
        <div style="display: grid; gap: 15px; margin-top: 20px;">
    `;
    
    stageData.topics.forEach(topic => {
        // クリア状況に応じてボタンのデザインを変更
        const isCleared = clearedTopics.includes(topic.id);
        const badge = isCleared ? `<span style="background: #28a745; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.9rem; margin-right: 10px;">✔ CLEAR</span>` : '';
        const btnStyle = isCleared 
            ? `border-color: #28a745; color: #155724; background: #d4edda;` 
            : `border-color: #0056b3; color: #0056b3; background: #fff;`;

        html += `<button onclick="startTopic('${topic.id}')" 
                    style="padding: 15px; border: 2px solid; border-radius: 8px; font-size: 1.1rem; font-weight: bold; cursor: pointer; text-align: left; transition: 0.2s; ${btnStyle}">
                    ${badge}▶ ${topic.title} を学習する
                 </button>`;
    });
    
    html += `</div>`;
    container.innerHTML = html;
}

// ＝＝＝＝ 第3層：解説・問題タブ または iframe を描画 ＝＝＝＝
function startTopic(topicId) {
    const stageData = quizData[`stage${currentStageNum}`];
    const topic = stageData.topics.find(t => t.id === topicId);
    if (!topic) return;

    const container = document.getElementById('dynamic-content-area');

    // ★クリアボタン生成ロジック（共通）
    const clearedTopics = JSON.parse(localStorage.getItem('fe_algo_cleared_topics')) || [];
    const isCleared = clearedTopics.includes(topic.id);
    const clearBtnHTML = isCleared
        ? `<span style="color: #28a745; font-weight: bold; margin-left: auto; font-size: 1.1rem;">✔ クリア済み</span>`
        : `<button onclick="markAsCleared('${topic.id}')" style="margin-left: auto; background: #28a745; color: #fff; border: none; padding: 8px 15px; border-radius: 5px; font-weight: bold; cursor: pointer;">このトピックをクリア</button>`;

    // ★新規：standaloneHTML（独立したHTML）が指定されている場合は iframe で展開する
    if (topic.standaloneHTML) {
        container.innerHTML = `
            <div class="nav-header" style="display: flex; align-items: center;">
                <button class="back-btn" onclick="renderTopicMenu(quizData.stage${currentStageNum})">← メニューに戻る</button>
                <h2 style="color: #004494; margin-left: 15px;">${topic.title}</h2>
                ${clearBtnHTML}
            </div>
            <iframe src="${topic.standaloneHTML}" style="width: 100%; height: 85vh; border: none; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"></iframe>
        `;
        return; // ここで処理を終了し、以降の fetch 処理は行わない
    }

    // ★既存：introHTML / quizHTML を fetch する処理
    container.innerHTML = '<p style="text-align:center; font-weight:bold;">データを読み込み中...</p>';

    Promise.all([
        fetch(topic.introHTML).then(res => res.ok ? res.text() : Promise.reject(res)),
        topic.quizHTML ? fetch(topic.quizHTML).then(res => res.ok ? res.text() : Promise.resolve("")) : Promise.resolve("")
    ])
    .then(([introData, quizDataHtml]) => {
        container.innerHTML = `
            <div class="nav-header" style="display: flex; align-items: center;">
                <button class="back-btn" onclick="renderTopicMenu(quizData.stage${currentStageNum})">← メニューに戻る</button>
                <h2 style="color: #004494; margin-left: 15px;">${topic.title}</h2>
                ${clearBtnHTML}
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
                <strong>⚠️ 読み込みエラー:</strong> ファイルが見つかりません。パスを確認してください。<br>
                ${err.url ? err.url : ''}
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
    updateProgressUI();
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

// ＝＝＝＝ トピックをクリア状態にする処理 ＝＝＝＝
function markAsCleared(topicId) {
    let clearedTopics = JSON.parse(localStorage.getItem('fe_algo_cleared_topics')) || [];
    if (!clearedTopics.includes(topicId)) {
        clearedTopics.push(topicId);
        localStorage.setItem('fe_algo_cleared_topics', JSON.stringify(clearedTopics));
    }
    
    updateProgressUI();
    startTopic(topicId);
}

// ＝＝＝＝ 全進捗リセット（デモ用） ＝＝＝＝
function resetProgress() {
    if(confirm("すべての学習進捗をリセットしますか？ (デモ・動作確認用)")) {
        localStorage.removeItem('fe_algo_cleared_topics');
        updateProgressUI();
        
        if (document.getElementById('learning-layer').style.display === 'block' && currentStageNum !== null) {
            renderTopicMenu(quizData[`stage${currentStageNum}`]);
        }
        alert("進捗をリセットしました。");
    }
}

// ＝＝＝＝ 互換性維持：古いチュートリアル完了ボタン用 ＝＝＝＝
function completeTutorial() {
    markAsCleared('tut_07');
    alert('🎉 チュートリアルクリア！進捗が保存されました！');
    backToRoadmap();
}