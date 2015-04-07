# !/bin/sh
hctlog()
{
	mytime=`/bin/date '+[%Y%m%d %H:%M:%S]'`
	/bin/echo $mytime$1 >> /tmp/hct.log
}
hctlogclear()
{
	rm /tmp/hct.log
}
