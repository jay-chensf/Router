#!/bin/sh

rm -rf /etc/ap_update/
mkdir -p /etc/ap_update/ 

ap_pwd=$(uci get wifihct.@wifihct[0].ap_pwd)
ap_batch=$(uci get wifihct.@wifihct[0].ap_version)
hct_update_host=$(uci get consumer.@name[0].update_host)
hct_update_version=$(uci get consumer.@name[0].update_version)
hct_update_hardware=$(uci get consumer.@name[0].update_hardware)
update_sub_url=$(uci get consumer.@name[0].update_sub_url)
test -f /etc/ap_update.version || {
	echo "0.1" > /etc/ap_update.version
	lua /etc/app/create_ver_file.lua
}
ap_version=`cat /etc/ap_update.version`
gw_id=`cat /etc/box_id.info`
param="version="$ap_version"&gw_id="$gw_id"&ap_batch="$ap_batch"&hct_update_host="$hct_update_host"&hct_update_version="$hct_update_version"&hct_update_hardware="$hct_update_hardware
echo $param
wget "${update_sub_url}?${param}" -O "/etc/ap_update/ap_update.zip"

test -f /etc/ap_update/ap_update.zip || exit 1
unzip  -q -n -P $ap_pwd /etc/ap_update/ap_update.zip -d /etc/ap_update/

if [ $? -eq 0 ];then
    test -f /etc/ap_update/ap_update.sh || exit 1
    test -f /etc/ap_update/ap_update.sh.tag || exit 1
    test -f /etc/ap_update/version || exit 1
    
    next_version=`cat /etc/ap_update/version`
    if [ "$next_version" == "$ap_version" ];then
        echo "version error."
        exit 1
    else
        md5_sum_get=`cat /etc/ap_update/ap_update.sh.tag`
        md5_sum=`md5sum /etc/ap_update/ap_update.sh | awk '{print $1}'`
        
        if [ "$md5_sum" == "$md5_sum_get" ];then
            /bin/sh /etc/ap_update/ap_update.sh
            if [ $? -eq 0 ];then
               echo "$next_version" > /etc/ap_update.version
               lua /etc/app/create_ver_file.lua
            fi
        else
            echo "md5 error."
        fi
    fi
else
    echo "unzip error."
fi 

rm -rf /etc/ap_update/
