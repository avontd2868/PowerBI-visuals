@ECHO off

call "%VS120COMNTOOLS%vsvars32.bat"
SET PowerBiClients_src=%~dp0
msbuild src\Clients\Visuals\Visuals.csproj