if [ -f "/etc/popup.flag" ]; then
	cp -f /etc/popup.list /tmp/tmp1.txt
	cat /etc/whitelist.org | tr ',' '\n' >> /tmp/tmp1.txt
	sort -r /tmp/tmp1.txt | uniq -u | tr '\n' ',' > /etc/whitelist.info
	rm -f /tmp/tmp1.txt
else
	cp -f /etc/whitelist.org /etc/whitelist.info
fi

echo -n 'update' > /etc/whitelist.flag
