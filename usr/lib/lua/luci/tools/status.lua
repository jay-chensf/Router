LuaQ               	)      E@    Εΐ   AA  E  \  ΑΑ  Ε B άA ΖΒά $                Β $B         $           B $Β      $   Β         io    ipairs    os 	   tonumber    require 	   nixio.fs    luci.model.uci    luci.model.network    module    luci.tools.status    cursor    dhcp_leases    wifi_networks    dns_resolv    wifi_network    global_wan_ifname           &     B   
   A      @@  AΑ  €       @   Aΐ  A    ΛAAΑ άΪ@  @ 	 ώΒA A  ΐόZ  @ό  ΐϋΪ  @ϋ  BJ CΔ   ά ΪB    ΑB C   IIBIWΔ@ @ B   I	@τΛΐDά@           /var/dhcp.leases    foreach    dhcp    dnsmasq    open    r    read    *l    match    ^(%d+) (%S+) (%S+) (%S+) 	      expires 	   difftime 	       time    macaddr    ipaddr 	   hostname    *    close                  F @ Z   @D   F@ΐ  @ \ Z   ΐ F @ H  B   ^       
   leasefile    access                                 '   P     r   
   D   F ΐ \   Δ  Aΐ  ά  ΐ
 KΒΐ\ 	BKBΑ\ 	BKΑ\ 	BJ  	BC ΛΒά   ΖΓAΔA DBJΔ B IΔ@ IC IC ID ID IΔD IE IDE IΔE IF IDF IF IΔF IG IDG IΔG IDH IDH IDHE IDH	 IDHE	 IΙC‘   μ  BB	 α  @ζ    &      init    get_wifidevs    up    is_up    device    name 	   get_i18n 	   networks    get_wifinets 	   
   shortname    mode    active_mode    ssid    active_ssid    bssid    active_bssid    encryption    active_encryption 
   frequency    channel    signal    quality    signal_percent    noise    bitrate    ifname 
   assoclist    country    txpower    txpoweroff    txpower_offset    key    get    key1    encryption_src    hidden    ssidprefix                     Q   m     )   
   A      @@  AΑ  €       @   Aΐ  A    @ΛAAΑ άΪ@  @ @ ώΒA ΑWBΐό  @όZ  ΐϋ  ΑB	@ΐϊΛ Cά@           /tmp/resolv.conf.auto    foreach    dhcp    dnsmasq    open    r    read    *l    match    ^(%S+) (%S+)    # 	      close        U   Z       F @ Z   @D   F@ΐ  @ \ Z   ΐ F @ H  B   ^          resolvfile    access                                 n       d   D   F ΐ \ @ΐ        Λ@ά Ϊ    
 	KAA\ 	AKΑA\ 	AKAB\ 	AKΑB\ 	AKAC\ 	AKΑC\ 	AKADΑ \	AKD\ 	AKΑD\ 	AKE\ 	AKE\ 	AKΑE\ 	AKF\ 	AKAF\ 	AKF\ 	AKΑF\ 	AKG\ 	AKG\ 	AKADΑΑ \	AKADΑ \	AKADΑA \	AKADΑ \	AJΑ  ΑΑ IΑ IΙ I	A Κ   ή    %      init    get_wifinet    get_device    id    name 
   shortname    up    is_up    mode    active_mode    ssid    active_ssid    bssid    active_bssid    encryption    active_encryption    encryption_src    get 
   frequency    channel    signal    quality    signal_percent    noise    bitrate    ifname 
   assoclist    country    txpower    txpoweroff    txpower_offset    key    key1    hidden    ssidprefix    device 	   get_i18n                                   D   K@ΐ Α  Α  A \Z                  eth1    get    network    wan    def_ifname                             