# 像素風闖關問答遊戲 (Pixel Art Trivia Game)

這是一款採用 2000 年代街機 Pixel Art 像素風格的 React 前端網頁遊戲。玩家可以輸入自己的 ID，挑戰隨機產生的 DiceBear 關主圖片與題目。遊戲可以與 Google Sheets + Google Apps Script 完美整合，讓你可以輕鬆管理自己的題目並自動記錄每個玩家的最高分數與通關次數！

---

## 🚀 詳細安裝與部署教學 (Google Sheets & Apps Script)

### Step 1: 準備 Google Sheets 資料庫
1. 在你的 Google 雲端硬碟新建一個 Google Sheet（試算表）。
2. 在左下角的「工作表」頁籤建立兩個工作表，分別精準命名為「**題目**」與「**回答**」。
3. 在「**題目**」工作表的第一列（A1 到 G1），依序輸入底下這些標題：
   `題號` | `題目` | `A` | `B` | `C` | `D` | `解答`
4. 在「**回答**」工作表的第一列（A1 到 G1），依序輸入底下這些標題：
   `ID` | `闖關次數` | `總分` | `最高分` | `第一次通關分數` | `花了幾次通關` | `最近遊玩時間`

### Step 2: 匯入測試用題庫（生成式 AI 基礎知識）
你可以直接複製以下 10 題選擇題，並**貼上到你的「題目」工作表**中（從 A2 儲存格開始貼上），馬上就能作為遊戲的測試題庫！

| 題號 | 題目 | A | B | C | D | 解答 |
|---|---|---|---|---|---|---|
| 1 | 生成式 AI 主要的功能是什麼？ | 只能進行簡單的數學計算 | 搜尋網路上的既有文章 | 學習資料特徵並生成全新的內容 | 用來壓縮圖片檔案 | C |
| 2 | 以下哪一種模型結構是目前大型語言模型 (LLM) 最常使用的基礎架構？ | CNN | Transformer | RNN | GAN | B |
| 3 | ChatGPT 是由哪一間人工智慧實驗室開發的？ | Google DeepMind | OpenAI | Meta | Anthropic | B |
| 4 | 在 AI 領域中，「Prompt」通常指的是什麼？ | AI 發電所需的硬體 | AI 產生的最終圖片結果 | 系統發生錯誤時的代碼 | 使用者輸入給 AI 的提示詞或指令 | D |
| 5 | 何謂因 AI 無中生有而產生的「幻覺 (Hallucination)」？ | AI 拒絕回答使用者的問題 | AI 準確預測了未來的趨勢 | AI 生成了看似合理但實際上捏造、不正確的資訊 | AI 處理速度過快導致螢幕閃爍 | C |
| 6 | Midjourney 或 DALL-E 這類型的 AI 模型，最擅長處理哪一種任務？ | 語音轉文字 | 文字生成圖片 | 語言間的雙向翻譯 | 極度複雜的程式碼除錯 | B |
| 7 | 下列哪一個名詞是用來形容「為了讓模型適應特定任務，而在特定高品質資料集上對模型進行二次訓練」的過程？ | Pre-training (預訓練) | Fine-tuning (微調) | Tokenization (標記化) | Overfitting (過度擬合) | B |
| 8 | 大型語言模型在處理文字前，會將句子切分成系統能理解的最小單位，這個單位稱為什麼？ | Pixel (像素) | Byte (位元組) | Node (節點) | Token (詞元) | D |
| 9 | 下列哪一種技術可以讓 LLM 在不重新訓練的情況下，精準回答外部最新企業資料庫的問題？ | RAG (檢索增強生成) | GAN (生成對抗網路) | RLHF (人類回饋強化學習) | CNN (卷積神經網路) | A |
| 10 | AI 訓練過程中的「RLHF」全名或概念是什麼？ | 隨機邏輯啟發式函數 | 人類回饋強化學習 | 遞迴學習隱藏特徵 | 強制限制高頻率函數 | B |

