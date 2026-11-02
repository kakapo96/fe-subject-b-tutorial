/**
 * 科目B アルゴリズム完全攻略ブートキャンプ
 * 問題・解説データ定義ファイル (quiz_data.js)
 */

const quizData = {
    // ＝＝＝＝ 第0層：チュートリアル（全7ステップ） ＝＝＝＝
    stage0: {
        title: "Stage 0: チュートリアル（アルゴリズムの歩き方）",
        topics: [
            {
                id: "tut_01",
                title: "01 科目Bとは？＆擬似言語の基礎",
                introHTML: "資料html/00_チュートリアル/tut_01.html"
            },
            {
                id: "tut_02",
                title: "02 トレース実践① 変数の上書き",
                introHTML: "資料html/00_チュートリアル/tut_02.html"
            },
            {
                id: "tut_03",
                title: "03 トレース実践② 関数呼び出し",
                introHTML: "資料html/00_チュートリアル/tut_03.html"
            },
            {
                id: "tut_04",
                title: "04 トレース実践③ 条件分岐の順序",
                introHTML: "資料html/00_チュートリアル/tut_04.html"
            },
            {
                id: "tut_05",
                title: "05 トレース実践④ ループ処理",
                introHTML: "資料html/00_チュートリアル/tut_05.html"
            },
            {
                id: "tut_06",
                title: "06 トレース実践⑤ 配列の境界値",
                introHTML: "資料html/00_チュートリアル/tut_06.html"
            },
            {
                id: "tut_07",
                title: "07 最終確認 ＆ Stage1解放！",
                introHTML: "資料html/00_チュートリアル/tut_07_intro.html",
                quizHTML:  "資料html/00_チュートリアル/tut_07_quiz.html"
            }
        ]
    },

    // ＝＝＝＝ 第1層 ＝＝＝＝
    stage1: {
        title: "Stage 1: 基礎ソート＋スタックキュー＋ゲーム木",
        topics: [
            {
                id: "linear_sort",
                title: "01 線形探索・線形ソート",
                introHTML: "資料html/ステージ(1) 基礎ソート＋スタックキュー＋ゲーム木/01_線形ソート/linear_sort_intro.html", 
                quizHTML:  "資料html/ステージ(1) 基礎ソート＋スタックキュー＋ゲーム木/01_線形ソート/linear_sort_quiz.html" 
            },
            {
                id: "bubble_sort",
                title: "02 バブルソート",
                introHTML: "資料html/ステージ(1) 基礎ソート＋スタックキュー＋ゲーム木/02_バブルソート/bubble_sort_intro.html", 
                quizHTML:  "資料html/ステージ(1) 基礎ソート＋スタックキュー＋ゲーム木/02_バブルソート/bubble_sort_quiz.html" 
            },
            {
                id: "stack",
                title: "07 スタック",
                introHTML: "資料html/ステージ(1) 基礎ソート＋スタックキュー＋ゲーム木/07_スタック/stack_intro.html", 
                quizHTML:  "資料html/ステージ(1) 基礎ソート＋スタックキュー＋ゲーム木/07_スタック/stack_quiz.html" 
            },
            {
                id: "queue",
                title: "08 キュー",
                introHTML: "資料html/ステージ(1) 基礎ソート＋スタックキュー＋ゲーム木/08_キュー/queue_intro.html", 
                quizHTML:  "資料html/ステージ(1) 基礎ソート＋スタックキュー＋ゲーム木/08_キュー/queue_quiz.html" 
            },
            {
                id: "game_tree",
                title: "15 ゲーム木",
                introHTML: "資料html/ステージ(1) 基礎ソート＋スタックキュー＋ゲーム木/15_ゲーム木/game_tree_intro.html", 
                quizHTML:  "資料html/ステージ(1) 基礎ソート＋スタックキュー＋ゲーム木/15_ゲーム木/game_tree_quiz.html" 
            },
            
        ]
    },

    // ＝＝＝＝ 第2層 ＝＝＝＝
    stage2: {
        title: "Stage 2: ソート残り＋単方向リスト",
        topics: [
            {
                id: "selection_sort",
                title: "03 選択ソート",
                introHTML: "資料html/ステージ(2) ソート残り＋単方向リスト/03_選択ソート/selection_sort_intro.html", 
                quizHTML:  "資料html/ステージ(2) ソート残り＋単方向リスト/03_選択ソート/selection_sort_quiz.html" 
            },
            {
                id: "insertion_sort",
                title: "04 挿入ソート",
                introHTML: "資料html/ステージ(2) ソート残り＋単方向リスト/04_挿入ソート/insertion_sort_intro.html", 
                quizHTML:  "資料html/ステージ(2) ソート残り＋単方向リスト/04_挿入ソート/insertion_sort_quiz.html" 
            },
            {
                id: "quick_sort",
                title: "05 クイックソート",
                introHTML: "資料html/ステージ(2) ソート残り＋単方向リスト/05_クイックソート/quick_sort_intro.html", 
                quizHTML:  "資料html/ステージ(2) ソート残り＋単方向リスト/05_クイックソート/quick_sort_quiz.html" 
            },
            {
                id: "binary_sort",
                title: "06 バイナリーソート",
                introHTML: "資料html/ステージ(2) ソート残り＋単方向リスト/06_バイナリーソート/binary_sort_intro.html", 
                quizHTML:  "資料html/ステージ(2) ソート残り＋単方向リスト/06_バイナリーソート/binary_sort_quiz.html" 
            },
            {
                id: "singly_linked_list",
                title: "単方向リスト",
                introHTML: "資料html/ステージ(2) ソート残り＋単方向リスト/単方向/singly_linked_intro.html", 
                quizHTML:  "資料html/ステージ(2) ソート残り＋単方向リスト/単方向/singly_linked_quiz.html" 
            }
        ]
    },

    // ＝＝＝＝ 第3層 ＝＝＝＝
    stage3: {
        title: "Stage 3: 再帰 指向 2分木",
        topics: [
            {
                id: "oop",
                title: "09 オブジェクト指向",
                introHTML: "資料html/ステージ(3) 再帰 指向 2分木/09_オブジェクト指向/oop_intro.html", 
                quizHTML:  "資料html/ステージ(3) 再帰 指向 2分木/09_オブジェクト指向/oop_quiz.html" 
            },
            {
                id: "recursion",
                title: "10 再帰関数",
                introHTML: "資料html/ステージ(3) 再帰 指向 2分木/10_再帰関数/recursion_intro.html", 
                quizHTML:  "資料html/ステージ(3) 再帰 指向 2分木/10_再帰関数/recursion_quiz.html" 
            },
            {
                id: "merge_sort",
                title: "11 マージソート",
                introHTML: "資料html/ステージ(3) 再帰 指向 2分木/11_マージソート/merge_sort_intro.html", 
                quizHTML:  "資料html/ステージ(3) 再帰 指向 2分木/11_マージソート/merge_sort_quiz.html" 
            },
            {
                id: "binary_tree",
                title: "12 ２分木",
                introHTML: "資料html/ステージ(3) 再帰 指向 2分木/12_2分木/binary_tree_intro.html", 
                quizHTML:  "資料html/ステージ(3) 再帰 指向 2分木/12_2分木/binary_tree_quiz.html" 
            }
        ]
    },

    
    // quiz_data.js 内の Stage 4 などの設定例
    stage4: {
        title: "Stage 4: 応用 ソート",
        topics: [
            {
                id: "advanced_sort_module",
                title: "探索・ソートアルゴリズム 特訓モジュール（全7問）",
                 standaloneHTML: "資料html/ステージ(4) 応用 ソート/kou_sort.html" // そのまま読み込むHTML
            }
        ]
    }
};

