local hct_model_uci = require "luci.model.uci"
local os, string, table = os, string, table
local util = require "hctwifi.util"
local ltn12 = require "ltn12"
local json = require "hctwifi.json"
local protocol = require "luci.http.protocol"

local hct_uci =  hct_model_uci.cursor()
local cloud_get_url = hct_uci:get("consumer", "web", "cloud_get_url")
local cloud_set_url = hct_uci:get("consumer", "web", "cloud_set_url")

function getGwId()
  local f = io.open('/etc/box_id.info','r')
  local str = f:read(20)
  f:close()
  return str
end
local gw_id=getGwId()

--/api/commandreport?id=1&status=3（3表示成功，4表示失败）&errmsg=XXXX
function doReport(cid,gid,status,errmsg)
  local set_body="gw_id="..gid.."&id="..cid.."&status="..status.."&errmsg="..errmsg.."&"
  print ("set_body="..set_body)
  local set_resp = util.download_to_string({
    url = cloud_set_url,
    source = ltn12.source.string(set_body),
    method = 'POST',
    headers = {
      ["Content-Length"] = string.len(set_body),
      ["Content-Type"] = "application/x-www-form-urlencoded"
    }
  })
  local set_data = json.decode(set_resp)
  local set_ret = set_data['ret']
  print ("ret="..set_ret)
  return set_ret
end

function doReboot(cid,gid,value)
  local set_ret = doReport(cid,gid,3,"")
  if((set_ret.."")==("0")) then
    os.execute("reboot")
  end
end

function doShutdown(cid,gid,value)
  local set_ret = doReport(cid,gid,3,"")
  print ("ret="..set_ret)
  if((set_ret.."")==("0")) then
    os.execute("shutdown")
  end
end

function doSetSsid(cid,gid,value)
  local set_ret = doReport(cid,gid,3,"")
  print ("ret="..set_ret)
  if((set_ret.."")==("0")) then
    local wifi_status,wifi_device,wlanifname = luci.util.get_wifi_device_status()
    local netmd = require "luci.model.network".init()
    local net = netmd:get_wifinet(wifi_device)
    net:set("ssid",value)
    netmd:commit("wireless")
    netmd:save("wireless")
    os.execute("/etc/init.d/network stop >/dev/null 2>/dev/null")
    os.execute("/etc/init.d/network start >/dev/null 2>/dev/null")
  end
end

function doSetMaxAuthNum(cid,gid,value)
  local set_ret = doReport(cid,gid,3,"")
  print ("ret="..set_ret)
  if((set_ret.."")==("0")) then
  end
end

function doSetWifihctOn(cid,gid,value)
  local set_ret = doReport(cid,gid,3,"")
  print ("ret="..set_ret)
  if((set_ret.."")==("0")) then
    luci.util.exec("rm -f /etc/app/wifihct_stop_flag")
    luci.util.exec("/bin/sh /etc/app/wifihct_start.sh")
  end
end

function doSetWifihctOff(cid,gid,value)
  local set_ret = doReport(cid,gid,3,"")
  print ("ret="..set_ret)
  if((set_ret.."")==("0")) then
    luci.util.exec("touch /etc/app/wifihct_stop_flag")
    luci.util.exec("/bin/sh /etc/app/wifihct_stop.sh")
  end
end

function doSetRouterIp(cid,gid,value)
  local set_ret = doReport(cid,gid,3,"")
  print ("ret="..set_ret)
  if((set_ret.."")==("0")) then
    local netmd = require "luci.model.network".init()
    local iface = "lan"
    local net = netmd:get_network(iface)
    local ipReq = value
    local iptool = luci.ip
    local lanipnl = iptool.iptonl(ipReq)
    local codeResp = 0
    local bit = require "bit"
    local maskReq = "255.255.255.0"
    if not ((lanipnl >= iptool.iptonl("1.0.0.0") and lanipnl <= iptool.iptonl("126.255.255.255")) or (lanipnl >= iptool.iptonl("128.0.0.0") and lanipnl <= iptool.iptonl("223.255.255.255"))) then
      codeResp = 540
    elseif lanipnl >= iptool.iptonl("172.31.0.0") and lanipnl <= iptool.iptonl("172.31.255.255") then
      codeResp = 541
    elseif not (bit.band(lanipnl,iptool.ipnot(maskReq)) ~= 0 and bit.band(lanipnl,iptool.ipnot(maskReq)) ~= iptool.ipnot(maskReq)) then
      codeResp = 535
    end
    if (codeResp == 0) then
      net:set("ipaddr",value)
      net:set("netmask",maskReq)
      netmd:commit("network")
      netmd:save("network")
      luci.sys.call("env -i /sbin/reboot & >/dev/null 2>/dev/null")
    end
  end
