# !/bin/sh
if [ -f "/tmp/start_ok" ]; then
	cd /etc/app
	lua wifihct_wds.lua
	lua cloud_ctrl.lua
fi
