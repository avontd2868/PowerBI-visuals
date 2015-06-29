@echo off
setlocal

set TF_BUILD_SOURCESDIRECTORY=%~dp0..\..\..
set TF_BUILD_BINARIESDIRECTORY=%TF_BUILD_SOURCESDIRECTORY%\test%random%%random%

echo check in directory %TF_BUILD_BINARIESDIRECTORY% for results.
mkdir %TF_BUILD_BINARIESDIRECTORY%

call powershell -executionpolicy unrestricted %TF_BUILD_SOURCESDIRECTORY%\tools\CloudBuildScripts\PostBuildScripts.ps1

endlocal
