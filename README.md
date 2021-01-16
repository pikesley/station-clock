# Station Clock

## Software

This was done on a pristine Full Desktop Install of Raspberry Pi OS via [NOOBS 3.5](https://www.raspberrypi.org/downloads/noobs/)

>  Note that *this does not fit onto an 8-gig SD card* anymore, if it ever did

You'll need to use a proper screen for the install because the Hyperpixel won't work until you've installed the drivers

Once you've clicked through the language selection and so on, you need to enable SSH, which you can find from the Raspberry menu:

```
Preferences > Raspberry Pi Configuration > Interfaces > SSH
```

(or via `sudo raspi-config` in the terminal)

Once you've done this you should be able to get to the Pi with

```bash
ssh pi@raspberrypi.local
```

If this works, attach the Hyperpixel (or move the card to the Pi which has the Hyperpixel on it). When you boot it, the screen won't work, but we'll fix that in a minute

### Install the screen driver

Per [this](https://github.com/pimoroni/hyperpixel4):

```bash
curl https://get.pimoroni.com/hyperpixel4 | bash
```

Select the correct screen and Pi combination and let it do its thing. When it's done it will reboot. Now

### Install some tools

```bash
sudo apt-get update
sudo apt-get install -y xdotool unclutter nginx
```

### Enable the virtualhost and the service

```bash
sudo ln -sf /home/pi/station-clock/nginx/site.conf /etc/nginx/sites-enabled/default
sudo systemctl enable /home/pi/station-clock/systemd/clock.service
```

### Get and patch the clock js

```bash
git clone https://github.com/danielpradilla/d3clock
patch --verbose  --ignore-whitespace --unified d3clock/clock.html --input patches/clock.html.patch
patch --verbose  --ignore-whitespace --unified d3clock/d3clock.js --input patches/d3clock.js.patch
```

### (Optionally) disable the low-power warnings

```bash
echo "avoid_warnings=2" | sudo tee -a /boot/config.txt
```

### Reboot

```bash
sudo reboot
```

## Hardware

Anybody remember [Nimuno Loops](https://twitter.com/nimunoloops?lang=en) (which I think maybe became [Mayka Tape](https://www.thetoyshop.com/lego-construction/building-blocks/Mayka-Tape---2-Stud-Dark-Green-2-Metres-By-ZURU/p/532182_Dgreen))? I have 4 boxes of this stuff from when I backed it on IndieGogo but I never found a use for it until now.
