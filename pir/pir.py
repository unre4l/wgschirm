import RPi.GPIO as GPIO
import time
import subprocess
import sys

GPIO.setmode(GPIO.BCM)
GPIO_PIR = 23
GPIO.setup(GPIO_PIR,GPIO.IN)

remainingSeconds = 0
TIME_OFFSET = 5 * 60 # 5 mins
sleeping = False

argsOn = ['/usr/bin/vcgencmd', 'display_power', '1']
argsOff = ['/usr/bin/vcgencmd', 'display_power', '0']
argsRaspotifyRestart = ['sudo', 'systemctl', 'restart', 'raspotify']

while GPIO.input(GPIO_PIR) != 0:
  time.sleep(0.1)

def MOTION(PIR_GPIO):
  global remainingSeconds
  if not sleeping:
    remainingSeconds = TIME_OFFSET
    p = subprocess.Popen(argsOn)
    p.wait()
    print "turn on"
    sys.stdout.flush()

try:
  GPIO.add_event_detect(GPIO_PIR, GPIO.RISING, callback=MOTION)
  while True:
    if remainingSeconds > 0:
      remainingSeconds = remainingSeconds - 1

    if remainingSeconds == 0:
      sleeping = True
      print "turn off"
      p = subprocess.Popen(argsRaspotifyRestart)
      p.wait()
      p = subprocess.Popen(argsOff)
      p.wait()
      sys.stdout.flush()
      time.sleep(10) # prevent motion detecion from turning off monitor
      sleeping = False
      remainingSeconds = 50

    time.sleep(1)

except KeyboardInterrupt:
  GPIO.cleanup()
