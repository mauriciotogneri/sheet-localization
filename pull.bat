@echo off

set LOCALE=en
set FORMAT=json
set TOKEN=???
set URL=???

C:\Windows\System32\curl -o "%LOCALE%.json" -L "%URL%?locale=%LOCALE%&format=%FORMAT%&token=%TOKEN%"