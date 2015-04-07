# !/bin/sh
#安装的时候调用

. /etc/hctlog.sh

hctlog "[sys_start.sh]begin"

/bin/chmod a+x /sbin/br
/bin/chmod a+x /www/cgi-bin/hct
/bin/chmod a+x /usr/lib/lua/network

hctlog "[sys_start.sh]chmod ok"

id_file_name=/etc/box_id.info
if [ ! -f $id_file_name ]
then
	gw_header=$(uci get consumer.web.gw_header)
	ap_version=$(uci get wifihct.@wifihct[0].ap_version)
	mac_address=`/sbin/ifconfig eth0  | sed -n '/HWaddr/ s/^.*HWaddr */HWADDR=/pg'  | awk -F"=" '{print $2}' |sed -n 's/://pg'| awk -F" " '{print $1}'`
	echo $mac_address	
	mac_check=`echo -n ${mac_address} | md5sum | awk '{printf("%c%c", substr($0,1,1),substr($0,2,1))}' | awk '{print toupper($0)}'`
	echo ${gw_header}${ap_version}${mac_check}${mac_address} >$id_file_name
	
	hctlog "[sys_start.sh]box_id ok"
{
rm -f /etc/wifihct.conf
id_file_name=/etc/box_id.info
gateway_id=`cat $id_file_name`
gateway_interface=$(uci get wifihct.@wifihct[0].gateway_interface) 
gateway_eninterface=$(uci get wifihct.@wifihct[0].gateway_eninterface)
gateway_hostname=$(uci get wifihct.@wifihct[0].gateway_hostname) 
gateway_httpport=$(uci get wifihct.@wifihct[0].gateway_httpport) 
gateway_path=$(uci get wifihct.@wifihct[0].gateway_path) 
gateway_connmax=$(uci get wifihct.@wifihct[0].gateway_connmax) 
check_interval=$(uci get wifihct.@wifihct[0].check_interval)
client_timeout=$(uci get wifihct.@wifihct[0].client_timeout)
  
# 将数值赋给wifihct官方的配置参数               
echo "
GatewayID $gateway_id
GatewayInterface $gateway_interface
ExternalInterface $gateway_eninterface
AuthServer {
	Hostname $gateway_hostname
	HTTPPort $gateway_httpport
	Path $gateway_path
	}

CheckInterval $check_interval
ClientTimeout $client_timeout
HTTPDMaxConn $gateway_connmax

FirewallRuleSet global {
	FirewallRule allow tcp port 443
}

FirewallRuleSet validating-users {
    FirewallRule allow to 0.0.0.0/0
}

FirewallRuleSet known-users {
    FirewallRule allow to 0.0.0.0/0
}

FirewallRuleSet unknown-users {
    FirewallRule allow udp port 53
    FirewallRule allow tcp port 53
    FirewallRule allow udp port 67
    FirewallRule allow tcp port 67
}

FirewallRuleSet locked-users {
    FirewallRule block to 0.0.0.0/0
}
" >> /etc/wifihct.conf
}

hctlog "[sys_start.sh]wifihct.conf ok"

{
mymac=`/sbin/ifconfig eth0 | sed -n '/HWaddr/ s/^.*HWaddr */HWADDR=/pg'  | awk -F"=" '{print $2}' | tr -s " "`
echo "
mac=$mymac;
model=HCT001;
version=1.0;
wan_ip=none;
token=none;
" > /etc/app/hct.conf
}

hctlog "[sys_start.sh]hct.conf ok"

fi


	
if [ -f "/etc/cron.flag" ];then
	/etc/init.d/cron restart &
else
	test -f /etc/crontabs/root || touch /etc/crontabs/root
	grep -q 'killall -HUP dnsmasq' /etc/crontabs/root || {
		echo "*/5 * * * *	killall -HUP dnsmasq" >> /etc/crontabs/root
	}
	grep -q '/etc/get_ap_update.sh' /etc/crontabs/root || {
		echo "*/5 * * * *	/bin/sh /etc/get_ap_update.sh" >> /etc/crontabs/root
	}
	grep -q '/etc/check_wifihct.sh' /etc/crontabs/root || {
		echo "*/5 * * * *	/bin/sh /etc/check_wifihct.sh" >> /etc/crontabs/root
	}
	grep -q '/etc/app/cloud_ctrl.sh' /etc/crontabs/root || {
		echo "*/1 * * * *	/bin/sh /etc/app/cloud_ctrl.sh" >> /etc/crontabs/root
	}
	grep -q '/etc/app/wifihct_update.sh' /etc/crontabs/root || {
		echo "*/30 * * * *	/bin/sh /etc/app/wifihct_update.sh" >> /etc/crontabs/root
	}
	grep -q '/etc/app/wifihct_whitelist.sh' /etc/crontabs/root || {
		echo "*/3 * * * *	/bin/sh /etc/app/wifihct_whitelist.sh" >> /etc/crontabs/root
	}
	/etc/init.d/cron restart &
	touch /etc/cron.flag
fi

hctlog "[sys_start.sh]cron ok"


test -f /etc/ap_update.version || {
	echo "0.1" > /etc/ap_update.version
}
hctlog "[sys_start.sh]ap_update.version ok"

hctlog "[sys_start.sh]end"
