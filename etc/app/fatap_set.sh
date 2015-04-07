# !/bin/sh
rm /etc/config/firewall.orig
mv /etc/config/firewall /etc/config/firewall.orig
cp /etc/config/firewall.fatap /etc/config/firewall

rm /etc/config/network.orig
mv /etc/config/network /etc/config/network.orig
cp /etc/config/network.fatap /etc/config/network

rm /etc/config/wireless.orig
mv /etc/config/wireless /etc/config/wireless.orig
cp /etc/config/wireless.fatap /etc/config/wireless

rm /etc/config/dhcp.orig
mv /etc/config/dhcp /etc/config/dhcp.orig
cp /etc/config/dhcp.fatap /etc/config/dhcp

touch /etc/app/wifihct_stop_flag
uci set hctwds.wds.wds_check=0
uci commit hctwds
