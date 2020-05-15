# Motion sensor (PIR)

A pir sensor increases greatly the usablitiy of *wgschirm*. It will turn on/off your screen and disconnect raspotify clients when nobody is in the room.

## Setup

Connect your pir sensor to your raspberry

| Sensor | Raspberry    |
|--------|--------------|
| VCC    | 2 (5V)       |
| OUT    | 16 (GPIO 23) |
| GND    | 6 (Ground)   |

Turn sensitivity to the right and hold signal to the left on the sensor.

## Install

1. copy `pir.py` to your home folder
2. create service with `sudo nano /lib/systemd/system/pir.service` and following content:

```
[Unit]
Description=PIR Display Service
After=multi-user.target

[Service]
Type=idle
ExecStart=/usr/bin/python /home/pi/pir.py > /home/pi/pir.log 2>&1

[Install]
WantedBy=multi-user.target
```
3. enable service `sudo systemctl enable pir.service`
4. start `sudo systemctl start pir.service` and check `systemctl status pir.service` if it runs


