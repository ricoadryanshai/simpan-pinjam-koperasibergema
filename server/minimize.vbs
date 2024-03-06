Set objShell = WScript.CreateObject("WScript.Shell")

strCommand = "cmd /c cd C:\WEB APLIKASI KOPERASI 2024\web-app-koperasibergema\server && npm start"

objShell.Run strCommand, 0, False

Set objShell = Nothing