var GEMINI_API_KEY = "AIzaSyBRBdV7CccSzVw8SjV0T1axmXRH_ywyebQ";
var MODEL_NAME = "gemini-2.5-flash"; // 安定版

function doPost(e) {
  try {
    var postData = JSON.parse(e.postData.contents);
    var mode = postData.mode || 'normal';
    
    // --- 能動的な挨拶の生成 ---
    if (postData.action === 'get_greeting') {
      var greeting = generateGreeting(postData.pantry, postData.timeInfo, mode);
      return createJsonResponse({ greeting: greeting });
    }
    
    // --- チャット ---
    if (postData.action === 'chat') {
      var reply = chatWithGemini(postData.message, postData.history, postData.pantry, mode);
      return createJsonResponse({ reply: reply });
    }
    
    // --- レシピ解析（doGetへ） ---
    return doGet({parameter: postData});
  } catch (error) {
    return createJsonResponse({error: error.toString()});
  }
}

function generateGreeting(pantry, timeInfo, mode) {
  var apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL_NAME + ":generateContent?key=" + GEMINI_API_KEY;
  
  var modePrompt = "";
  if (mode === 'addiction') {
    modePrompt = "あなたはなぎさんを全肯定して甘やかす天才シェフです。『今日もお疲れ様！頑張った自分に一番美味しいものを！』というトーンで、贅沢な提案をしてください。";
  } else if (mode === 'savings') {
    modePrompt = "あなたは在庫管理に厳しい節約の鬼シェフです。『在庫を腐らせるなんて許せません！これ、絶対今日使い切りましょう！』という勢いで、在庫一掃を提案してください。";
  } else {
    modePrompt = "あなたは優しく親しみやすいパーソナル・シェフです。なぎさんの状況に合わせた温かい挨拶をしてください。";
  }

  var systemInstruction = "なぎさんに対し、以下の【モード】に従って挨拶（2〜3文）を生成してください。\n" +
    "・必ず『なぎさん、』から始めること。\n" +
    "・時間帯(" + (timeInfo || "昼") + ")と、在庫食材(" + ((pantry && pantry.length > 0) ? pantry[0].name : "なし") + ")を1つ絡めること。\n" +
    "【モード】: " + modePrompt;

  var payload = {
    "systemInstruction": { "parts": [{"text": systemInstruction}] },
    "contents": [{"parts": [{"text": "挨拶を生成せよ"}]}],
    "generationConfig": { "temperature": 0.8, "maxOutputTokens": 200 }
  };

  var response = UrlFetchApp.fetch(apiUrl, {
    "method": "post", "contentType": "application/json",
    "payload": JSON.stringify(payload), "muteHttpExceptions": true
  });
  var json = JSON.parse(response.getContentText());
  return json.candidates[0].content.parts[0].text;
}

function chatWithGemini(userMessage, history, pantry, mode) {
  var apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL_NAME + ":generateContent?key=" + GEMINI_API_KEY;
  
  var modeInstruction = "【現在のモード】: ";
  if (mode === 'addiction') {
    modeInstruction += "全肯定甘やかしモード。なぎさんの苦労をねぎらい、美味しいものを食べることを義務化するような勢いで答えてください。";
  } else if (mode === 'savings') {
    modeInstruction += "節約・冷蔵庫一掃モード。買い物に行かず、今あるものでいかに豪華に見せるか、無駄をゼロにするかに命を懸けてください。";
  } else {
    modeInstruction += "標準モード。バランス良く優しくアドバイスしてください。";
  }

  var systemPrompt = "あなたは『おいしい暮らし』の専属コンシェルジュです。\n" +
    modeInstruction + "\n" +
    "常に読みやすい改行を入れ、なぎさんに優しく接してください。\n" +
    "在庫状況: " + JSON.stringify(pantry);

  var contents = [];
  if (history) {
    history.forEach(function(h) { contents.push({ "role": h.role, "parts": [{"text": h.text }] }); });
  }
  contents.push({"role": "user", "parts": [{"text": userMessage}]});

  var response = UrlFetchApp.fetch(apiUrl, {
    "method": "post", "contentType": "application/json",
    "payload": JSON.stringify({ "systemInstruction": { "parts": [{"text": systemPrompt}] }, "contents": contents }),
    "muteHttpExceptions": true
  });
  return JSON.parse(response.getContentText()).candidates[0].content.parts[0].text;
}

function doGet(e) { /* レシピ解析ロジックは以前と同様 */ }
function createJsonResponse(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
