# !/bin/sh
if [ -f "/etc/config/firewall.orig" ]; then
	rm /etc/config/firewall
	cp /etc/config/firewall.orig /etc/config/firewall
fi

if [ -f "/etc/config/network.orig" ]; then
	rm /etc/config/network
	cp /etc/config/network.orig /etc/config/network
fi

if [ -f "/etc/config/wireless.orig" ]; then
	rm /etc/config/wireless
	cp /etc/config/wireless.orig /etc/config/wireless
fi

if [ -f "/etc/config/dhcp.orig" ]; then
	rm /etc/config/dhcp
	cp /etc/config/dhcp.orig /etc/config/dhcp
fi