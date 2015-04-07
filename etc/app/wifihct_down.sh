# !/bin/sh
if [ -f "/tmp/start_ok" ]; then
	cd /etc/app
	rm /tmp/xxx.bin.tmp
	lua wifihct_down.lua
fi