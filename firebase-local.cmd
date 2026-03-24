@echo off
setlocal
set "NODE_HOME=%~dp0.tools\node-v24.13.1-win-x64"
if not exist "%NODE_HOME%\node.exe" (
  echo Node local nao encontrado em "%NODE_HOME%".
  exit /b 1
)
set "PATH=%NODE_HOME%;%PATH%"
call "%NODE_HOME%\npx.cmd" firebase %*
