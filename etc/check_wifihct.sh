# !/bin/sh
if [ -f "/etc/app/wifihct_stop_flag" ];then
/usr/bin/wifihct-init stop
else
/usr/bin/wifihct-init start
fi