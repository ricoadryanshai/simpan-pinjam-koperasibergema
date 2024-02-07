Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c npx serve -s C:\xampp\htdocs\simpan-pinjam-koperasibergema-master\client\build", 0
Set WshShell = Nothing