tell application "Terminal"
    activate
    do script "echo '\n🍳 おいしい暮らし起動中...\n' && cd /Users/nagi_mi/developer/kondate_app && npm run dev"
end tell
delay 2
do shell script "open http://localhost:5173/"
