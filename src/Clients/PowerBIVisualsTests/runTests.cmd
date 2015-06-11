@echo off

call "%VS120COMNTOOLS%vsvars32.bat"

SET CHUTZPAH_PATH=..\..\..\tools\Chutzpah\4.0.0\chutzpah.console.exe

call msbuild %~dp0PowerBIVisualsTests.csproj

if NOT EXIST "%CHUTZPAH_PATH%" (
    set CHUTZPAH_PATH=chutzpah.console
)

call "%CHUTZPAH_PATH%" %~dp0chutzpah.json