end

function doSetRouterPwd(cid,gid,value)
  local set_ret = doReport(cid,gid,3,"")
  print ("ret="..set_ret)
  if((set_ret.."")==("0")) then
    local netmd = require "luci.model.network".init()
    luci.sys.user.setpasswd("root", value)
  end
end

function doSetPopup(cid,gid,value)
  local set_ret = doReport(cid,gid,3,"")
  print ("ret="..set_ret)
  if((set_ret.."")==("0")) then
    if((value.."")==("0")) then
      luci.util.exec("rm -f /etc/popup.flag")
      luci.util.exec("/bin/sh /etc/app/popup_proc.sh")
    else
      luci.util.exec("touch /etc/popup.flag")
      luci.util.exec("/bin/sh /etc/app/popup_proc.sh")
    end
  end
end

--胖ap模式不自动更新
local fatapflag = hct_uci:get("hctwds", "fatap", "fatap_check")
if((fatapflag.."")~="1") then

  if("a"=="a") then
    local get_body="gw_id="..gw_id.."&"
    local resp = util.download_to_string({
      url = cloud_get_url,
      source = ltn12.source.string(get_body),
      method = 'POST',
      headers = {
        ["Content-Length"] = string.len(get_body),
        ["Content-Type"] = "application/x-www-form-urlencoded"
      }
    })
    local res_data = json.decode(resp)
    print ("ret="..res_data['ret'])
    local datalist = res_data['data']
    local datanum = table.getn(datalist)
    print ("data.len="..datanum)
    for i=datanum,1,-1 do
      local j = datanum-i+1
      print ("j="..j)
      local command_id = datalist[j]['command_id']
      local command_key = datalist[j]['command_key']
      local command_value = protocol.urldecode(datalist[j]['command_value'])
      print ("command_id="..command_id..";command_key="..command_key..";command_value="..command_value..";")
      if((command_key.."")==("reboot")) then
        doReboot(command_id,gw_id,command_value)
        print ("do reboot")
      end
      if((command_key.."")==("shutdown")) then
        doShutdown(command_id,gw_id,command_value)
        print ("do shutdown")
      end
      if((command_key.."")==("set_ssid")) then
        doSetSsid(command_id,gw_id,command_value)
        print ("do set_ssid")
      end
      if((command_key.."")==("set_max_auth_num")) then
        doSetMaxAuthNum(command_id,gw_id,command_value)
        print ("do set_max_auth_num")
      end
      if((command_key.."")==("set_wifihct_on")) then
        doSetWifihctOn(command_id,gw_id,command_value)
        print ("do set_wifihct_on")
      end
      if((command_key.."")==("set_wifihct_off")) then
        doSetWifihctOff(command_id,gw_id,command_value)
        print ("do set_wifihct_off")
      end
      if((command_key.."")==("set_router_ip")) then
        doSetRouterIp(command_id,gw_id,command_value)
        print ("do set_router_ip")
      end
      if((command_key.."")==("set_router_pwd")) then
        doSetRouterPwd(command_id,gw_id,command_value)
        print ("do set_router_pwd")
      end
      if((command_key.."")==("pop_up")) then
        doSetPopup(command_id,gw_id,command_value)
        print ("do pop_up")
      end
    end
  end
end
--doSetSsid("","","test-ssid")
--doSetRouterIp("","","192.168.133.1")
--doSetRouterPwd("","","tttaaa")
