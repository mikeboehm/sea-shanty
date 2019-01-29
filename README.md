
## Getting node-rpio to work
### Raspbian
Instructions from: https://github.com/raspberrypi/linux/issues/2550#issuecomment-398412562

Check your Kernel version using `$ uname -r`

If the version is < `4.14.52`:
1. [Download `gpio-no-irq.dtbo`](gpio-no-irq.dtbo)
2. Copy it to `/boot/overlays/gpio-no-irq.dtbo`
3. Add `dtoverlay=gpio-no-irq` to `/boot/config.txt`
4. Reboot

If you kernel version is  < `4.14.52`:
1. Check that `/boot/overlays/gpio-no-irq.dtbo` exists. If it doesn't, follow the steps above
2. Add `dtoverlay=gpio-no-irq` and `dtoverlay=hifiberry-dac` to `/boot/config.txt`
3. Reboot


### Balena.io
After burning the image and before booting for the first time:
1. Mount the SD card on your computer 
2. Copy `gpio-no-irq.dtbo` to `/overlays/`
3. Append `dtoverlay=gpio-no-irq` and `dtoverlay=hifiberry-dac` to config.txt
4. Put the card back in the Pi and power up
5. Check in the "Device Configuration" panel in the dashboard that the property `RESIN_HOST_CONFIG_dtoverlay` has a value of `"gpio-no-irq", "hifiberry-dac"`
