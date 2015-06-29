@echo off
for /f %%t in (chutzpah_references.txt) DO call :concat %%t
for /f %%t in (chutzpah_filelist.txt) DO call :concat %%t
..\..\..\tools\TypeScript\node.exe ..\..\..\tools\TypeScript\tsc.js @tempChutzpahTscArgs.txt -target ES5
del tempChutzpahTscArgs.txt
goto :eof

:concat
echo %1 >> tempChutzpahTscArgs.txt
goto :eof
