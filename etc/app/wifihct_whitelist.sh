# !/bin/sh
if [ -f "/tmp/start_ok" ]; then
	cd /etc/app
	lua wifihct_whitelist.lua
fi