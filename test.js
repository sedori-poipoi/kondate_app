var API_KEY = "AIzaSyBRBdV7CccSzVw8SjV0T1axmXRH_ywyebQ";

/**
 * なぎさんのAPIキーで利用可能なGeminiモデルを一覧表示して記録します
 */
function checkGeminiModels() {
  var url = "https://generativelanguage.googleapis.com/v1beta/models?key=" + API_KEY;
  
  try {
    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var json = JSON.parse(response.getContentText());
    
    if (json.error) {
      Logger.log("❌ エラーが発生しました: " + json.error.message);
      return;
    }
    
    Logger.log("✅ 利用可能なモデル一覧:");
    Logger.log("-----------------------------------------");
    
    var models = json.models;
    models.forEach(function(model) {
      // "models/gemini-1.5-flash" のような形式で出力されます
      Logger.log("▶️ " + model.name + " (" + model.displayName + ")");
      Logger.log("   機能: " + model.description);
      Logger.log("-----------------------------------------");
    });
    
    Logger.log("✨ 診断完了！コードで使用する際は 'gemini-1.5-flash' のように名前部分だけを指定してください。");
    
  } catch (e) {
    Logger.log("❌ 通信エラー: " + e.toString());
  }
}
