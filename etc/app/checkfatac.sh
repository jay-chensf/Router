# !/bin/sh
PIDS=`ps |grep hctaccontrol |grep -v grep`
if [ "$PIDS" != "" ]; then
#echo "myprocess is runing!"
true;
else
killall -9 hctaccontrol
/usr/bin/hctaccontrol &
fi