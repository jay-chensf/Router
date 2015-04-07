# !/bin/sh

. /etc/hctlog.sh
hctlog "[begin.sh]begin"

lua /etc/app/create_ver_file.lua
hctlog "[begin.sh]create_ver_file.lua ok"

/bin/sh /etc/setwifi.sh
hctlog "[begin.sh]setwifi.sh ok"

hctlog "[begin.sh]end"
