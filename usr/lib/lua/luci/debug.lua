local debug = require "debug"
local io = require "io"
local collectgarbage, floor = collectgarbage, math.floor
module "luci.debug"
__file__ = debug.getinfo(1, 'S').source:sub(2)

