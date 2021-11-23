import createScriptEndpoint from './createScriptEndpoint.js'
import * as types from './types.js'

export default [

	createScriptEndpoint({
		url: '/chromium_kiosk',
		params: {
			display: ':0',
			touchscreen: 13,
			pinch: false,
			incognito: true,
			address: ''
		},
		script: o => ({
			bin: `DISPLAY=${o.display} chromium-browser`,
			args: [
				`--kiosk`, 
				`--disable-features=TranslateUI`, 
				`--touch-devices=${o.touchscreen}`, 
				`--check-for-update-interval=31536000`, 
				`--app-auto-launched`, 
				`${pinch?'':'--disable-pinch'}`, 
				`${o.incognito?'--incognito':''}`, 
				`--noerrdialogs`, 
				`--disable-suggestions-service`, 
				`--disable-translate`, 
				`--disable-save-password-bubble`, 
				`--disable-session-crashed-bubble`, 
				`--disable-infobars`, 
				`--app=${o.address}`
			]
		})
	}),
	createScriptEndpoint({
		url: '/touchscreen_ids',
		params: {
			display: ':0'
		},
		script: `
ids=$(DISPLAY=:0 xinput --list | awk -v search="$1" \
    '$0 ~ search {match($0, /id=[0-9]+/);\
                  if (RSTART) \
                    print substr($0, RSTART+3, RLENGTH-3)\
                 }'\
     )

for i in $ids
do
	echo $i
done`
	})

]