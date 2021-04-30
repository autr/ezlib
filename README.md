
| category | path | method | arguments | description |
| - | - | - | - | - |
| communication | /midi | get_midi |  | list midi devices |
| communication | /script | post_script |  | run a script |
| external | /weather_locations | post_weather_locations | place | show list of API endpoints |
| external | /weather_report | post_weather_report | id | show list of API endpoints |
| filesystem | /ls | get_ls | args | list files and folders |
| filesystem | /find | get_find | paths, iname | find files with -iname |
| filesystem | /cat | get_cat |  | read file to string |
| filesystem | /sendfile | get_sendfile |  | receive file |
| media | /xpm2png | post_xpm2png | path | retrieve a png from xpm |
| media | /icons | get_icons | iname | find application icons |
| network | /ifconfig | get_ifconfig |  | list of interfaces |
| network | /iwconfig | get_iwconfig |  | list of active connections |
| network | /iwlist | get_iwlist | iface | scan for networks |
| network | /wpa_status | get_wpa_status | iface | status of wpa_supplicant |
| network | /wpa_supplicant_enable | post_wpa_supplicant_enable | ssid, pass, iface | connect to wifi network |
| network | /connect | post_connect | ssid, pass | connect to wifi network |
| network | /netstat | get_netstat |  | show list of TCP connections |
| processes | /snapshot | get_snapshot |  | all active processes and pids |
| processes | /open | post_open | path | open anything with default apps |
| processes | /spawn | post_spawn | bin, args | spawn a process |
| processes | /pkill | post_pkill | name | kill by app name |
| processes | /kill | post_kill | pid | kill by pid |
| system | /os | get_os |  | general os info |
| system | /uptime | get_uptime |  | show uptime info |
| system | /xrandr | get_xrandr |  | monitors and resolutions |
| system | /apps | get_apps |  | list installed apps |
| system | /dtoverlay | get_dtoverlay |  | list of all possible overlays |
| system | /options | get_options | refresh | list all possible config options |
| system | /config | get_config |  | view /boot/config.txt |
| system | /config | post_config |  | write /boot/config.txt |
| system | /vcgencmd | get_vcgencmd |  | view all possible vcgencmd commands |
| system | /vcgencmd | post_vcgencmd | args | VideoCore GPU info via vcgencmd |
| system | /videocore | get_videocore |  | report VideoCore GPU information |
| scripts | /chromium_kiosk | get_chromium_kiosk | display=:0, touchscreen=13, pinch, incognito=true, address | no description |
| scripts | /touchscreen_ids | get_touchscreen_ids | display=:0 | no description |