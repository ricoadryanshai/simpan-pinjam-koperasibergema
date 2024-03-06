Set objShell = WScript.CreateObject("WScript.Shell")

strCommand = "cmd /c cd C:\WEB APLIKASI KOPERASI 2024\web-app-koperasibergema\client && npx serve -s build"

objShell.Run strCommand, 0, False

Set objShell = Nothing