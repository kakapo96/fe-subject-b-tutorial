/**
 * メインロジック (main_app.js)
 */

// 現在選択されているステージとトピックを保持する変数
let currentStageData = null;
let currentTopicData = null;

// ＝＝＝＝ メニューを開く ＝＝＝＝
function selectStage(stageNumber) {
    const stageKey = "stage" + stageNumber;
    currentStageData = quizData[stageKey];
    
    if (!currentStageData) return;

    document.getElementById('roadmap-layer').style.display = 'none';
    document.getElementById('learning-layer').style.display = 'block';
    renderTopicMenu(currentStageData);
}

// ＝＝＝＝ 項目メニューを描画 ＝＝＝＝
function renderTopicMenu(stageData) {
    const container = document.getElementById('dynamic-content-area');
    
    let html = `
        <div class="nav-header">
            <button class="back-btn" onclick="backToRoadmap()">← トップに戻る</button>
            <h2 style="color: #004494; margin-left: 15px;">${stageData.title}</h2>
        </div>
        <div style="display: grid; gap: 15px; margin-top: 20px;">
    `;
    
    stageData.topics.forEach(topic => {
        html += `<button onclick="startTopic('${topic.id}')" 
                    style="padding: 15px; background: #fff; border: 2px solid #0056b3; border-radius: 8px; color: #0056b3; font-size: 1.1rem; font-weight: bold; cursor: pointer; text-align: left;">
                    ▶ ${topic.title}
                 </button>`;
    });
    
    html += `</div>`;
    container.innerHTML = html;
}

// ＝＝＝＝ コンテンツを描画（タブあり/なしを自動判定） ＝＝＝＝
function startTopic(topicId) {
    currentTopicData = currentStageData.topics.find(t => t.id === topicId);
    if (!currentTopicData) return;

    const container = document.getElementById('dynamic-content-area');
    container.innerHTML = '<p style="text-align:center;">データを読み込み中...</p>';

    // ① introHTML（解説部分）を読み込む
    fetch(currentTopicData.introHTML)
    .then(res => res.text())
    .then(introData => {
        
        // ② quizHTML（問題部分）が設定されているかチェック
        if (currentTopicData.quizHTML) {
            // ▼▼▼ quizHTMLがある場合（Stage 1〜3など）：タブ形式で表示 ▼▼▼
            fetch(currentTopicData.quizHTML)
            .then(res => res.text())
            .then(quizData => {
                container.innerHTML = `
                    <div class="nav-header">
                        <button class="back-btn" onclick="renderTopicMenu(currentStageData)">← メニューに戻る</button>
                        <h2 style="color: #004494; margin-left: 15px;">${currentTopicData.title}</h2>
                    </div>
                    
                    <div class="main-tabs">
                        <button class="main-tab-btn active" onclick="switchMainTab(0)">📖 解説</button>
                        <button class="main-tab-btn" onclick="switchMainTab(1)">✍️ 問題</button>
                    </div>
                    
                    <div id="main-content-0" class="main-tab-content active" style="animation: fadeIn 0.3s ease;">
                        ${introData}
                    </div>
                    
                    <div id="main-content-1" class="main-tab-content" style="animation: fadeIn 0.3s ease;">
                        ${quizData}
                    </div>
                `;
            });
        } else {
            // ▼▼▼ quizHTMLがない場合（Stage 4以降など）：タブなしで地続き表示 ▼▼▼
            container.innerHTML = `
                <div class="nav-header">
                    <button class="back-btn" onclick="renderTopicMenu(currentStageData)">← メニューに戻る</button>
                    <h2 style="color: #004494; margin-left: 15px;">${currentTopicData.title}</h2>
                </div>
                
                <div style="animation: fadeIn 0.3s ease;">
                    ${introData}
                </div>
            `;
        }
    });
}

// ＝＝＝＝ メインタブの切り替え処理（解説 ⇔ 問題） ＝＝＝＝
function switchMainTab(tabIndex) {
    const btns = document.querySelectorAll('.main-tab-btn');
    const contents = document.querySelectorAll('.main-tab-content');
    
    btns.forEach((btn, idx) => {
        if(idx === tabIndex) btn.classList.add('active');
        else btn.classList.remove('active');
    });
    
    contents.forEach((content, idx) => {
        if(idx === tabIndex) content.classList.add('active');
        else content.classList.remove('active');
    });
}

// ＝＝＝＝ トップ画面に戻る処理 ＝＝＝＝
function backToRoadmap() {
    document.getElementById('learning-layer').style.display = 'none';
    document.getElementById('roadmap-layer').style.display = 'block';
    document.getElementById('dynamic-content-area').innerHTML = ''; 
    currentStageData = null;
    currentTopicData = null;
}
