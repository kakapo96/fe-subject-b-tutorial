/**
 * 科目B アルゴリズム完全攻略ブートキャンプ
 * メインロジック (main_app.js)
 */

let currentStageNum = null;
let currentStageData = null;
let currentTopicData = null;

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
    const stageKey = `stage${stageNum}`;
    currentStageData = quizData[stageKey];
    
    document.getElementById('roadmap-layer').style.display = 'none';
    document.getElementById('learning-layer').style.display = 'block';
    
    if (currentStageData) {
        renderTopicMenu(currentStageData);
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

// ＝＝＝＝ 第3層：コンテンツを描画（iframe / タブあり / タブなし 自動判定） ＝＝＝＝
function startTopic(topicId) {
    currentTopicData = currentStageData.topics.find(t => t.id === topicId);
    if (!currentTopicData) return;

    const container = document.getElementById('dynamic-content-area');

    // ★クリアボタン生成ロジック（共通）
    const clearedTopics = JSON.parse(localStorage.getItem('fe_algo_cleared_topics')) || [];
    const isCleared = clearedTopics.includes(topicId);
    const clearBtnHTML = isCleared
        ? `<span style="color: #28a745; font-weight: bold; margin-left: auto; font-size: 1.1rem;">✔ クリア済み</span>`
        : `<button onclick="markAsCleared('${topicId}')" style="margin-left: auto; background: #28a745; color: #fff; border: none; padding: 8px 15px; border-radius: 5px; font-weight: bold; cursor: pointer;">このトピックをクリア</button>`;

    // ▼▼▼ standaloneHTML が設定されている場合（Stage 4以降）：iframe で展開 ▼▼▼
    if (currentTopicData.standaloneHTML) {
        container.innerHTML = `
            <div class="nav-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                <button class="back-btn" onclick="renderTopicMenu(currentStageData)" style="margin: 0;">← メニューに戻る</button>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span style="font-weight: bold; color: #333;">【応用ステージ】${currentTopicData.title}</span>
                    ${clearBtnHTML}
                </div>
            </div>
            <!-- iframeのallow属性を追加してスクリプトの動作を許可 -->
            <iframe src="${currentTopicData.standaloneHTML}" sandbox="allow-scripts allow-same-origin" style="width: 100%; height: 85vh; border: 2px solid #ccc; border-radius: 8px;"></iframe>
        `;
        return; // ここで処理終了（fetchはしない）
    }

    // ▼▼▼ それ以外（introHTML がある場合）：fetchで読み込む ▼▼▼
    container.innerHTML = '<p style="text-align:center; font-weight:bold;">データを読み込み中...</p>';

    fetch(currentTopicData.introHTML)
    .then(res => res.ok ? res.text() : Promise.reject(res))
    .then(introData => {
        // quizHTML（問題部分）が設定されているかチェック
        if (currentTopicData.quizHTML) {
            // quizHTMLがある場合（Stage 1〜3）：タブ形式で表示
            fetch(currentTopicData.quizHTML)
            .then(res => res.ok ? res.text() : Promise.resolve(""))
            .then(quizDataHtml => {
                container.innerHTML = `
                    <div class="nav-header" style="display: flex; align-items: center;">
                        <button class="back-btn" onclick="renderTopicMenu(currentStageData)">← メニューに戻る</button>
                        <h2 style="color: #004494; margin-left: 15px;">${currentTopicData.title}</h2>
                        ${clearBtnHTML}
                    </div>

                    <div class="main-tabs">
                        <button id="tab-btn-intro" class="main-tab-btn active" onclick="switchMainTab('intro')">📖 解説</button>
                        <button id="tab-btn-quiz" class="main-tab-btn" onclick="switchMainTab('quiz')">✍️ 問題</button>
                    </div>

                    <div id="main-tab-intro" class="main-tab-content active" style="animation: fadeIn 0.3s ease;">
                        ${introData}
                    </div>
                    <div id="main-tab-quiz" class="main-tab-content" style="display:none; animation: fadeIn 0.3s ease;">
                        ${quizDataHtml}
                    </div>
                `;
            });
        } else {
            // quizHTMLがない場合：タブなしで地続き表示
            container.innerHTML = `
                <div class="nav-header" style="display: flex; align-items: center;">
                    <button class="back-btn" onclick="renderTopicMenu(currentStageData)">← メニューに戻る</button>
                    <h2 style="color: #004494; margin-left: 15px;">${currentTopicData.title}</h2>
                    ${clearBtnHTML}
                </div>
                
                <div style="animation: fadeIn 0.3s ease; padding-top: 10px;">
                    ${introData}
                </div>
            `;
        }
    })
    .catch(err => {
        container.innerHTML = `
            <div class="nav-header">
                <button class="back-btn" onclick="renderTopicMenu(currentStageData)">← メニューに戻る</button>
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
    currentStageData = null;
    currentTopicData = null;
    updateProgressUI();
}

// ＝＝＝＝ トピックをクリア状態にする処理 ＝＝＝＝
function markAsCleared(topicId) {
    let clearedTopics = JSON.parse(localStorage.getItem('fe_algo_cleared_topics')) || [];
    if (!clearedTopics.includes(topicId)) {
        clearedTopics.push(topicId);
        localStorage.setItem('fe_algo_cleared_topics', JSON.stringify(clearedTopics));
    }
    
    updateProgressUI();
    startTopic(topicId); // 画面を再描画して「クリア済み」バッジを表示
}

// ＝＝＝＝ 全進捗リセット（デモ・動作確認用） ＝＝＝＝
function resetProgress() {
    if(confirm("すべての学習進捗をリセットしますか？ (デモ・動作確認用)")) {
        localStorage.removeItem('fe_algo_cleared_topics');
        updateProgressUI();
        
        if (document.getElementById('learning-layer').style.display === 'block' && currentStageData) {
            renderTopicMenu(currentStageData);
        }
        alert("進捗をリセットしました。");
    }
}
