#!/bin/bash
# https://pimylifeup.com/raspberry-pi-kiosk/

URL="http://localhost"

xset s noblank
xset s off
xset -dpms

unclutter -idle 0.5 -root &
/usr/bin/chromium-browser --noerrdialogs --disable-infobars --kiosk ${URL}
