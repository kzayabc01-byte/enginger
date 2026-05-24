@echo off
chcp 65001 >nul
echo ========================================
echo   代码之下 — 启动本地服务
echo ========================================
echo.
echo 正在安装依赖...
pip install -r requirements.txt -q
echo.
echo 启动服务器...
echo 浏览器打开 http://localhost:5000 即可访问
echo.
python server.py
pause