### Step 3: 設定 Google Apps Script (後端)
1. 在剛剛的 Google Sheet 頂端選單，點擊 **「擴充功能」 -> 「Apps Script」**。
2. 刪除編輯器畫面中原本出現的預設程式碼 `function myFunction() {...}`。
3. 將剛剛一併開出來的 `gas_backend.gs` 檔案裡面的程式碼，**全部複製並貼上**到 Apps Script 編輯器中。
4. 點擊右上角藍色的 **「部署」 -> 「新增部署作業」**。
5. 點擊「選取類型」旁邊的齒輪圖示 ⚙️，選擇 **「網頁應用程式 (Web app)」**。
6. 設定部署作業細節：
   - 描述：可隨意填寫（例如 `v1.0`）
   - 執行身分：請選 **「你 (Your Email)」** (確保指令碼有權限讀寫你本人的試算表資料)
   - 誰可以存取：請選 **「所有人 (Anyone)」** (必須設為所有人，前端才呼叫得到)
7. 點擊右下角的「部署」。*(註：如果是第一次授權，Google 會出現安全警告，請點擊「進階」並「繼續前往（不安全）」以授權帳號存取)*。
8. 部署完成後，會跳出「網頁應用程式網址 (Web App URL)」，請完整**複製該段網址**。

### Step 4: 配置前端 React 專案環境變數
1. 回到本機 `pixel-game` 專案目錄下。
2. 打開 `.env` 檔案。
3. 將剛剛複製的「網頁應用程式網址」替換到 `VITE_GOOGLE_APPS_SCRIPT_URL` 變數中：
   ```env
   VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/你的_APPS_SCRIPT_加密字串/exec
   VITE_PASS_THRESHOLD=3
   VITE_QUESTION_COUNT=5
   ```
4. 儲存 `.env` 檔案。
5. 在終端機執行 `npm run dev` 重啟開發伺服器。
6. 打開瀏覽器進入 `http://localhost:5173/`。大功告成！現在遊戲已經成功串接到你的 Google Sheet，隨時更新題目都能即時連動啦！

---

## 🚀 自動部署到 GitHub Pages (透過 GitHub Actions)

本專案已經內建了 GitHub Actions 部署腳本。要自動編譯並公開部署到免費的 GitHub Pages 上，請按照以下步驟操作：

1. **上傳專案到 GitHub**：
   將本專案的原始碼推送 (push) 到你的 GitHub 儲存庫 (repository) 上的 `main` 或 `master` 分支。

2. **設定環境變數 Secrets**：
   因為安全考量，我們不會把 Google Apps Script 網址明文寫在程式碼裡推上雲端。我們需要直接讓 GitHub 背景讀取：
   - 進入你的 GitHub 專案 Repo 頁面。
   - 點擊上方選單的 **Settings** -> 左側欄 **Secrets and variables** -> **Actions**。
   - 點擊綠色的 **New repository secret** 按鈕。
   - 依序建立以下三個 Secrets（變數名稱要一模一樣），並填入你的專屬數值（可參考 `.env.example`）：
     - `VITE_GOOGLE_APPS_SCRIPT_URL`：(必填) 你前一個步驟拿到的 Web App 部署網址。
     - `VITE_PASS_THRESHOLD`：(選填) 通關門檻，例如 `3`。
     - `VITE_QUESTION_COUNT`：(選填) 每次抽取的題數，例如 `5`。

3. **啟用 GitHub Pages 部署權限**：
   - 到 **Settings** -> 左側欄 **Pages**。
   - 在 **Build and deployment** 區塊中，將 **Source** 下拉選單改為 **GitHub Actions**。

4. **觸發自動部署**：
   - 只要有設定好 Secrets 並將 Source 改為 Actions，下一次你將程式碼 push 到 GitHub 時，這個 Action 就會自動觸發並幫你打包發布了！
   - (也可以手動到 Repo 的 **Actions** 頁籤，點選左側「Deploy to GitHub Pages」，並點選右邊「Run workflow」手動觸發)。
   - 等待綠色勾勾發布成功後，你就會擁有一個專屬的網頁連結 (例如 `https://你的帳號.github.io/你的專案名稱/`)，全世界都可以直接連上線玩你的像素遊戲囉！
