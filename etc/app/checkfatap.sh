# !/bin/sh
toip=`route -n | grep '0.0.0.0' | awk '{print $2}' | head -n 1`

lua /etc/app/fatap_check.lua $toip

PIDS=`ps |grep "hctaccontrol $toip" |grep -v grep`
if [ "$PIDS" != "" ]; then
#echo "myprocess is runing!"
true;
else
killall -9 hctaccontrol
/usr/bin/hctaccontrol $toip 2070 &
fi