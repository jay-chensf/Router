# !/bin/sh
rm /etc/hosts.tmp
echo "127.0.0.1 localhost" >> /etc/hosts.tmp
local_ip=$(uci get network.lan.ipaddr) 
local_host=$(uci get consumer.web.gw_host)
echo "$local_ip $local_host" >> /etc/hosts.tmp
echo "$local_ip local.hct" >> /etc/hosts.tmp

