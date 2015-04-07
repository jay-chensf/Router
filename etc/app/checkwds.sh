# !/bin/sh

if [ -f "/tmp/start_ok" ]; then
	wdsifname=$(uci get hctwds.wds.ifname)
	ipinfo=`ifconfig $wdsifname | grep "inet addr"`
	echo "len="${#ipinfo}
	if [ ${#ipinfo} -lt 10 ]; then
		echo "need wifi"
		/sbin/wifi
		/sbin/udhcpc -t 2 -T 3 -n -q -i $wdsifname -F hctwifi-wds
		/bin/touch /tmp/wds_err	
	else
		echo "need ping"
		toip=`route -n | grep '0.0.0.0' | awk '{print $2}' | head -n 1`
		echo "toip="$toip
		infocc=`ping -c 1 -w 5 $toip | grep "bytes from"`
		if [ ${#infocc} -lt 10 ]; then
			infocc=`ping -c 1 -w 5 $toip | grep "bytes from"`
			if [ ${#infocc} -lt 10 ]; then
				/sbin/wifi
				/sbin/udhcpc -t 2 -T 3 -n -q -i $wdsifname -F hctwifi-wds
				/bin/touch /tmp/wds_err	
			else
				rm /tmp/wds_err	
			fi
		else
			rm /tmp/wds_err
		fi
	fi
fi